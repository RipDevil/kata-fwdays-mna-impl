import * as http from 'http';
import { showPaths } from './utils/show-paths.js';
import { readFile } from 'fs/promises';
import { exec } from 'child_process';

let uploadPassword;

export const startServer = (port, password) => {
    server.listen(port, () => {
        console.log('\nThe server is reachable on:');

        showPaths(addr => {
            console.log(`${addr}:${port}`);
        });

        uploadPassword = password;
    });

    setTimeout(() => {
        exec('curl http://localhost:' + port);
    }, 200);
};

async function performLogin(request, response) {
    let body = '';
    for await (const chunk of request) body += chunk;

    const formData = new URLSearchParams(body);

    const userPassword = formData.get('password');

    if (userPassword === uploadPassword) {
        // TODO: save session

        response.statusCode = 302;
        response.setHeader('Location', `${request.headers.referer}`);
        response.end();
    } else {
        response.statusCode = 401;
        response.end();
    }
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
