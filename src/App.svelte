<script>
  import { Router, Route, Link, link } from 'svelte-routing'
  import Navbar from './lib/Navbar.svelte';
  import Home from './routes/home.svelte'
  import Dice from './routes/dice.svelte'
  import Coinflip from './routes/coinflip.svelte'
  import Slots from './routes/slots.svelte'
</script>

<Navbar />
<Router>
  <Route path='/'><Home /></Route>
  <Route path='/slots'><Slots /></Route>
  <Route path='/dice'><Dice /></Route>
  <Route path='/coinflip'><Coinflip /></Route>
</Router>