import { pipeline } from 'stream/promises';
import { randomUUID } from 'crypto';
import { readFile, access, stat } from 'fs/promises';
import { join as pathJoin } from 'path';
import { createReadStream } from 'fs';

import { listingStream } from './lib/listing-stream.js';

const root = process.cwd();

const _serveContent = async (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const path = url.pathname;
    const absolutePath = pathJoin(root, path);
    const { relativePath } = /\/(?<relativePath>.*)/.exec(path).groups;
    const isDownload = !!url.searchParams.get('download');
    let isDir;

    try {
        await access(absolutePath);
        isDir = (await stat(absolutePath)).isDirectory();
    } catch (e) {
        response.statusCode = 404;
        response.end();
        return;
    }

    if (isDownload && !isDir) {
        await pipeline(createReadStream(absolutePath), response);
        return;
    }

    const indexPage = await readFile(
        new URL('../static/index.html', import.meta.url),
        { encoding: 'utf-8' }
    );

    const { header, footer } =
        /(?<header>[\s\S]+)CONTENT(?<footer>[\s\S]+)/m.exec(indexPage).groups;

    const cspNonce = randomUUID();
    response.setHeader(
        'Content-Security-Policy',
        `script-src 'nonce-${cspNonce}'`
    );
    response.write(header.replace('NONCE', cspNonce));

    if (isDir) {
        await pipeline(
            listingStream(absolutePath, relativePath),
            async function* (stream) {
                for await (const chunk of stream) yield chunk;
                yield footer;
            },
            response
        );
    } else {
        await pipeline(
            createReadStream(absolutePath),
            async function* (stream) {
                yield '<pre>';
                for await (const chunk of stream) yield chunk;
                yield '</pre>';
                yield footer;
            },
            response
        );
    }
};

export const serveContent = {
    handler: _serveContent,
    method: 'GET',
    url: '*', // it does not support wildcards for now! * - means ANY
    auth: false,
};
