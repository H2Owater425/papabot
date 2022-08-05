import { Event } from '@library/framework';
import logger from '@library/logger';
import { AnyGuildChannel, Constants, Guild, TextChannel } from 'eris';
import { client } from '@application';

export default new Event('guildCreate', function (guild: Guild): void {
	logger.info('hi (' + guild['id'] + ')');

	client.getRESTGuildChannels(guild['id'])
	.then(function (channels: AnyGuildChannel[]): void {
		let announcementChannelIndex: number = -1;

		for(let i: number = 0; i < channels['length']; i++) {
			if(channels[i]['type'] === Constants['ChannelTypes']['GUILD_TEXT'] && channels[i].permissionsOf(client['user']['id']).has('sendMessages')) {
				announcementChannelIndex = i;

				break;
			}
		}

		if(announcementChannelIndex !== -1) {
			(channels[announcementChannelIndex] as TextChannel).createMessage({ embed: {
				color: Number.parseInt(process['env']['EMBED_COLOR'], 16),
				title: 'Papabot | 안내',
				thumbnail: { url: 'https://cdn.h2owr.xyz/images/papabot/logo.png' },
				description: 'Papabot 사용을 환영합니다\n초기 설정 방법은 [이곳](https://github.com/H2Owater425/papabot/blob/main/README.md)를 참고해주세요'
			} }).catch(logger.error);
		} else {
			logger.error('No channel for announcement (' + guild['id'] + ')');
		}

		return;
	})
	.catch(logger.error);

	return;
});