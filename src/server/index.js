require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

// example API call
app.get('/mars', async (req, res) => {
    const rover = 'curiosity'
    const date = new Date()
    date.setDate(date.getDate() - 1)
    
    try {
        // let json = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${date.toLocaleDateString()}&api_key=${process.env.API_KEY}`)
        //     .then(res => res.json())
        const json = await fetch(`http://localhost:3000/data/mars-photos.json`)
        .then(res => res.json())
        res.send(json)
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))