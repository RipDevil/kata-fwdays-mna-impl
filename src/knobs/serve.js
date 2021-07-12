import { pipeline } from 'stream/promises';
import { randomUUID } from 'crypto';
import { readFile, access, stat, opendir } from 'fs/promises';
import { join as pathJoin } from 'path';
import { createReadStream } from 'fs';

import { readDir } from '../utils/read-dir.js';

const root = process.cwd();

const _serveContent = async (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const path = url.pathname;
    const absolutePath = pathJoin(root, path);
    const { relativePath } = /\/(?<relativePath>.*)/.exec(path).groups;
    let isDir;

    try {
        await access(absolutePath);
        isDir = (await stat(absolutePath)).isDirectory();
        console.log('isDir :>> ', isDir);
    } catch (e) {
        response.statusCode = 404;
        response.end();
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
            listing(absolutePath, relativePath),
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

async function* listing(absolutePath, relativePath) {
    const rootInfo = await opendir(absolutePath);
    const [dirs, files] = await readDir(rootInfo);

    yield '<ul>';

    dirs.sort();
    for (const name of dirs) {
        yield `
            <li>
                <a href="${relativePath}/${name}">
                    /${name}
                </a>
            </li>
        `;
    }

    files.sort();
    for (const name of files) {
        yield `
            <li>
                <a href="${relativePath}/${name}">
                    ${name}
                </a>
            </li>
        `;
    }

    yield '</ul>';
}

export const serveContent = {
    handler: _serveContent,
    method: 'GET',
    url: '*', // it does not support wildcards for now! * - means ANY
    auth: false,
};
