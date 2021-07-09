import { SessionManager } from '../services/session-service.js';
import { readStream } from '../utils/read-stream.js';

const _performLogin = async (request, response) => {
    const body = await readStream(request);

    const formData = new URLSearchParams(body);
    const userPassword = formData.get('password');
    const uploadPassword = process.env.PASSWORD || '123';

    if (userPassword === uploadPassword) {
        const session = SessionManager.createSession();

        response.setHeader(
            'Set-Cookie',
            [
                `session=${session.sessionId}`,
                `Espires=${session.sessionExpiryDate.toISOString()}`,
                `HttpOnly`,
            ].join(';')
        );

        response.statusCode = 302;
        response.setHeader('Location', `${request.headers.referer}`);
        response.end();
    } else {
        response.statusCode = 401;
        response.end();
    }
};

export const performLogin = {
    handler: _performLogin,
    method: 'POST',
    url: '/login',
    auth: false,
};
