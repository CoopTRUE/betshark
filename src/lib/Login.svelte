<script>
  import { onMount } from 'svelte'
  import { uuid, tickets } from '../stores'
  import { toast } from '@zerodevx/svelte-toast'
  import Web3 from 'web3/dist/web3.min.js'
  import axios from 'axios';

  let provider, web3
  let uuidCookie
  let address = ''

  const connectMetamask = async() => {
    // @ts-ignore
    if (!provider) {
      toast.push('Please install web3 wallet!', {
        theme: {
          '--toastBackground': '#F56565',
          '--toastBarBackground': '#C53030'
        }
      })
      return
    }
    web3 = new Web3(provider, { transactionBlockTimeout: 9999 })
    try {
      await provider.request({ method: 'eth_requestAccounts' })
    } catch (err) {
      toast.push('ERROR: User closed metamask!', {
        theme: {
          '--toastBackground': '#F56565',
          '--toastBarBackground': '#C53030'
        }
      })
      return
    }
    address = provider.selectedAddress
  }

  const login = async() => {
    await connectMetamask()
    if (!address) return
    const id = toast.push('Waiting for user to sign...', {
      initial: 0,
      next: 0,
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
      toast.set(id, {
        msg: 'EROR: User denied signature!',
        next: 1,
        theme: {
          '--toastBackground': '#F56565',
          '--toastBarBackground': '#C53030'
        }
      })
      return
    }

    toast.set(id, {
        msg: 'Waiting for server confirmation...',
        next: 0.55,
    })

    try {
      const response = await axios.post('http://localhost:2000/api/login', {
        address: address,
        signature: signature
      })
      document.cookie = 'uuid=' + response.data.uuid + ';path=/'
      $uuid = response.data.uuid
      $tickets = response.data.tickets
      toast.set(id, {
        msg: 'Success!',
        next: 1,
      })
      uuidCookie = true
    } catch (error) {
      toast.set(id, {
        msg: 'EROR: Unknown server error!',
        next: 1,
        theme: {
          '--toastBackground': '#F56565',
          '--toastBarBackground': '#C53030'
        }
      })
    }
  }

  const logout = () => {
    document.cookie = 'uuid=;path=/'
    uuidCookie = false
    $uuid = null
    $tickets = 0
  }

  onMount(() => {
    if (document.cookie.includes('uuid')) {
      uuidCookie = !!document.cookie.split('uuid=')[1].split(';')[0]
    } else {
      document.cookie = 'uuid=;path=/'
      uuidCookie = false
    }
    // @ts-ignore
    provider = window.ethereum
    provider?.on('accountsChanged', () => {
      if (!uuidCookie) return
      toast.push('ERROR: Metamask account doesn\'t match server account', {
        theme: {
          '--toastBackground': '#F56565',
          '--toastBarBackground': '#C53030'
        }
      })
      logout()
    })
  })

</script>

<div class="button-container">
  {#if uuidCookie}
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