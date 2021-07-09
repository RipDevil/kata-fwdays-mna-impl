import { networkInterfaces } from "os";

export const showPaths = (method) => {
    Object.entries(networkInterfaces()).forEach(([_, interfaces]) => {
        interfaces
            .filter((iRecord) => iRecord.family === "IPv4")
            .map((iRecord) => method(`http://${iRecord.address}`));
    });
};
