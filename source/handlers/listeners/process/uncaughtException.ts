import { logger } from '@library/logger';
import { Listener } from 'discord-akairo';

export default class extends Listener {
	constructor() {
    super('uncaughtException', {
      event: 'uncaughtException',
      emitter: 'process'
    });
	}

	public exec(error: Error): any {
		logger.error(`${error['message']} @ SYSTEM`);

		return;
	}
}