import * as http from "http";
import { showPaths } from "./utils/show-paths.js";

export const startServer = (port = 8080) => {
    server.listen(port, () => {
        console.log("\nThe server is reachable on:");

        showPaths((addr) => {
            console.log(`${addr}:${port}`);
        });
    });
};

const server = http.createServer((request, response) => {
    response.write("\nHello from server\n");
    response.end();
});
