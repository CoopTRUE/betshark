<script>
  import { onMount } from 'svelte'
  import { toast } from '@zerodevx/svelte-toast'
  import axios from 'axios'
  import { tickets, uuid } from '../stores'
  import Login from '../lib/Login.svelte'
  import TicketTicker from '../lib/TicketTicker.svelte'
  import ABI from '../../constants/abi.json'
  import COINS from '../../constants/coins'
  import CHAINS from '../../constants/chains'
  import SERVER_WALLET from '../../constants/serverwallet'
  import usdc from '../assets/crypto/usdc.svg'
  import usdt from '../assets/crypto/usdt.svg'
  import busd from '../assets/crypto/busd.svg'
  import Web3 from 'web3/dist/web3.min.js'

  let provider
  let ticketCount = 0
  const cryptoTypes = {
    usdc,
    usdt,
    busd
  }
  let cryptoType = ''

  const purchase = async() => {
    if (!cryptoType || !ticketCount) return
    if (!$uuid) {
      toast.push('Please login first!', {
        theme: {
          '--toastBackground': '#F56565',
          '--toastBarBackground': '#C53030'
        }
      })
      return
    }
    if (!provider) {
      toast.push('Please install web3 wallet!', {
        theme: {
          '--toastBackground': '#F56565',
          '--toastBarBackground': '#C53030'
        }
      })
      return
    }

    const web3 = new Web3(provider, { transactionBlockTimeout: 9999 })
    const id = toast.push('Purchasing...', {
      initial: 0,
      next: 0,
      dismissable: false
    })

    const contract = new web3.eth.Contract(ABI, COINS[56][cryptoType])
    const sendCoins = contract.methods.transfer(
        SERVER_WALLET,
        web3.utils.toWei(
            ticketCount.toString(),
            CHAINS[56][2]
        )
    )

    let txn
    try {
      txn = await sendCoins.send({
        from: provider.selectedAddress,
        value: 0,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
      })
    } catch (err) {
      toast.set(id, {
        msg: 'Error: ' + (err.code===4001 ? 'User denied transaction!' : 'UNKNOWN ERROR'),
        next: 1,
        theme: {
          '--toastBackground': '#F56565',
          '--toastBarBackground': '#C53030'
        }
      })
    }

    console.log(txn)

    axios.post('http://localhost:2000/api/buyTickets', {
      uuid,
      ticketCount
    })
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  onMount(() => {
    // @ts-ignore
    provider = window.ethereum
  })
</script>

<Login />
<TicketTicker needTickets={false}/>
<div class="content">
  <div class="inner">
    <div class="inner-inner">
      <div class="value-picker">
        <div class="up" on:click={()=>{ticketCount += 5}}>▲</div>
        <div class="value-number">{ticketCount}🎟️</div>
        <div class="down" on:click={()=>{ticketCount = Math.max(ticketCount-5, 0)}}>▼</div>
      </div>
      <div class="crypto-type-picker">
        {#each Object.entries(cryptoTypes) as [cryptoName, cryptoImage], index}
          <img
            src={cryptoImage}
            alt={cryptoName+" stablecoin"}
            class="crypto-type {cryptoName}"
            class:selected={cryptoType === cryptoName}
            on:click={()=>{cryptoType = cryptoName}}
          >
        {/each}
      </div>
    </div>
    <button class="purchase" class:grayed={cryptoType==='' || ticketCount===0} on:click={purchase}>
      PURCHASE {ticketCount} TICKETS
      {#if cryptoType !== ''}
        IN {cryptoType.toUpperCase()}
      {/if}
    </button>
  </div>
</div>

<style>
  .inner {
    border: 1px solid white;
    border-radius: 5px;
    padding: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  @media (max-width: 730px) {
    .content {
      height: fit-content;
    }
    .inner {
      width: 50vw;
    }
    .inner-inner {
      gap: 30px;
    }
    .value-picker {
      height: 400px !important;
    }
  }
  .inner-inner{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 50px;
    max-width: 100%;
  }
  .value-picker {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    overflow: hidden;
    width: 200px;
    height: 300px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 20px;
    text-align: center;
    gap: 15px;

  }
  .value-picker {
    font-size: 80px;
    min-width: 89px;
  }
  .up {
    cursor: pointer;
  }
  .down {
    cursor: pointer;
  }
  .crypto-type-picker{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    width: 400px;
    gap: 20px;
  }
  .crypto-type {
    height: 130px;
    cursor: pointer;
    transition: all 0.3s;
  }
  .crypto-type:not([class*="selected"]):hover {
    opacity: 0.5;
  }
  .purchase {
    cursor: pointer;
    /* width: 400px; */
    padding: 10px 20px;
    border-radius: 50px;
    font-weight: bold;
    font-size: 20px;
    background-color: #00a8ff;
    border: 0;
  }
  .grayed {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .selected.usdc {
    filter: drop-shadow(0 0 11px #307AFF);
  }
  .selected.usdt {
    filter: drop-shadow(0 0 11px #52E87D);
  }
  .selected.busd {
    filter: drop-shadow(0 0 11px #F0BA00);
  }
</style>