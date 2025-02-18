const {metricsCounter} = require("./events");
const {SpanStatusCode, context} = require("@opentelemetry/api");
const {startSpan, tracer} = require("./trace");

let express = {};

const middleware = () => {
    express.use((req, res, next) => {
        metricsCounter('http_requests', 1, {endpoint: req.originalUrl});
        next();
    })
};

const home = () => {
    express.get('/', (req, res) => {
        const { span} = startSpan('home', req);

        try {
            const response = {
                message: 'Hello World!'
            };

            span.addEvent('response', response);

            res.send(response);

            span.setAttribute('http.status_code', 200);
            span.setStatus({code: SpanStatusCode.OK});
        } catch (error) {
            span.recordException(error);

            res.send({message: 'The request can not be processed!'});

            span.setAttribute('http.status_code', 403);
            span.setStatus({code: SpanStatusCode.ERROR});
        }
    });
};

const user = () => {

    const getUser = () => {
        const user = {
            name: 'Lorem',
            surname: 'Ipsum'
        };

        const span = tracer.startSpan('find_user');

        span.addEvent('user', user);
        span.setStatus({code: SpanStatusCode.OK})
        span.end();

        return user;
    };

    express.get('/user', async (req, res) => {
        const {span, ctx} = startSpan('get_user', req);

        try {
            // Nested span
            const user = await context.with(ctx, getUser, null, null);

            res.send({data: user});

            span.setAttribute('http.status_code', 200);
            span.setStatus({code: SpanStatusCode.OK});
        } catch (error) {
            span.recordException(error);
            span.setAttribute('http.status_code', 403);
            span.setStatus({code: SpanStatusCode.ERROR});
        }
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