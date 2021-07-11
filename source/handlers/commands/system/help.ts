import { sendEmbedList } from "@library/utility";
import { Argument, Category, Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

if([process.env.COLOR, process.env.PREFIX].includes(undefined)) {
	throw Error('Unconfigured environmental variable');
}

export default class extends Command {
	constructor() {
		super('help', {
			aliases: ['help', '도움', '도움말'],
			category: 'system',
			channel: 'guild',
			args: [
				{
					id: 'commandOrCategory',
					type: Argument.union('commandAlias', (message: Message, string: string) => this.handler.categories.get(string) || null),
					prompt: {
						optional: true,
						timeout: 10000,
						retry: 'Please enter command or category'
					}
				}
			],
			description: {
				content: 'Prints help',
				argument: '<Command | Category>'
			}
		});
	}

	public exec(message: Message, { commandOrCategory }: { commandOrCategory?: Command | Category<string, Command> }): void {
		if(commandOrCategory instanceof Command) {
			const command: Command = commandOrCategory;

			message.channel.send(new MessageEmbed({
				color: process.env.COLOR,
				thumbnail: {
					url: 'https://cdn.h2owr.xyz/images/papabot/logo.png'
				},
				title: `Papabot | Command(${command})`,
				fields: [
					{
						name: 'Description',
						value: typeof(command['description']['content']) === 'string' ? command['description']['content'] : '***None***',
						inline: false
					},
					{
						name: 'Usage',
						value: typeof(command['description']['argument']) === 'string' ? `${process.env.PREFIX}${command} ${command['description']['argument']}` : '***None***',
						inline: false
					},
					{
						name: 'Aliases',
						value: command['aliases'].length !== 0 ? command['aliases'].map((value: string, index: number, array: string[]) => `\`${value}\``)
						.join(', ') : '***None***',
						inline: false
					}
				]
			}));

			return;
		} else if(commandOrCategory instanceof Category) {
			const category: Category<string, Command> = commandOrCategory;

			message.channel.send(new MessageEmbed({
				color: process.env.COLOR,
				thumbnail: {
					url: 'https://cdn.h2owr.xyz/images/papabot/logo.png'
				},
				title: `Papabot | Category(${category})`,
				description: category.filter((value: Command, key: string, Collection: Category<string, Command>) => value['aliases'].length > 0)
				.map((value: Command, key: string, collection: Category<string, Command>) => `• **${value['id']}**`).join('\n')
			}));

			return;
		} else {
			const _this: Command = this;

			const pageList: MessageEmbed[] = Array.from(this.handler.categories.values())
			.map(function (value: Category<string, Command>, index: number, array: Category<string, Command>[]): MessageEmbed {
				return new MessageEmbed({
					color: process.env.COLOR,
					thumbnail: {
						url: 'https://cdn.h2owr.xyz/images/papabot/logo.png'
					},
					title: `Papabot | Help`,
					fields: [
						{
							name: value['id'],
							value: value.filter((value: Command, key: string, collection: Category<string, Command>) => value['aliases'].length > 0)
							.map(function (value: Command, key: string, collection: Category<string, Command>): string {
								return `• **${value['id']}**`
							}).join('\n'),
							inline: true
						}
					]
				});
			});

			sendEmbedList(message, pageList);

			return;
		}
	}
}