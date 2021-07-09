export const readStream = async request => {
    let body = '';

    try {
        for await (const chunk of request) body += chunk;
    } catch (e) {
        console.error(e);
    }

    return body;
};
