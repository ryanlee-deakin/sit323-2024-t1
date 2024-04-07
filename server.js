const express = require('express'),
    winston = require('winston'),
    app = express(), logger = winston.createLogger({
        level: 'verbose',
        format: winston.format.json(),
        defaultMeta: { service: 'calculator-microservice' },
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
    reqParamToString = (q) => {
        let str = "";
        for (var key in q) {
            if (!q.hasOwnProperty(key)) continue;
            str += `${key}: ${q[key]}, `;
        }
        return str.substring(0, str.length - 2);
    },
    parseReq = (req) => {
        const validator = /^-?\d*\.?\d+$/;
        let n1 = req.query.n1.search(validator) > -1 ? parseFloat(req.query.n1) : "failed against validator check.",
            n2 = req.query.n2.search(validator) > -1 ? parseFloat(req.query.n2) : "failed against validator check.",
            params = reqParamToString(req.query);
        return [n1, n2, params];
    };

// enable logging to console as well as files...
logger.add(new winston.transports.Console({
    format: winston.format.simple(),
}));

app.get('/', (req, res) => {
    res.status(200).json({ statuscode: 200, msg: 'Server running ok.' });
    logger.verbose(`${Date.now()} [${req.ip}] path: ${req.path}`);
});
app.get('/add', (req, res) => {
    let n1, n2, params;
    try {
        [n1, n2, params] = parseReq(req);
        if (isNaN(n1)) { throw new Error(`n1 ${n1}`); }
        if (isNaN(n2)) { throw new Error(`n2 ${n2}`); }
        result = add(n1, n2);
        const msg = `${Date.now()} [${req.ip}] path: ${req.path.toString()}, query params: ${params}, result => ${result}`;
        logger.verbose(msg);
        res.status(200).json({ statuscode: 200, data: result });
    } catch (e) {
        const msg = `${Date.now()} [${req.ip}] message: ${e.toString()}, path: ${req.path.toString()}, query params: ${params}`;
        logger.error(msg);
        res.status(500).json({ statuscode: 500, msg: e.toString() });
    }
});
app.get('/subtract', (req, res) => {
    let n1, n2, params;
    try {
        [n1, n2, params] = parseReq(req);
        if (isNaN(n1)) { throw new Error(`n1 ${n1}`); }
        if (isNaN(n2)) { throw new Error(`n2 ${n2}`); }
        result = sub(n1, n2);
        const msg = `${Date.now()} [${req.ip}] path: ${req.path.toString()}, query params: ${params}, result => ${result}`;
        logger.verbose(msg);
        res.status(200).json({ statuscode: 200, data: result });
    } catch (e) {
        const msg = `${Date.now()} [${req.ip}] message: ${e.toString()}, path: ${req.path.toString()}, query params: ${params}`;
        logger.error(msg);
        res.status(500).json({ statuscode: 500, msg: e.toString() });
    }
});
app.get('/multiply', (req, res) => {
    let n1, n2, params;
    try {
        [n1, n2, params] = parseReq(req);
        if (isNaN(n1)) { throw new Error(`n1 ${n1}`); }
        if (isNaN(n2)) { throw new Error(`n2 ${n2}`); }
        result = mul(n1, n2);
        const msg = `${Date.now()} [${req.ip}] path: ${req.path.toString()}, query params: ${params}, result => ${result}`;
        logger.verbose(msg);
        res.status(200).json({ statuscode: 200, data: result });
    } catch (e) {
        const msg = `${Date.now()} [${req.ip}] message: ${e.toString()}, path: ${req.path.toString()}, query params: ${params}`;
        logger.error(msg);
        res.status(500).json({ statuscode: 500, msg: e.toString() });
    }
});
app.get('/divide', (req, res) => {
    let n1, n2, params;
    try {
        [n1, n2, params] = parseReq(req);
        if (isNaN(n1)) { throw new Error(`n1 ${n1}`); }
        if (isNaN(n2) || n2 == 0) { throw new Error(`n2 ${n2}`); }
        result = div(n1, n2);
        const msg = `${Date.now()} [${req.ip}] path: ${req.path.toString()}, query params: ${params}, result => ${result}`;
        logger.verbose(msg);
        res.status(200).json({ statuscode: 200, data: result });
    } catch (e) {
        const msg = `${Date.now()} [${req.ip}] message: ${e.toString()}, path: ${req.path.toString()}, query params: ${params}`;
        logger.error(msg);
        res.status(500).json({ statuscode: 500, msg: e.toString() });
    }
});
app.listen(port, () => {
    logger.info(`${Date.now()} [server] listening on: http://localhost:${port}/`);
})