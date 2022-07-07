<script>
  import { onMount } from 'svelte'
  import { web3, address, uuid } from '../stores'
  import { toast } from '@zerodevx/svelte-toast'
  import Web3 from 'web3/dist/web3.min.js'
  import axios from 'axios';

  let provider

  const connectMetamask = async() => {
    // @ts-ignore
    provider = window.ethereum
    if (!provider) {
      toast.push('Please install web3 wallet!', {
        theme: {
          '--toastBackground': '#F56565',
          '--toastBarBackground': '#C53030'
        }
      })
      return
    }
    if (!$web3) {
      web3.set(new Web3(provider, { transactionBlockTimeout: 9999 }))
    }
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
    address.set(provider.selectedAddress)
  }

  const signIn = async() => {
    await connectMetamask()
    if (!$address) return
    const id = toast.push('Waiting for user to sign...', {
      initial: 0,
      // next: 0,
      dismissable: false
    })

    toast.set(id, {
        msg: 'Waiting for signature confirmation...',
        next: 0.33,
    })

    const message = $web3.utils.fromUtf8('Hai I am ' + $address)
    let signature
    try {
      signature = await($web3.eth.personal.sign(message, $address))
    } catch (error) {
      toast.set(id, {
        msg: 'EROR: User denied signature!',
        next: 1,
        theme: {
          '--toastBackground': '#F56565',
          '--toastBarBackground': '#C53030'
        }
      })
    }

    toast.set(id, {
        msg: 'Waiting for server confirmation...',
        next: 0.55,
    })

    axios.post('http://localhost:2000/login', {
      address: $address,
      signature: signature
    })
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
  }

  const signOut = async() => {

  }
</script>

<div class="button-container">
  {#if document.cookie.includes('uuid')}
    <button on:click={signOut}>Sign Out</button>
  {:else}
    <button on:click={signIn}>Sign In</button>
  {/if}
</div>


<style>
  .button-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>