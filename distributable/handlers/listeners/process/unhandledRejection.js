"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@library/logger");
const discord_akairo_1 = require("discord-akairo");
class default_1 extends discord_akairo_1.Listener {
    constructor() {
        super('unhandledRejection', {
            event: 'unhandledRejection',
            emitter: 'process'
        });
    }
    exec(error) {
        logger_1.logger.crit(`${error['message']} @ SYSTEM`);
        return;
    }
}
exports.default = default_1;
//# sourceMappingURL=unhandledRejection.js.map