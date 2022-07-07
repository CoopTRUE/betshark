<script>
  import { onMount, onDestroy } from 'svelte'
  import { uuid, tickets } from '../stores'
  import MetaButton from './Login.svelte'
  import axios from 'axios'

  export let needTickets = false

  const getTickets = async(uuid) => {
    const response = await axios.post('http://localhost:2000/api/getTickets', { uuid })
    tickets.set(response.data.tickets)
  }

  onMount(() => {
    if ($tickets!==null || !$uuid) {
      return
    }
    console.log('getTickets')
    getTickets($uuid)
  })
</script>

<div class="tickets">
  {$tickets ?? ''}🎟️
  {#if needTickets}
    <a href="tickets">Need tickets?</a>
  {/if}
</div>

<style>
  .tickets {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px
  }
</style>