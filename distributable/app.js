"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const logger_1 = require("@library/logger");
require("discord-reply");
require("@library/types");
try {
    dotenv_1.default.config();
    if ([process.env.NODE_ENV, process.env.TOKEN, process.env.PREFIX].includes(undefined)) {
        throw Error('Unconfigured environmental variable');
    }
    class Client extends discord_akairo_1.AkairoClient {
        constructor() {
            super();
            this.commandHandler = new discord_akairo_1.CommandHandler(this, {
                directory: `./${process.env.NODE_ENV === 'development' ? 'source' : 'distributable'}/handlers/commands/`,
                prefix: process.env.PREFIX
            });
            //this.inhibitorHandler = new InhibitorHandler(this, {
            //	directory: `./${process.env.NODE_ENV === 'development' ? 'source' : 'distributable'}/handlers/inhibitors/`
            //});
            this.listenerHandler = new discord_akairo_1.ListenerHandler(this, {
                directory: `./${process.env.NODE_ENV === 'development' ? 'source' : 'distributable'}/handlers/listeners/`
            });
            this.commandHandler.useListenerHandler(this.listenerHandler);
            this.listenerHandler.setEmitters({
                commandHandler: this.commandHandler,
                listenerHandler: this.listenerHandler,
                process
            });
            this.commandHandler.loadAll();
            //this.inhibitorHandler.loadAll();
            this.listenerHandler.loadAll();
        }
    }
    const client = new Client();
    client.login(process.env.TOKEN);
}
catch (error) {
    logger_1.logger.crit(error);
}
//# sourceMappingURL=app.js.map