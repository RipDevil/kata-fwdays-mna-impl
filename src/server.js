import * as http from 'http';
import { showPaths } from './utils/show-paths.js';
import { knobs } from './knobs/all.js';
import { exec } from 'child_process';

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
    const properKnob = knobs.find(
        knob =>
            request.method === knob.method &&
            (request.url == knob.url || knob.url === '*')
    );

    if (properKnob) {
        properKnob.handler(request, response);
    } else {
        response.statusCode = 400;
        response.end();
    }
});
