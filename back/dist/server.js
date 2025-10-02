"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
function normalizePort(val) {
    const port = typeof val === 'string' ? parseInt(val, 10) : val;
    if (Number.isNaN(port))
        return val;
    if (port >= 0)
        return port;
    return false;
}
const rawPort = process.env.PORT ?? '4000';
const port = normalizePort(process.env.PORT ?? '4000');
if (port === false) {
    throw new Error(`Port invalide: ${rawPort}`);
}
app_1.default.set('port', port);
function errorHandler(error) {
    if (error.syscall !== 'listen')
        throw error;
    const address = server.address();
    const bind = typeof address === 'string'
        ? `pipe ${address}`
        : address && typeof address === 'object'
            ? `port ${address.port}`
            : `port ${port}`;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
const server = http_1.default.createServer(app_1.default);
server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string'
        ? `pipe ${address}`
        : address && address.port !== undefined
            ? `port ${address.port}`
            : `port ${port}`;
    console.log(`Listening on ${bind}`);
});
server.listen(port);
