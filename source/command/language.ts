import { pageSize } from "@library/constant";
import { Command } from "@library/framework";
import logger from "@library/logger";
import { getLanguage } from "@library/translator";
import { Language } from "@library/type";
import { getLanguageEmbed } from "@library/utility";
import { Message } from "eris";

export default new Command('언어', function (message: Message, _arugments: string[]): void {
	if(_arugments['length'] === 1) {
		const language: Language | null = getLanguage(_arugments[0]);

		if(language !== null) {
			message['channel'].createMessage({
				embed: {
					color: Number.parseInt(process['env']['EMBED_COLOR'], 16),
					thumbnail: { url: 'https://cdn.h2owr.xyz/images/papabot/logo.png' },
					title: 'Papabot | 언어',
					fields: [{
						name: '이름',
						value: '**' + language['name'] + '(' + language['code'] + ')**'
					}, {
						name: '번역 가능 언어 코드',
						value: language['translateableCodes']['size'] !== 0 ? '**`' + Array.from(language['translateableCodes']).join('`**, **`') + '`**' : '없음'
					}]
				}
			})
			.catch(logger.error);
		}
	} else {
		message['channel'].createMessage({
			embed: getLanguageEmbed(0, pageSize),
			messageReference: { messageID: message['id'] }
		})
		.then(function (message: Message): void {
			message.addReaction('◀')
			.then(function (): void {
				message.addReaction('▶')
				.catch(logger.error);

				return;
			})
			.catch(logger.error);

			return;
		})
		.catch(logger.error);
	}

	return;
}, {
	usage: '**`코드|이름|국기(이모지)`**',
	description: '지원 언어 확인',
	aliases: ['language', 'languages'],
	guildOnly: true
});