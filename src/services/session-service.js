import { randomUUID } from 'crypto';

export const SessionManager = {
    sessions: new Map(),
    createSession: () => {
        const sessionId = randomUUID();
        const sessionExpiryDate = new Date(Date.now + 1000 * 60 * 5);
        SessionManager.sessions.set(sessionId, sessionExpiryDate);
    },
    deleteSession: uid => {
        SessionManager.sessions.delete(uid);
    },
    purge: epic => {
        epic &&
            console.log('MUAHAHAHAHAHHA YOUR SESSIONS HAS BEEN !!!DELETED!!!');
        SessionManager.sessions = new Map();
    },
    getSession: uid => {
        SessionManager.sessions.get(uid);
    },
};
