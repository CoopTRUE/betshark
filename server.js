import express from 'express'
const app = express()
import { join, resolve } from 'path'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'

// modules don't have __dirname
const __dirname = resolve()


app.use(cors())
app.use(express.static(join(__dirname, 'dist')))

import {
    connect,
    findAccount,
    createAccount,
    addTickets,
    removeTickets
} from './db.js'
connect()

app.get('/tickets/:address', async (request, response) => {
    const address = request.params.address
    console.log(request.params)
    if (address === undefined || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return response.status(400).send('Invalid address')
    }
    const account = await findAccount(address)
    if (account === null) {
        return response.status(404).send('Account not found')
    }
    console.log(account)
    return response.json(account.tickets)
})

app.get('/login', async (request, response) => {
})

app.get('*', (request, response) => {
    response.sendFile(resolve(__dirname, 'dist', 'index.html'))
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});