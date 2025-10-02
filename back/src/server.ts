import http from 'http'
import app from './app'
import { AddressInfo } from 'net'

function normalizePort(val: string | number) {
    const port = typeof val === 'string' ? parseInt(val, 10) : val

    if (Number.isNaN(port)) return val
    if (port >= 0) return port

    return false
}

const rawPort = process.env.PORT ?? '4000'
const port = normalizePort(process.env.PORT ?? '4000')

if (port === false) {
    throw new Error(`Port invalide: ${rawPort}`)
}
app.set('port', port)

function errorHandler(error: NodeJS.ErrnoException) {
    if (error.syscall !== 'listen') throw error

    const address = server.address()
    const bind =
        typeof address === 'string'
            ? `pipe ${address}`
            : address && typeof address === 'object'
            ? `port ${address.port}`
            : `port ${port}`

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(bind + ' is already in use')
            process.exit(1)
            break
        default:
            throw error
    }
}

const server = http.createServer(app)

server.on('error', errorHandler)
server.on('listening', () => {
    const address = server.address()
    const bind =
        typeof address === 'string'
            ? `pipe ${address}`
            : address && (address as AddressInfo).port !== undefined
            ? `port ${(address as AddressInfo).port}`
            : `port ${port}`
    console.log(`Listening on ${bind}`)
})

server.listen(port)
