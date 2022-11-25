const http = require('http')
const app = require('./app')
const server = http.createServer(app)

// Returns a valid port, whether supplied as a number or a string
const normalizePort = val => {
    const port = parseInt(val, 10)
    if (isNaN(port)) { return val }
    if (port >= 0) { return port }
    return false
}
const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

// Searches for the various errors and handles them appropriately. It is then saved in the server
const errorHandler = error => {
    if (error.syscall !== 'listen') { throw error }
    const address = server.address()
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.')
            process.exit(1)
            break
        default:
            throw error
    }
}

// An event listener logging the port or named pipe the server is running on in the console
server.on('error', errorHandler)
server.on('listening', () => {
    const address = server.address()
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
    console.log(`\n ✅ Live server listening 👂 on ${bind} ❕ \n
  📚 ACCESS DOCUMENTATION SERVER 📚 ===> http://127.0.0.1:${bind.split('port ')[1]}/\n`)
})
server.listen(port)