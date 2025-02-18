const {
    ATTR_URL_PATH,
    ATTR_NETWORK_PEER_ADDRESS,
    HTTP_REQUEST_METHOD_VALUE_GET,
    HTTP_REQUEST_METHOD_VALUE_POST,
    HTTP_REQUEST_METHOD_VALUE_DELETE,
    HTTP_REQUEST_METHOD_VALUE_PUT,
    HTTP_REQUEST_METHOD_VALUE_PATCH
} = require("@opentelemetry/semantic-conventions");
const {SpanKind, trace, context} = require("@opentelemetry/api");

const tracer = trace.getTracer('node-observability-app');

const spanMethod = {
    'GET': HTTP_REQUEST_METHOD_VALUE_GET,
    'POST': HTTP_REQUEST_METHOD_VALUE_POST,
    'DELETE': HTTP_REQUEST_METHOD_VALUE_DELETE,
    'PUT': HTTP_REQUEST_METHOD_VALUE_PUT,
    'PATCH': HTTP_REQUEST_METHOD_VALUE_PATCH,
}

module.exports = {
    tracer,
    startSpan: (name, req) => {
        const requestMethodKey = spanMethod[req.method.toUpperCase()];

        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

        const span = tracer.startSpan(name, {
            attributes: {
                [requestMethodKey]: req.method.toUpperCase(),
                [ATTR_URL_PATH]: req.url,
                [ATTR_NETWORK_PEER_ADDRESS]: ip,
            },
            kind: SpanKind.SERVER
        });

        const ctx = trace.setSpan(context.active(), span);

        req.on('end', function () {
            span.end();
        });

        return {
            ctx,
            span
        };
    }
}