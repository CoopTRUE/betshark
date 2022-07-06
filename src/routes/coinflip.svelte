<script>
  import { onMount } from 'svelte'
  import { web3, address } from '../stores'
  import MetaButton from '../lib/Login.svelte'
  import Tickets from '../lib/Tickets.svelte'
  let tickets;

  let flipSide
  let flipable = false
  let triesRemaining = 0

  const flip = () => {

  }
</script>

<MetaButton />
<Tickets />
<div class="content">
  <div
    class="coin"
    class:heads={flipSide=='heads'}
    class:tails={flipSide=='tails'}
    on:click={flip}
  >
    <div class="heads-side"></div>
    <div class="tails-side"></div>
  </div>
  <button on:click={flip}>Flip!</button>
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
</style>