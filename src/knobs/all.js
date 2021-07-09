import { performLogin } from './login.js';
import { serveContent } from './serve.js';

export const knobs = [performLogin, serveContent];
