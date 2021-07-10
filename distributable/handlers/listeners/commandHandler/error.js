"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@library/logger");
const discord_akairo_1 = require("discord-akairo");
class default_1 extends discord_akairo_1.Listener {
    constructor() {
        super('error', {
            event: 'error',
            emitter: 'commandHandler'
        });
    }
    exec(error, command) {
        logger_1.logger.error(`${error['message']} @ DISCORD(${command})`);
        return;
    }
    ;
}
exports.default = default_1;
//# sourceMappingURL=error.js.map