"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@library/logger");
const discord_akairo_1 = require("discord-akairo");
if ([process.env.PREFIX].includes(undefined)) {
    throw Error('Unconfigured environmental variable');
}
class default_1 extends discord_akairo_1.Listener {
    constructor() {
        super('ready', {
            event: 'ready',
            emitter: 'client'
        });
    }
    exec(...argList) {
        var _a, _b, _c;
        logger_1.logger.info(`Logged into discord as ${(_a = this.client.user) === null || _a === void 0 ? void 0 : _a['username']}(${(_b = this.client.user) === null || _b === void 0 ? void 0 : _b['id']}) @ DISCORD`);
        (_c = this.client.user) === null || _c === void 0 ? void 0 : _c.setActivity(`${process.env.PREFIX}help`);
        return;
    }
}
exports.default = default_1;
//# sourceMappingURL=ready.js.map