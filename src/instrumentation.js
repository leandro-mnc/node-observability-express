const { metrics, trace } = require('@opentelemetry/api');
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { MeterProvider, PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-grpc');
const { Resource } = require('@opentelemetry/resources');
const {
    ATTR_SERVICE_NAME,
    ATTR_SERVICE_VERSION,
} = require('@opentelemetry/semantic-conventions');
const {OTLPTraceExporter} = require("@opentelemetry/exporter-trace-otlp-grpc");
const {BatchSpanProcessor, ConsoleSpanExporter} = require("@opentelemetry/sdk-trace-web");
const {NodeTracerProvider} = require("@opentelemetry/sdk-trace-node");

const otlpCollectorOptions = {
    url: 'http://otel:4317', // grpc
    // url: 'http://otel:4318/v1/metrics', // http
};

const resource = new Resource({
    [ATTR_SERVICE_NAME]: 'node-observability-app',
    [ATTR_SERVICE_VERSION]: '1.0.0',
});

// Metrics
const metricExporter = new OTLPMetricExporter(otlpCollectorOptions);
const periodicExportingMetricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 10000, // 10 seconds
});
const meterProvider = new MeterProvider({
    resource: resource,
    readers: [periodicExportingMetricReader]
});
metrics.setGlobalMeterProvider(meterProvider);

// Tracer
// const traceExporter = new ConsoleSpanExporter();
const traceExporter = new OTLPTraceExporter(otlpCollectorOptions);
const tracerSpanProcessor = new BatchSpanProcessor(traceExporter);
const tracerProvider = new NodeTracerProvider({
    resource: resource,
    spanProcessors: [tracerSpanProcessor]
});
trace.setGlobalTracerProvider(tracerProvider);

const sdk = new NodeSDK({
    resource: resource,
});

sdk.start();

// Shutdown sdk before exit application
process.on("beforeExit", async () => {
    await sdk.shutdown();
});

['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () =>  {
        meterProvider.shutdown().catch(console.error);
        tracerProvider.shutdown().catch(console.error);
    });
});
