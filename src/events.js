const { metrics } = require('@opentelemetry/api');

const meter = metrics.getMeter('node-observability-app');

const EventEmitter = require('node:events');

const eventEmitter = new EventEmitter();

eventEmitter.on('metrics.counter', (name, counter, params = {}) => {
    meter.createCounter(name).add(counter, params);
});

module.exports = {
    metricsCounter: (name, counter, params = {}) => {
        eventEmitter.emit('metrics.counter', name, counter, params);
    }
};