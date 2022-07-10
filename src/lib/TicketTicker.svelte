<script>
  import { onMount, onDestroy } from 'svelte'
  import { uuid, tickets } from '../stores'
  import axios from 'axios'
  import { toast } from '@zerodevx/svelte-toast'

  export let needTickets = true

  const getTickets = async(uuid) => {
    try {
      const response = await axios.post('http://localhost:2000/api/getTickets', { uuid })
      $tickets = response.data.tickets
    } catch (error) {
      toast.push('ERROR: Unknown server error!', { classes: ['error'] })
    }
  }

  onMount(() => {
    if ($tickets==0  && $uuid) {
      console.log('getTickets')
      getTickets($uuid)
    }
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