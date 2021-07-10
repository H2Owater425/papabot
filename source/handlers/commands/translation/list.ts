import { getLanguageInformation, languageCode, languageFullName, languageInformation } from "@library/translator";
import { LanguageInformation } from "@library/types";
import { sendEmbedList } from "@library/utility";
import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

const elementNumber: number = 7;

export default class extends Command {
	constructor() {
		super('list', {
			aliases: ['list', '목록'],
			category: 'translation',
			channel: 'guild',
			args: [
				{
					id: 'languageCodeOrFullName',
					// @ts-expect-error :: Already removed undefined value from array
					type: [...languageCode.filter((value: typeof languageCode[number], index: number, array: readonly (typeof languageCode[number])[]) => typeof(value) !== 'undefined'), ...languageFullName.filter((value: typeof languageFullName[number], index: number, array: readonly (typeof languageFullName[number])[]) => typeof(value) !== 'undefined')],
					prompt: {
						optional: true,
						timeout: 30000,
						retry: 'Please enter language code or language full name'
					}
				}
			],
			description: {
				content: 'Prints translatable language set list',
				argument: '<LanguageCode | LanguageFullName>'
			}
		});
	}

	public exec(message: Message, { languageCodeOrFullName }: { languageCodeOrFullName: typeof languageCode[number] | typeof languageFullName[number] }): void {
		if(languageCodeOrFullName !== null) {
			const languageInformation: LanguageInformation = getLanguageInformation(languageCodeOrFullName);
			// @ts-expect-error :: Already removed undefined value from array
			const targetLanguageInformationList: LanguageInformation[] = languageInformation['translateableLanguageCode']
			?.filter((value: typeof languageCode[number], index: number, array: (typeof languageCode[number])[]) => typeof(value) !== 'undefined')
			.map(function (value: typeof languageCode[number], index: number, array: (typeof languageCode[number])[]): LanguageInformation {
				return getLanguageInformation(value);
			});
			const pageCount: number = Math.ceil(targetLanguageInformationList.length / elementNumber);
			let pageList: MessageEmbed[] = [];

			for(let i: number = 0; i < pageCount; i++) {
				pageList.push(new MessageEmbed({
					color: process.env.COLOR,
					thumbnail: {
						url: 'https://cdn.h2owr.xyz/images/translate-bot/logo.png'
					},
					title: `Papabot | Language information(${languageInformation['fullName']})`,
					fields: [
						{
							name: 'Language code',
							value: `**${languageInformation['code']}**`,
							inline: false
						},
						{
							name: `Target language`,
							value: targetLanguageInformationList.slice(i * elementNumber, i * elementNumber + elementNumber)
							.map((value: LanguageInformation, index: number, array: LanguageInformation[]) => `• **${value['fullName']}(${value['code']})**`).join('\n')
						}
					]
				}));
			}

			if(pageList.length > 1) {
				sendEmbedList(message, pageList);
			} else {
				message.channel.send(pageList[0]);
			}

			return;
		} else {
			const languageInformationList: (typeof languageInformation[string])[] = Object.values(languageInformation);
			const pageCount: number = Math.ceil(languageInformationList.length / elementNumber);
			let pageList: MessageEmbed[] = [];

			for(let i: number = 0; i < pageCount; i++) {
				pageList.push(new MessageEmbed({
					color: process.env.COLOR,
					thumbnail: {
						url: 'https://cdn.h2owr.xyz/images/translate-bot/logo.png'
					},
					title: 'Papabot | Language list',
					description: languageInformationList.slice(i * elementNumber, i * elementNumber + elementNumber)
					.map((value: LanguageInformation, index: number, array: LanguageInformation[]) => `• **${value['fullName']}(${value['code']})**`).join('\n')
				}));
			}

			sendEmbedList(message, pageList);

			return;
		}
	}
}