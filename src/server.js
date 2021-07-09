import * as http from 'http';
import { showPaths } from './utils/show-paths.js';
import { readFile } from 'fs/promises';
import { exec } from 'child_process';

export const startServer = (port = 8080) => {
    server.listen(port, () => {
        console.log('\nThe server is reachable on:');

        showPaths(addr => {
            console.log(`${addr}:${port}`);
        });
    });

    setTimeout(() => {
        exec('curl http://localhost:' + port);
    }, 200);
};

async function performLogin(request, response) {
    response.statusCode = 500;
    response.end();
}

async function serveContent(request, response) {
    const indexPage = await readFile(
        new URL('./static/index.html', import.meta.url)
    );

    response.write(indexPage);
    response.end();
}

const server = http.createServer(async (request, response) => {
    if (request.method === 'POST' && request.url === '/login') {
        await performLogin(request, response);
    } else if (request.method === 'GET') {
        await serveContent(request, response);
    } else {
        response.statusCode = 400;
        response.end();
    }
});
