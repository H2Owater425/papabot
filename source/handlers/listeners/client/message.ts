import { logger } from "@library/logger";
import { getLanguageInformation, getTranslatedResult } from "@library/translator";
import { LanguageInformation, TranslatedResult } from "@library/types";
import { getObjectValueList, sendErrorMessage } from "@library/utility";
import { Listener } from "discord-akairo";
import { Collection, Message, MessageEmbed, MessageReaction, User } from "discord.js";

if([process.env.COLOR].includes(undefined)) {
	throw Error('Unconfigured environmental variable');
}

interface ErrorInformation {
	name: string;
	description: string;
}

export default class extends Listener {
	constructor() {
		super('message', {
			event: 'message',
			emitter: 'client'
		});
	}

	public exec(message: Message): any {
		const botId: string = this['client']['user']?.['id'] || '';

		message.awaitReactions(function (reaction: MessageReaction, user: User): any {
			const targetLanguage: LanguageInformation = getLanguageInformation(reaction['emoji']['name']);
			if(!user['bot'] && !getObjectValueList(targetLanguage).includes(undefined)) {
				if(!reaction['users']['cache'].map((value: User, key: string, collection: Collection<string, User>) => key).includes(botId)) {
					getTranslatedResult(message['content'], targetLanguage['code'])
					.then(function (value: TranslatedResult): void | PromiseLike<void> {
						message.lineReplyNoMention(new MessageEmbed({
							color: process.env.COLOR,
							author: {
								name: user['username'],
								iconURL: `https://cdn.discordapp.com/avatars/${user['id']}/${user['avatar']}.png`
							},
							description: value['text'],
							footer: {
								text: `${value['sourceLanguage']['fullName']}(${value['sourceLanguage']['code']}) → ${value['targetLanguage']['fullName']}(${value['targetLanguage']['code']})`,
								iconURL: 'https://cdn.h2owr.xyz/images/papabot/translate_icon.png'
							}
						}));
						
						message.react(reaction['emoji']['name']);
							
						return;
					})
					.catch(function (error: any): void | PromiseLike<void> {
						let errorInformation: ErrorInformation = {
							name: 'Unknown error',
							description: 'Unknown error detected,\nplease notice this to developer(<@${381745799723483136}>)'
						};

						switch(error) {
							case 'API_ERROR':
								errorInformation = {
									name: 'API error',
									description: 'Error occurred while fetching api,\nplease notice this to developer(<@${381745799723483136}>)'
								}
							case 'REQUEST_LIMIT':
								errorInformation = {
									name: 'Request limit',
									description: 'Reached api\'s reuqest limit,\nplease try again'
								}
							case 'UNKOWN_LANGUAGE':
								errorInformation = {
									name: 'Unknown language',
									description: 'Unknwon language,\nplease use translator to supported language'
								}
							case 'INVALID_LANGUAGE':
								errorInformation = {
									name: 'Invalid language',
									description: 'Invalid source/target language,\nplease use translator to supported language'
								}
						}
						
						sendErrorMessage(message, errorInformation, { timeout: 30000 });

						logger.warn(`${errorInformation['name']} @ DISCORD(${message['id']})`);
					});
				} else {
					logger.notice(`Already translated message @ Discord(${message['id']})`);
				}
			}
		});
	}
}