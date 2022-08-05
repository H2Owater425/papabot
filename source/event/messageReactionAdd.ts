import { Event } from '@library/framework';
import logger from '@library/logger';
import { client } from '@application';
import { Message, PartialEmoji, PossiblyUncachedMessage, Uncached, User } from 'eris';
import { Language } from '@library/type';
import { getLanguage, languageCodes, naverAuthorization } from '@library/translator';
import { fetchBuffer, getHelpEmbed, getLanguageEmbed, getStringBetween } from '@library/utility';
import { pageSize } from '@library/constant';

export default new Event('messageReactionAdd', function (message: PossiblyUncachedMessage, reaction: PartialEmoji, reactor: User | Uncached): void {
	if(typeof(message['guildID']) === 'string' && reactor['id'] !== client['user']['id']) {
		const targetLanguage: Language | null = getLanguage(reaction['name']);

		client.getMessage(message['channel']['id'], message['id'])
		.then(function (message: Message): void {
			if(targetLanguage !== null) {
				if(!message['author']['bot']) {
					client.getMessageReaction(message['channel']['id'], message['id'], reaction['name'])
					.then(function (users: User[]): void {
						let isReplied: boolean = false;
		
						for(let i: number = 0; i < users['length']; i++) {
							if(users[i]['id'] === client['user']['id']) {
								isReplied = true;
		
								break;
							}
						}
		
						if(!isReplied) {
							fetchBuffer('https://openapi.naver.com/v1/papago/detectLangs?query=' + encodeURIComponent(message['content']), {
								method: 'POST',
								headers: Object.assign({ 'Content-Type': 'application/x-www-form-urlencoded' }, naverAuthorization.getHeaders())
							})
							.then(function (buffer: Buffer): void {
								const sourceLanguage: Language | null = getLanguage(JSON.parse(buffer.toString('utf-8'))['langCode']);
		
								if(sourceLanguage !== null && sourceLanguage['translateableCodes'].has(targetLanguage['code'])) {
									fetchBuffer('https://openapi.naver.com/v1/papago/n2mt', {
										method: 'POST',
										body: JSON.stringify({
											source: sourceLanguage['code'],
											target: targetLanguage['code'],
											text: message['content']
										}),
										headers: Object.assign({ 'Content-Type': 'application/json' }, naverAuthorization.getHeaders())
									})
									.then(function (buffer: Buffer): void {
										client.getRESTUser(reactor['id'])
										.then(function (reactor: User): void {
											message['channel'].createMessage({
												embed: {
													color: Number.parseInt(process['env']['EMBED_COLOR'], 10),
													author: {
														name: reactor['username'],
														icon_url: reactor.dynamicAvatarURL('png')
													},
													description: JSON.parse(buffer.toString('utf-8'))['message']['result']['translatedText'],
													footer: {
														text: sourceLanguage['name'] + '(' + sourceLanguage['code'] + ') → ' + targetLanguage['name'] + '(' + targetLanguage['code'] + ')',
														icon_url: 'https://cdn.h2owr.xyz/images/papabot/translate_icon.png'
													}
												},
												messageReference: { messageID: message['id'] }
											})
											.then(function (): void {
												message.addReaction(reaction['name'])
												.catch(logger.error);
												
												return;
											})
											.catch(logger.error);
		
											return;
										})
										.catch(logger.error);
		
										return;
									})
									.catch(logger.error);
								}
		
								return;
							})
							.catch(logger.error);
						}
		
						return;
					})
					.catch(logger.error);
				}
			} else {
				switch(reaction['name']) {
					case '❌': {
						if(message['author']['id'] === client['user']['id'] && typeof(message['referencedMessage']) === 'object' && message['referencedMessage'] !== null && message['referencedMessage']['author']['id'] === reactor['id']) {
							message.delete()
							.catch(logger.error);
						}
		
						break;
					}
		
					case '◀':
					case '▶': {
						if(message['author']['id'] === client['user']['id']) {
							message.removeReaction(reaction['name'], reactor['id'])
							.then(function (): void {
								let getEmbed: typeof getHelpEmbed | typeof getLanguageEmbed | null = null;
								let itemCount: number = -1;

								if(message['embeds']['length'] === 1 && typeof(message['embeds'][0]['footer']) === 'object' && typeof(message['embeds'][0]['title']) === 'string' && message['embeds'][0]['title'].startsWith('Papabot | ')) {
									switch(message['embeds'][0]['title'].slice(10)) {
										case '도움': {
											getEmbed = getHelpEmbed;
											itemCount = client['commandLabels']['length'];

											break;
										}

										case '언어': {
											getEmbed = getLanguageEmbed;
											itemCount = languageCodes['length'];

											break;
										}
									}
								}

								if(getEmbed !== null) {
									const nextPageIndex: number = Number.parseInt(getStringBetween((message['embeds'][0] as Required<typeof message['embeds'][0]>)['footer']['text'], { ending: '/' }), 10) + (reaction['name'] === '▶' ? 1 : -1);
								
									if(!Number.isNaN(nextPageIndex) && nextPageIndex !== 0 && nextPageIndex <= Math.ceil(itemCount / pageSize)) {
										message.edit({ embed: getEmbed(nextPageIndex - 1, pageSize) })
										.catch(logger.error);
									}
								}
			
								return;
							})
							.catch(logger.error);
						}
		
						break;
					}
				}
			}

			return;
		})
		.catch(logger.error);
	}

	return;
});