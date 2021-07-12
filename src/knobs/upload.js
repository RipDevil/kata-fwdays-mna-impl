import { randomUUID } from 'crypto';
import formidable from 'formidable';
import { createReadStream, createWriteStream } from 'fs';
import { access } from 'fs/promises';
import { join as pathJoin } from 'path';
import { pipeline } from 'stream/promises';

import { redirectBack } from './lib/redirect-back.js';

const root = process.cwd();

const _performUpload = async (request, response) => {
    const formParser = new formidable.IncomingForm();
    const {
        files: { uploadFile },
    } = await new Promise((resolve, reject) => {
        formParser.parse(request, (error, fields, files) => {
            if (error) reject(error);
            else resolve({ fields, files });
        });
    });

    let newPath = pathJoin(
        root,
        new URL(request.headers.referer).pathname,
        uploadFile.name
    );

    try {
        await access(newPath);

        newPath += '.' + randomUUID();
    } catch (e) {}

    // @mna: rename isn't working if you're moving from another mounted drive
    await pipeline(
        createReadStream(uploadFile.path),
        createWriteStream(newPath)
    );

    redirectBack(request, response);
};

export const performUpload = {
    handler: _performUpload,
    method: 'POST',
    url: '/upload',
    auth: false,
};
