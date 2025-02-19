const FluentClient = require("@fluent-org/logger").FluentClient;
const logger = new FluentClient("", {
    socket: {
        host: "fluent-bit",
        port: 24224,
        timeout: 3000, // 3 seconds,
    }
});

module.exports = {
    logger,
    loggerEmit: (tag, data) => {
        logger.emit(tag, data).then(() => {});
    }
};