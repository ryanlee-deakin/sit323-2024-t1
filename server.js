const express = require('express'),
    winston = require('winston'),
    app = express(), logger = winston.createLogger({
        level: 'verbose',
        format: winston.format.json(),
        defaultMeta: { service: 'calculator-microservice'},
        transports: [
            new winston.transports.File({ filename: 'error.log', level: 'error' }),
            new winston.transports.File({ filename: 'combined.log', level: 'info' })
        ],
    }),
    port = 3040,
    add = (n1, n2) => { return n1 + n2; },
    sub = (n1, n2) => { return n1 - n2; },
    mul = (n1, n2) => { return n1 * n2; },
    div = (n1, n2) => { return n1 / n2; },
    parseReq = (req) => {
        const n1 = parseFloat(req.query.n1),
            n2 = parseFloat(req.query.n2);
        return [n1, n2];
    };

// enable logging to console as well as files...
// if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
// }
app.get('/', (req, res) => {
    res.status(200).json({ statuscode: 200, msg: 'Server running ok.' });
    logger.verbose(`${Date.now()} [${req.ip}] path: ${req.path}`);
});
app.get('/add', (req, res) => {
    try {
        let [n1, n2] = parseReq(req);
        if (isNaN(n1)) { throw new Error("n1 incorrectly defined."); }
        if (isNaN(n2)) { throw new Error("n2 incorrectly defined."); }
        result = add(n1, n2);
        res.status(200).json({ statuscode: 200, data: result });
        logger.verbose(`${Date.now()} [${req.ip}] req.query.n1: ${req.query.n1}, req.query.n2: ${req.query.n2}, result: ${result}`);
    } catch (e) {
        logger.info(`${Date.now()} [${req.ip}] req.query.n1: ${req.query.n1}, req.query.n2: ${req.query.n2}`);
        logger.error(`${Date.now()} [${req.ip}] ${e.toString()}`);
        res.status(500).json({ statuscode: 500, msg: e.toString() });
    }
});
app.get('/subtract', (req, res) => {
    try {
        let [n1, n2] = parseReq(req);
        if (isNaN(n1)) { throw new Error("n1 incorrectly defined."); }
        if (isNaN(n2)) { throw new Error("n2 incorrectly defined."); }
        result = sub(n1, n2);
        res.status(200).json({ statuscode: 200, data: result });
    } catch (e) {
        logger.info(`${Date.now()} [${req.ip}] req.query.n1: ${req.query.n1}, req.query.n2: ${req.query.n2}`);
        logger.error(`${Date.now()} [${req.ip}] ${e.toString()}`);
        res.status(500).json({ statuscode: 500, msg: e.toString() });
    }
});
app.get('/multiply', (req, res) => {
    try {
        let [n1, n2] = parseReq(req);
        if (isNaN(n1)) { throw new Error("n1 incorrectly defined."); }
        if (isNaN(n2)) { throw new Error("n2 incorrectly defined."); }
        result = mul(n1, n2);
        res.status(200).json({ statuscode: 200, data: result });
    } catch (e) {
        logger.info(`${Date.now()} [${req.ip}] req.query.n1: ${req.query.n1}, req.query.n2: ${req.query.n2}`);
        logger.error(`${Date.now()} [${req.ip}] ${e.toString()}`);
        res.status(500).json({ statuscode: 500, msg: e.toString() });
    }
});
app.get('/divide', (req, res) => {
    try {
        let [n1, n2] = parseReq(req);
        if (isNaN(n1)) { throw new Error("n1 incorrectly defined."); }
        if (isNaN(n2) || n2 == 0) { throw new Error("n2 incorrectly defined."); }
        result = div(n1, n2);
        res.status(200).json({ statuscode: 200, data: result });
    } catch (e) {
        logger.info(`${Date.now()} [${req.ip}] req.query.n1: ${req.query.n1}, req.query.n2: ${req.query.n2}`);
        logger.error(`${Date.now()} [${req.ip}] ${e.toString()}`);
        res.status(500).json({ statuscode: 500, msg: e.toString() });
    }
});
app.listen(port, () => {
    logger.info(`${Date.now()} [n/a] server started on: http://localhost:${port}/`);
})