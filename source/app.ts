import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from 'discord-akairo';
import dotenv from 'dotenv';
dotenv.config();
import { logger } from '@library/logger';
import 'discord-reply';
import '@library/types';

try {
	dotenv.config();

	if([process.env.NODE_ENV, process.env.TOKEN, process.env.PREFIX].includes(undefined)) {
		throw Error('Unconfigured environmental variable');
	}

	class Client extends AkairoClient {
		constructor() {
			super();
	
			this.commandHandler = new CommandHandler(this, {
				directory: `./${process.env.NODE_ENV === 'development' ? 'source' : 'distributable'}/handlers/commands/`,
				prefix: process.env.PREFIX
			});

			//this.inhibitorHandler = new InhibitorHandler(this, {
			//	directory: `./${process.env.NODE_ENV === 'development' ? 'source' : 'distributable'}/handlers/inhibitors/`
			//});

			this.listenerHandler = new ListenerHandler(this, {
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

	(new Client()).login(process.env.TOKEN);
} catch(error: any) {
	logger.crit(error);
}
