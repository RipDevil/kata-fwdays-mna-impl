import * as http from 'http';
import { exec } from 'child_process';
import { SessionManager } from './services/session-service.js';
import { showPaths } from './utils/show-paths.js';
import { knobs } from './knobs/all.js';

export const startServer = port => {
    server.listen(port, () => {
        console.log('\nThe server is reachable on:');

        showPaths(addr => {
            console.log(`-- ${addr}:${port}`);
        });
    });
    setTimeout(() => {
        exec('curl http://localhost:' + port + '/src');
    }, 200);
};

const server = http.createServer((request, response) => {
    const properKnob = knobs.find(knob =>
        checkConditions(request, response, knob)
    );

    if (properKnob) {
        properKnob.handler(request, response);
    } else {
        response.statusCode = 400;
        response.end();
    }
});

const checkConditions = (request, response, knob) => {
    const sameMethod = request.method === knob.method;
    const suitableUri = request.url == knob.url || knob.url === '*';
    let auth = true;

    if (knob.auth) {
        const sessionId = (request.headers.cookie || '')
            .split(';')
            .map(cookie => new URLSearchParams(cookie.trim()))
            .filter(usp => usp.has('session'))
            .map(usp => usp.get('session'))
            .find(s => s.length === 36);

        console.log('sessionId :>> ', sessionId);
        console.log('SessionManager :>> ', SessionManager.sessions);
        if (SessionManager.checkSession(sessionId)) {
            auth = true;
        } else {
            auth = false;
            response.statusCode = 401;
            response.end();
        }
    }

    return sameMethod && suitableUri && auth;
};
