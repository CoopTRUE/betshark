<script>
  import { onMount, onDestroy } from 'svelte'
  import { web3, address } from '../stores'
  import { toast } from '@zerodevx/svelte-toast'
  import Web3 from 'web3/dist/web3.min.js'

  let provider, addressValue
  const unsubscribe = address.subscribe(value => {
    addressValue = value
  });

  const connectMetamask = async() => {
    if (provider === undefined) {
      web3Error()
      return
    }
    if (addressValue === null) {
      if (!provider.selectedAddress) {
        await provider.request({ method: 'eth_requestAccounts' })
      }
      address.set(provider.selectedAddress)
    }
  }

  const web3Error = () => {
    toast.push('Please install web3 wallet!', {
        theme: {
          '--toastBackground': '#F56565',
          '--toastBarBackground': '#C53030'
        }
    })
  }

  onMount(() => {
    // @ts-ignore
    provider = window.ethereum
    if (provider === undefined) {
      return
    }
    if (web3 !== null) {
      web3.set(new Web3(provider, { transactionBlockTimeout: 9999 }))

    }
    connectMetamask()

    provider.on('accountsChanged', accounts => {
      if (accounts.length > 0) {
        address.set(accounts[0])
      } else {
        address.set(null)
      }
    });
  })


  onDestroy(unsubscribe)
</script>

<div class="button-container">
  <button on:click={connectMetamask}>
    {$address ?? 'Connect to Metamask'}
  </button>
</div>


<style>
  .button-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>