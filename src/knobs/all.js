import { performLogin } from './login.js';
import { serveContent } from './serve.js';
import { performUpload } from './upload.js';

export const knobs = [performLogin, serveContent, performUpload];
