const express = require('express')
const app = express()
const port = 5000
const cors = require('cors')
const products = require("./products.json")

// app.use(express.json())
app.use(cors())
//products list 


app.get('/', (req, res) => {
  res.send('hello world')
})
app.get('/products', (req, res) => {
  res.send(products)
})
app.get('/product/:productId', (req, res) => {
  const id = req.params.productId;
  res.json(products[id])
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})