import { logger } from "@library/logger";
import { Listener } from "discord-akairo";


if([process.env.PREFIX].includes(undefined)) {
	throw Error('Unconfigured environmental variable');
}

export default class extends Listener {
	constructor() {
		super('ready', {
			event: 'ready',
			emitter: 'client'
		});
	}

	public exec(...argList: any[]): any {
		logger.info(`Logged into discord as ${this.client.user?.['username']}(${this.client.user?.['id']}) @ DISCORD`);

		this.client.user?.setActivity(`for ${process.env.PREFIX}`, { type: 'WATCHING' });
		
		return;
	}
}