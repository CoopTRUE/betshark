import express from 'express'
const app = express()
import { join, resolve } from 'path'
import cors from 'cors'

app.use(cors())
app.use(express.static(join(resolve(), 'dist')))

app.get('*', (request, response) => {
    response.sendFile(resolve(__dirname, 'dist', 'index.html'))
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});