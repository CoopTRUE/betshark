<script>
  import Login from '../lib/Login.svelte'
  import TicketTicker from '../lib/TicketTicker.svelte'
  import { ready, uuid, tickets, chainId, apiUrl } from '../stores'
  import axios from 'axios'
  import { toast } from '@zerodevx/svelte-toast'

  const cashout = () => {
    if (!$ready) {
      return toast.push('Please login first!', { classes: ['error'] })
    }
    if ($tickets < 15) {
      return toast.push('You can only cashout 15 tickets at a time!', { classes: ['error'] })
    }
    const id = toast.push('Cashing out... DO NOT REQUEST AGAIN UNTIL THIS IS CLOSED', {
      initial: 0,
      next: 0,
      dismissable: false
    })
    axios.post($apiUrl+'/cashout', {
      uuid: $uuid,
      chainId: $chainId
    })
    .then(res => {
      console.log(res)
      $tickets -= 15
      toast.set(id, {
        msg: 'Cash out successful! Check your wallet!',
        next: 1,
        classes: ['success']
      })
    })
    .catch(err => {
      toast.set(id, {
        msg: 'UNKOWN ERROR! Your tickets were not effected',
        next: 1,
        classes: ['error']
      })
    })
  }
</script>

<Login />
<TicketTicker />
<div class="content">
  <button on:click={cashout}>Request Cashout</button>
  <h3>
    Click <span>request cashout</span> to request a cashout of your current tickets into busd
  </h3>
</div>

<style>
  button {
    background-color: #fff;
    border: 1px solid #000;
    border-radius: 5px;
    font-size: 50px;
    padding: 10px;
    font-weight: bold;
    cursor: pointer;
    animation: greenBtn 4s ease-in-out infinite;
  }
  span {
    animation: greenText 4s ease-in-out infinite;
  }

  @keyframes greenBtn {
    0% {
      background-color: #a1ffa1;
    }
    50% {
      background-color: #00ff00;
    }
    100% {
      background-color: #a1ffa1;
    }
  }
  @keyframes greenText {
    0% {
      color: #a1ffa1;
    }
    50% {
      color: #00ff00;
    }
    100% {
      color: #a1ffa1;
    }
  }
</style>