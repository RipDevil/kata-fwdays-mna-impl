import { startServer } from './server.js';

const port = process.env.PORT || 8080;
const password = process.env.PASSWORD || '123';

startServer(port, password);
