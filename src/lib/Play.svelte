<script>
  import { uuid } from '../stores'
  import axios from 'axios'
  import { toast } from '@zerodevx/svelte-toast'


  export let game = ''
  export let cost = 0
  export let click = (..._)=>{}
  export let precheck = ()=>true

  const play = async() => {
    if (!precheck()) return
    axios.post('http://localhost:2000/api/play', {
      uuid: $uuid,
      game: game,
    })
    .then(response => {
      click(response.data)
    })
    .catch(error => {
      console.log(error)
    })
  }
</script>

<div class="main">
  <button on:click={play}>
    <slot />
  </button>
  <div>Costs {cost}🎟️</div>
</div>

<style>
  .main {
    display: flex;
    align-items: center;
    gap: 50px;
  }
</style>