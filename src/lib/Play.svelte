<script>
  import { uuid, tickets, apiUrl } from '../stores'
  import axios from 'axios'
  import { toast } from '@zerodevx/svelte-toast'
  import GAMES from '../../constants/GAMES'

  export let game = ''
  export let click = (..._)=>{}
  export let precheck = ()=>true
  export let onfail = ()=>{}

  const play = async() => {
    if (!precheck()) return onfail()
    if ($tickets < GAMES[game].cost) {
      toast.push('Not enough tickets!', { classes: ['error'] })
      return onfail()
    }
    axios.post($apiUrl+'/play', {
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
  <div>Costs {GAMES[game].cost}🎟️</div>
</div>

<style>
  .main {
    display: flex;
    align-items: center;
    gap: 50px;
  }
</style>