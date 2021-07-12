export const redirectBack = (request, response) => {
    response.statusCode = 302;
    response.setHeader('Location', `${request.headers.referer}`);
    response.end();
};
