<script>
  import { onMount } from 'svelte'
  import { tickets } from '../stores'
  import Login from '../lib/Login.svelte'
  import TicketTicker from '../lib/TicketTicker.svelte'
  import Play from '../lib/Play.svelte'
  import headsImg from '../assets/coinflip/heads.png'
  import tailsImg from '../assets/coinflip/tails.png'
  import { toast } from '@zerodevx/svelte-toast'

  let flipSide
  let selected = 'heads'
  let spinning = false

  const flip = data => {
    flipSide = ''
    if (data.win) {
      flipSide = selected
      setTimeout(() => {
        toast.push('You won!', { classes: ['success'] })
      }, 4300)
    } else {
      flipSide = selected=='heads' ? 'tails' : 'heads'
      setTimeout(() => {
        toast.push('You lost!', { classes: ['error'] })
      }, 4300)
    }

    setTimeout(() => {
      $tickets = data.tickets
      flipSide=''
      spinning = false
    }, 4300)
  }
  const handleClick = () => {
    if (spinning) return
    flipSide=''
    selected = selected=='heads' ? 'tails' : 'heads'
  }

  const precheck = () => {
    if (spinning) return
    return spinning = true
  }
</script>

<Login />
<TicketTicker />
<div class="content">
  <div
    on:click={handleClick}
    class="coin"
    class:heads={flipSide=='heads'}
    class:tails={flipSide=='tails'}
    class:heads-selected={selected == 'heads'}
    class:tails-selected={selected == 'tails'}
  >
    <div class="heads-side">
      <img src={headsImg} alt="">
    </div>
    <div class="tails-side">
      <img src={tailsImg} alt="">
    </div>
  </div>
  <Play game="coinflip" click={flip} precheck={precheck} onfail={()=>spinning=false}>
    Flip!
  </Play>
  <h5>50% win 5% house edge rounded</h5>
</div>

<style>
  .coin {
    width: 200px;
    height: 200px;
  }
  .coin div {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: inset 0 0 45px rgba(255,255,255,.3);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  img {
    width: 100%;
    height: 100%;
  }
  .heads-side {
    background-color: #bb0000;
  }
  .tails-side {
    background-color: #3e3e3e;
  }

  .coin {
    transition: transform 1s ease-in;
    transform-style: preserve-3d;
  }
  .coin div {
    position: absolute;
    backface-visibility: hidden;
  }
  .heads-side {
    z-index: 100;
  }
  .tails-side {
    transform: rotateY(-180deg);
  }

  .heads {
    animation: flipHeads 4s forwards;
  }
  .tails {
    animation: flipTails 4s forwards;
  }

  @keyframes flipHeads {
    from {
      transform: rotateY(0);
    }
    to {
      transform: rotateY(1800deg);
    }
  }
  @keyframes flipTails {
    from {
      transform: rotateY(0);
    }
    to {
      transform: rotateY(1980deg);
    }
  }

  .heads-selected {
    transform: rotateY(0);
  }
  .tails-selected {
    transform: rotateY(180deg);
  }
</style>