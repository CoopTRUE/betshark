import express from 'express'
const app = express()
import { join, resolve } from 'path'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
import Web3 from 'web3'
const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org'))

// modules don't have __dirname
const __dirname = resolve()


app.use(cors())
app.use(express.json());
app.use(express.static(join(__dirname, 'dist')))

import {
    connect,
    findAccount,
    createAccount,
    addTickets,
    removeTickets
} from './db.js'
connect()

app.post('/api/buyTickets', async (request, response) => {
    const { uuid } = request.body
    if (uuid === undefined || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuid)) {
        return response.status(400).send('Invalid address')
    }
    const account = await findAccount(uuid)
    if (account === null) {
        return response.status(404).send('Account not found')
    }
    return response.json({ tickets: account.tickets })
})

app.post('/api/getTickets', async (request, response) => {
    // doesn't matter if uuid gets leaked in request somehow because cashout only sends money to the address in database
    const { uuid } = request.body
    if (uuid === undefined || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuid)) {
        return response.status(400).send('Invalid UUID')
    }

    const account = await findAccount(uuid)
    if (account === null) {
        return response.status(404).send('Account not found')
    }
    return response.json({ tickets: account.tickets })
})

app.post('/api/login', async (request, response) => {
    const { address, signature } = request.body
    if (address === undefined || !/^0x[a-fA-F0-9]{40}$/.test(address) || signature === undefined) {
        return response.status(400).send('Invalid request')
    }
    // massive shout out to https://ethereum.stackexchange.com/questions/2660/how-can-i-verify-a-signature-with-the-web3-javascript-api
    // address doesn't really need to be stored but it's useful for debugging
    // signature can completely verify an account
    if (web3.eth.accounts.recover('Hai I am '+address, signature).toLowerCase() != address) {
        return response.status(401).send('Invalid signature')
    }

    let account = await findAccount(signature)
    if (account === null) {
        const uuid = uuidv4()
        await createAccount(address, signature, uuid)
        return response.json({ uuid })
    }
    return response.json({ uuid: account.uuid, tickets: account.tickets })
})

app.get('*', (request, response) => {
    response.sendFile(resolve(__dirname, 'dist', 'index.html'))
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});