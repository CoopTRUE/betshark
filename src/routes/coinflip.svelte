<script context="module">
  import { writable } from 'svelte/store'
  const clickedBefore = writable(false)
</script>

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
    } else {
      flipSide = selected=='heads' ? 'tails' : 'heads'
    }

    setTimeout(() => {
      flipSide=''
      spinning = false
    }, 4300)
  }
  const handleFlip = () => {
    if (spinning) return
    $clickedBefore = true
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
    on:click={handleFlip}
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
  <Play game="coinflip" click={flip} precheck={precheck} onfail={()=>spinning=false} time={4300}>
    Flip!
  </Play>
  <div>Click the coin to change which side you are betting on</div>
</div>

<style>
  .coin {
    width: 200px;
    height: 200px;
    cursor: pointer;
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
    filter: drop-shadow(0 0 11px #0066ff);
  }
  .heads-side {
    background-color: black;
  }
  .tails-side {
    background-color: whitesmoke;
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