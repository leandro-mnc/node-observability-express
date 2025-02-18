const {metricsCounter} = require("./events");

let express = {};

const middleware = () => {
    express.use((req, res, next) => {
        metricsCounter('http_requests', 1, {endpoint: req.originalUrl});
        next();
    })
};

const home = () => {
    express.get('/', (req, res) => {
        res.send({
            message: 'Hello World!'
        });
    });
};

const user = () => {
    express.get('/user', (req, res) => {
        res.send({
            'user': {
                name: 'Lorem',
                surname: 'Ipsum'
            }
        });
    });
}

module.exports = {
    loadControllers(app) {
        express = app;

        middleware();
        home();
        user();
    }
}