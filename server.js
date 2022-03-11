const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())

const PORT = process.env.PORT || 5000

app.get('/', (request, response) => {
    response.json("Hello from server")
})

require("dotenv").config();

app.use(express.json())

const router = require('./src/routes')
app.use('/api/v1/', router)

app.use('/uploads', express.static('uploads'))

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})