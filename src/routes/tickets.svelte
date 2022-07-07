<script>
  import { toast } from '@zerodevx/svelte-toast'
  import axios from 'axios'
  import { web3, address } from '../stores'
  import Login from '../lib/Login.svelte'
  import TicketTicker from '../lib/TicketTicker.svelte'
  import ABI from '../../constants/abi.json'
  import COINS from '../../constants/coins'
  import CHAINS from '../../constants/chains'
  import SERVER_WALLET from '../../constants/serverwallet'
  import usdc from '../assets/crypto/usdc.svg'
  import usdt from '../assets/crypto/usdt.svg'
  import busd from '../assets/crypto/busd.svg'

  let ticketCount = 0
  const cryptoTypes = {
    usdc,
    usdt,
    busd
  }
  let cryptoType = ''

  const purchase = () => {
    if (cryptoType==='' || ticketCount===0) return
    const id = toast.push('Purchasing...', {
      initial: 0,
      next: 0,
      dismissable: false
    })
    const contract = new $web3.eth.Contract(ABI, COINS[56][cryptoType])
    const sendCoins = contract.methods.transfer(
        SERVER_WALLET,
        $web3.utils.toWei(
            ticketCount.toString(),
            CHAINS[56][2]
        )
    )
    sendCoins.send({
      from: $address,
      value: 0,
      maxPriorityFeePerGas: null,
      maxFeePerGas: null,
    }).then(txn => {
      console.log(txn)
    }).catch(err => {
      console.log(err)
      toast.set(id, {
        msg: 'Error: ' + (err.code===4001 ? 'User denied transaction!' : 'UNKNOWN ERROR'),
        next: 1,
        theme: {
          '--toastBackground': '#F56565',
          '--toastBarBackground': '#C53030'
        }
      })
    })

    // axios.get('http://localhost:2000/buyTickets', {
    //   params: {
    //     address: $address.get(),
    //     ticketCount: ticketCount,
    //     selected: selected
    //   }
    // })
    //   .then(res => {
    //     console.log(res)
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })
  }
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
  }
  .inner-inner{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 50px;
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
  .value-picker * {
    cursor: pointer;
    font-size: 80px;
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
    width: 400px;
    height: 40px;
    border-radius: 50px;
    font-weight: bold;
    font-size: 20px;
    background-color: #00a8ff;
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