<script>
  import { onMount } from 'svelte'
  import { chainId, uuid, tickets, ready, apiUrl } from '../stores'
  import { toast } from '@zerodevx/svelte-toast'
  import Web3 from 'web3/dist/web3.min.js'
  import axios from 'axios'
  import CHAINS from '../../constants/chains'
  let provider, web3
  let uuidCookie = false


  const connectMetamask = async() => {
    // @ts-ignore
    if (!provider) {
      return toast.push('Please install a web3 wallet!', { classes: ['error'] })
    }

    web3 = new Web3(provider, { transactionBlockTimeout: 9999 })
    try {
      await provider.request({ method: 'eth_requestAccounts' })
    } catch (err) {
      return toast.push('ERROR: User closed metamask!', { classes: ['error'] })
    }
  }

  const legitChain = async() => {
    let walletChainId = await provider.request({ method: 'eth_chainId' })
    walletChainId *= 1 // convert 0x to number
    if (!(walletChainId in CHAINS)) {
      toast.push('Please connect to a supported chain!', { classes: ['error'] })
      return false
    }
    $chainId = walletChainId
    return true
  }

  const login = async() => {
    await connectMetamask()
    if(!await legitChain()) return
    const address = provider.selectedAddress
    if (!address) return

    const id = toast.push('Waiting for user to sign...', {
      initial: 0,
      dismissable: false
    })
    toast.set(id, {
        msg: 'Waiting for signature confirmation...',
        next: 0.33,
    })

    const message = web3.utils.fromUtf8('Hai I am ' + address)
    let signature
    try {
      signature = await(web3.eth.personal.sign(message, address))
    } catch (error) {
      return toast.set(id, {
        msg: 'EROR: User denied signature!',
        next: 1,
        classes: ['error']
      })
    }

    toast.set(id, {
        msg: 'Waiting for server confirmation...',
        next: 0.55,
    })
    try {
      const response = await axios.post($apiUrl+'/login', {
        chainId: $chainId,
        address,
        signature
      })

      const today = new Date()
      // 7 day cookie expiration
      const expires = new Date(today.getTime() + 7*24*60*60*1000)
      document.cookie = `uuid=${response.data.uuid};path=/;expires=${expires.toUTCString()}`
      $uuid = response.data.uuid
      $tickets = response.data.tickets
      $ready = true
      toast.set(id, {
        msg: 'Success!',
        next: 1,
        classes: ['success']
      })
      uuidCookie = true
    } catch (error) {
      toast.set(id, {
        msg: 'EROR: Unknown server error!',
        next: 1,
        classes: ['error']
      })
    }
  }

  const logout = () => {
    document.cookie = 'uuid=;path=/'
    uuidCookie = false
    $uuid = null
    $tickets = 0
    $ready = false
  }

  onMount(async() => {
    if (document.cookie.includes('uuid')) {
      uuidCookie = !!document.cookie.split('uuid=')[1].split(';')[0]
      if (uuidCookie) $uuid=document.cookie.split('uuid=')[1].split(';')[0]
    } else {
      document.cookie = 'uuid=;path=/'
    }
    // @ts-ignore
    provider = window.ethereum
    if (provider) {
      if ($ready) return
      // signed in
      if (uuidCookie) {
        if (provider.selectedAddress) {
          if (!await legitChain()) return
          $ready = true
        }
        // signed in but not connected to metamask
        else {
          // give user a second chance to sign in
          await connectMetamask()
          if (!provider.selectedAddress) {
            toast.push('Logged in but metamask not connected! Logging out...', { classes: ['warning'] })
            logout()
          }
        }
      }
      // sign out automatically on account change
      provider.on('accountsChanged', () => {
        if (uuidCookie) {
          toast.push('ERROR: Metamask account doesn\'t match server account!', { classes: ['error'] })
          logout()
        }
      })
      provider.on('chainChanged', async() => {
        if (!await legitChain()) {
          logout()
        }
      })
    } else {
      toast.push('Please install web3 wallet!', { classes: ['error'] })
    }
  })
</script>

<div class="button-container">
  {#if $ready}
    {#if provider?.selectedAddress}
      {provider.selectedAddress.substring(0, 6)+'...'}
    {/if}
    <button on:click={logout}>Sign Out</button>
  {:else}
    <button on:click={login}>Sign In</button>
  {/if}
</div>


<style>
  .button-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>