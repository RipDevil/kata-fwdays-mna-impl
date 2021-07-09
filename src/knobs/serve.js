import { randomUUID } from 'crypto';
import { readFile } from 'fs/promises';

const _serveContent = async (_, response) => {
    const indexPage = await readFile(
        new URL('../static/index.html', import.meta.url),
        { encoding: 'utf-8' }
    );

    const cspNonce = randomUUID();
    response.setHeader(
        'Content-Security-Policy',
        `script-src 'nonce-${cspNonce}'`
    );
    response.write(indexPage.replace('NONCE', cspNonce));
    response.end();
};

export const serveContent = {
    handler: _serveContent,
    method: 'GET',
    url: '/',
    auth: false,
};
