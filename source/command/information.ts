import { Command } from "@library/framework";
import logger from "@library/logger";
import { Message } from "eris";

export default new Command('정보', function (message: Message): void {
	message['channel'].createMessage({
		embed: {
			color: Number.parseInt(process['env']['EMBED_COLOR'], 16),
			title: 'Papabot | 정보',
			thumbnail: { url: 'https://cdn.h2owr.xyz/images/papabot/logo.png' },
			description: '개발자: <@381745799723483136>\n깃허브: [https://github.com/H2Owater425/papabot](https://github.com/H2Owater425/papabot)'
		},
		messageReference: { messageID: message['id'] }
	})
	.catch(logger.error);

	return;
}, {
	description: '봇 정보 확인',
	aliases: ['information', 'info'],
	guildOnly: true
});