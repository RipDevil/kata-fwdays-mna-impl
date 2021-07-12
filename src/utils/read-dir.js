export const readDir = async root => {
    const dirs = [];
    const files = [];

    try {
        for await (const elem of root) {
            if (elem.isDirectory()) {
                dirs.push(elem.name);
            } else {
                files.push(elem.name);
            }
        }
    } catch (e) {
        console.error(e);
        return [];
    }

    return [dirs, files];
};
