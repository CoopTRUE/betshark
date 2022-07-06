<script>
  import MetaButton from '../lib/MetaButton.svelte'
  import Tickets from '../lib/Tickets.svelte'
  import usdc from '../assets/crypto/usdc.svg'
  import usdt from '../assets/crypto/usdt.svg'
  import busd from '../assets/crypto/busd.svg'

  const cryptoTypes = {
    usdc,
    usdt,
    busd
  }
</script>

<MetaButton />
<Tickets needTickets={false}/>
<div class="content">
  <div class="inner">
    <div class="value-picker">
      <div class="up">▲</div>
      <div class="value-number">54</div>
      <div class="down">▼</div>
    </div>
    <div class="crypto-type-picker">
      {#each Object.entries(cryptoTypes) as [cryptoName, cryptoImage]}
        <div class="crypto-type">
          <img src={cryptoImage} alt={cryptoName+" stablecoin"}>
        </div>
      {/each}
    </div>
  </div>
  <button class="purchase">PURCHASE TICKETS</button>
</div>

<style>
  .inner{
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid white;
    border-radius: 5px;
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
    /* gap: 45px; */

  }
  .value-picker * {
    cursor: pointer;
    font-size: 140px;
  }
  .crypto-type-picker{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    width: 400px;
    gap: 10px;
  }
  .crypto-type img {
    height: 130px;
  }
  .purchase {
    cursor: pointer;
    width: 400px;
    height: 40px;
    border-radius: 50px;
  }
</style>