import { logger } from '@library/logger';
import { Listener } from 'discord-akairo';

export default class extends Listener {
	constructor() {
		super('warning', {
			event: 'warning',
			emitter: 'process'
		});
	}

	public exec(error: Error): any {
		logger.warn(`${error['message']} @ SYSTEM`);

		return;
	}
}