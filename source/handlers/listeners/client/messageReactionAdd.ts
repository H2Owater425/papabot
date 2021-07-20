import { logger } from "@library/logger";
import { getLanguageInformation, getTranslatedResult } from "@library/translator";
import { LanguageInformation, TranslatedResult } from "@library/types";
import { getObjectValueList, sendErrorMessage } from "@library/utility";
import { Listener } from "discord-akairo";
import { Collection, MessageEmbed, MessageReaction, User } from "discord.js";

interface ErrorInformation {
	name: string;
	description: string;
}

if([process.env.COLOR].includes(undefined)) {
	throw Error('Unconfigured environmental variable');
}

export default class extends Listener {
	constructor() {
		super('messageReactionAdd', {
			event: 'messageReactionAdd',
			emitter: 'client'
		});
	}

	public exec(reaction: MessageReaction, user: User): any {
		const targetLanguage: LanguageInformation = getLanguageInformation(reaction['emoji']['name']);

		if(!user['bot'] && !getObjectValueList(targetLanguage).includes(undefined)) {
			// @ts-ignore
			if(!reaction['users']['cache'].map((value: User, key: string, collection: Collection<string, User>) => key).includes(this.client['user']?.['id'])) {
				getTranslatedResult(reaction['message']['content'], targetLanguage['code'])
				.then(function (value: TranslatedResult): void | PromiseLike<void> {
					reaction['message'].lineReplyNoMention(new MessageEmbed({
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
					
					reaction['message'].react(reaction['emoji']['name']);
						
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

						case 'CONVERSION_ERROR':
							logger.error('Type conversing error occurred @ SYSTEM');
					}
					
					sendErrorMessage(reaction['message'], errorInformation, { timeout: 30000 });

					logger.warn(`${errorInformation['name']} @ DISCORD(${reaction['message']['id']})`);
				});
			} else {
				logger.notice(`Already translated message @ Discord(${reaction['message']['id']})`);
			}
		}
	}
}
