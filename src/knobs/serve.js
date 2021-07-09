import { readFile } from 'fs/promises';

const _serveContent = async (_, response) => {
    const indexPage = await readFile(
        new URL('../static/index.html', import.meta.url)
    );

    response.write(indexPage);
    response.end();
};

export const serveContent = {
    handler: _serveContent,
    method: 'GET',
    url: '/',
    auth: false,
};
