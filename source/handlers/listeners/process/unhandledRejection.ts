import { logger } from '@library/logger';
import { Listener } from 'discord-akairo';

export default class extends Listener {
	constructor() {
		super('unhandledRejection', {
			event: 'unhandledRejection',
			emitter: 'process'
		});
	}

	public exec(error: Error): any {
		logger.crit(`${error['message']} @ SYSTEM`);

		return;
	}
}