import { logger } from "@library/logger";
import { Command, Listener } from "discord-akairo";

export default class extends Listener {
	constructor() {
		super('error', {
			event: 'error',
			emitter: 'commandHandler'
		});
	}

	public exec(error: Error, command: Command): any {
		logger.error(`${error['message']} @ DISCORD(${command})`);

		return;
	};
}