import express from 'express'
const app = express()
import { join, resolve } from 'path'
import cors from 'cors'
import compression from 'compression'
import { v4 as uuidv4 } from 'uuid'

// modules don't have __dirname
const __dirname = resolve()

app.use(cors())
app.use(express.json());
app.use(compression())
app.use(express.static(join(__dirname, 'dist')))

import {
  connect,
  findAccount,
  createAccount,
  addTickets,
  removeTickets,
  addTicketTransaction,
  getTicketTransactions
} from './db.js'
connect()

import GAMES from './constants/games.js'
import SERVER_WALLET from './constants/serverwallet.js'
import CHAINS from './constants/chains.js'
import COINS from './constants/coins.js'
import ABI from './constants/abi.json'
import Web3 from 'web3'
import abiDecoder from 'abi-decoder'

// create web3 instances prematurely to avoid slowdown on individual requests
const web3Instances = {}
for (const [id, chainData] of Object.entries(CHAINS)) {
  web3Instances[id] = new Web3(new Web3.providers.HttpProvider(chainData.rpc))
}

app.post('/api/buyTickets', async (req, res) => {
  const { chainId, uuid, transactionHash } = req.body
  if (!(chainId in CHAINS)) {
    return res.status(400).send('Invalid chainId')
  }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuid)) {
    return res.status(400).send('Invalid uuid')
  }
  if (!/^0x([A-Fa-f0-9]{64})$/.test(transactionHash)) {
    return res.status(400).send('Invalid transaction hash')
  }
  const account = await findAccount(uuid)
  if (account === null) {
    return res.status(404).send('Account not found')
  }
  const transactions = await getTicketTransactions();
  if (transactions.includes(transactionHash)) {
    return res.status(400).json('Transaction already used')
  }
  addTicketTransaction(transactionHash)

  const web3 = web3Instances[chainId]
  const eth = web3.eth
  const transaction = await eth.getTransaction(transactionHash)
  if (transaction === null) {
    return res.status(404).send('Transaction hash doesn\'t exist')
  }
  const contract_address = transaction.to
  if (!Object.values(COINS[chainId]).includes(contract_address)) {
    return res.status(404).send('Transaction hash doesn\'t interact with a valid contract')
  }
  abiDecoder.addABI(ABI)
  const transactionParams = abiDecoder.decodeMethod(transaction.input).params
  console.log(transactionParams)
  if (transactionParams[0].value !== SERVER_WALLET) {
    return res.status(404).send('Transaction is not to the server wallet')
  }
  const value = parseFloat(web3.utils.fromWei(transactionParams[1].value, CHAINS[chainId].wei))
  if (value<5 || value%5) {
    return res.status(404).send('Transaction is not a valid amount')
  }

  await addTickets(uuid, value)
  return res.json({ tickets: account.tickets+value })
})

app.post('/api/getTickets', async (req, res) => {
  // doesn't matter if uuid gets leaked in request somehow because cashout only sends money to the address in database
  const { uuid } = req.body
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuid)) {
    return res.status(400).send('Invalid UUID')
  }

  const account = await findAccount(uuid)
  if (account === null) {
    return res.status(404).send('Account not found')
  }
  return res.json({ tickets: account.tickets })
})

app.post('/api/login', async (req, res) => {
  const { chainId, address, signature } = req.body
  if (!(chainId in CHAINS)) {
    return res.status(400).send('Invalid chainId')
  }
  if (!/^0x[a-fA-F0-9]{40}$/.test(address) || signature === undefined) {
    return res.status(400).send('Invalid request')
  }
  // massive shout out to https://ethereum.stackexchange.com/questions/2660/how-can-i-verify-a-signature-with-the-web3-javascript-api
  // address doesn't really need to be stored but it's useful for debugging
  // signature can completely verify an account
  const web3 = web3Instances[chainId]
  if (web3.eth.accounts.recover('Hai I am '+address, signature).toLowerCase() != address) {
    return res.status(404).send('Invalid signature')
  }

  let account = await findAccount(signature)
  if (account === null) {
    const uuid = uuidv4()
    await createAccount(address, signature, uuid)
    return res.json({ uuid })
  }
  return res.json({ uuid: account.uuid, tickets: account.tickets })
})

// let tickets = 100  // temporary tickets variable for testing odds
app.post('/api/play', async (req, res) => {
  console.log('asdfsdf')
  const { uuid, game } = req.body
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuid)) {
    return res.status(400).send('Invalid UUID')
  }
  if (!(game in GAMES)) {
    return res.status(400).send('Invalid game')
  }
  const account = await findAccount(uuid)
  if (account === null) {
    return res.status(404).send('Account not found')
  }
  const gameInfo = GAMES[game]
  console.log(gameInfo)
  if (account.tickets < gameInfo.cost) {
    return res.status(404).send('Not enough tickets')
  }

  const win = Math.random() < gameInfo.odds
  const prize = Math.floor(
    (gameInfo.times ? gameInfo.cost*gameInfo.times : gameInfo.cost)
    * (1 - gameInfo.edge)
  )
  console.log(win, prize)
  return res.json({
    win,
    tickets: win ? await addTickets(uuid, prize) : await removeTickets(uuid, GAMES[game].cost)
    // tickets: win ? tickets+=prize : tickets-=GAMES[game].cost
  })
})

app.post('/api/cashout', async (req, res) => {
  const { uuid, chainId } = req.body
  console.log(uuid, chainId)
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuid)) {
    return res.status(400).send('Invalid UUID')
  }
  if (!(chainId in CHAINS)) {
    return res.status(400).send('Invalid chainId')
  }
  const account = await findAccount(uuid)
  if (account === null) {
    return res.status(404).send('Account not found')
  }
  const tickets = account.tickets
  if (tickets < 15) {
    return res.status(404).send('Not enough tickets')
  }

  await removeTickets(uuid, 15)
  try {
    const web3 = web3Instances[chainId]
    const eth = web3.eth
    const nonce = await eth.getTransactionCount(SERVER_WALLET)

    const contract = new eth.Contract(ABI, COINS[chainId].busd)
    const transfer = contract.methods.transfer(
      account.address,
      web3.utils.toWei('15', CHAINS[chainId].wei)
    )
    const transaction = await eth.accounts.signTransaction({
      from: SERVER_WALLET,
      to: COINS[chainId].busd,
      data: transfer.encodeABI(),
      value: 0,
      gas: await transfer.estimateGas({ from: SERVER_WALLET }),
      gasPrice: web3.utils.toWei('5', 'gwei'),
      nonce
    }, process.env.BETSHARK_PRIVATE_KEY)
    const txnHash = await eth.sendSignedTransaction(transaction.rawTransaction)

    return res.json({ txn: txnHash.transactionHash })
  } catch (_) {
    await addTickets(uuid, 15)
    return res.status(500).send('Internal server error')
  }

})

app.get('*', (request, response) => {
  response.sendFile(resolve(__dirname, 'dist', 'index.html'))
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});