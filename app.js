const express = require('express')
const cors = require('cors')
const path = require('path')

const usersRoutes = require('./routes/Users')
const articlesRoutes = require('./routes/Articles')

const app = express()
app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})


app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/articles', articlesRoutes)
app.use('/auth', usersRoutes)
module.exports = app