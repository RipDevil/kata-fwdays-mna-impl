import { readStream } from '../utils/read-stream.js';

const _performUpload = async (request, response) => {
    const body = await readStream(request);

    console.log(body);
    console.log(request.headers);

    response.end();
};

export const performUpload = {
    handler: _performUpload,
    method: 'POST',
    url: '/upload',
    auth: false,
};
