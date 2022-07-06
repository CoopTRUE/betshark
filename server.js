import express from 'express'
const app = express()
import { join, resolve } from 'path'
import cors from 'cors'

// modules don't have __dirname
const __dirname = resolve()

app.use(cors())
app.use(express.static(join(__dirname, 'dist')))

app.get('/tickets/:address', (request, response) => {
    const address = request.params.address
    console.log(request.params)
    if (address === undefined || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return response.status(400).send('Invalid address')
    }
    return response.json(5)
})

app.get('*', (request, response) => {
    response.sendFile(resolve(__dirname, 'dist', 'index.html'))
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});