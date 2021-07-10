"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@library/logger");
const discord_akairo_1 = require("discord-akairo");
class default_1 extends discord_akairo_1.Listener {
    constructor() {
        super("uncaughtException", {
            event: "uncaughtException",
            emitter: "process"
        });
    }
    exec(error) {
        logger_1.logger.error(`${error['message']} @ SYSTEM`);
        return;
    }
}
exports.default = default_1;
//# sourceMappingURL=uncaughtException.js.map