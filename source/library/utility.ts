import { LooseObject, Time } from '@library/types';
import { Collection, EmojiResolvable, Message, MessageEmbed, MessageReaction, ReactionCollector, User } from 'discord.js';

export function getTime(date: Date = new Date()): Time {
	function getDoubleDigit(_number: number): string {
		return _number > 9 ? String(_number) : '0' + _number;
	}
	return {
		year: String(date.getUTCFullYear()),
		month: getDoubleDigit(date.getUTCMonth()+1),
		date: getDoubleDigit(date.getUTCDate()),
		hour: getDoubleDigit(date.getUTCHours()),
		minute: getDoubleDigit(date.getUTCMinutes()),
		second: getDoubleDigit(date.getUTCSeconds()),
		timeZone: date.toString().match(/[+-](?:2[0-3]|[01][0-9])[0-5][0-9]/)?.[0] || '+0000'
	}
}

export function getParsedJson(target: object | string): LooseObject {
	const dictionary: LooseObject[] = JSON.parse(typeof(target) === 'object' ? JSON.stringify(target) : target);
	
	return dictionary;
}

export function resolvePromiseByOrder(promiseList: Promise<any>[]): Promise<any[]> {
	return new Promise<any[]>(function (resolve: (value: any[] | PromiseLike<any[]>) => void, reject: (reason?: any) => void): void {
		let valueList: any[] = [];

		promiseList.reduce(function (previousValue: Promise<any>, currentValue: Promise<any>, currentIndex: number, array: Promise<any>[]): Promise<any> {
			return previousValue
			.then(function (value: any): Promise<any> {
				valueList.push(value);

				return currentValue;
			}, Promise.resolve)
			.catch(function (error: any): void | PromiseLike<void> {
				reject(error);

				return;
			});
		})
		.then(function (value: any): void | PromiseLike<void> {
			resolve(valueList);

			return;
		})
		.catch(function (error: any): void | PromiseLike<void> {
			reject(error);

			return;
		});

		return;
	});
}

export function sendErrorMessage(message: Message, error: { name: string, description: string }, option: { timeout: number } = { timeout: 300000 }): void {
	message.lineReplyNoMention(new MessageEmbed({
		color: 'ff0000',
		author: {
			name: error['name'],
			iconURL: 'https://cdn.h2owr.xyz/images/papabot/error_icon.png'
		},
		description: error['description'],
		footer: {
			text: `(Time limit ${option['timeout'] / 1000} second(s) setted)`
		}
	}))
	.then(function (value: Message | Message[]): void {
		// @ts-expect-error :: Will only get one that isn't list
		setTimeout(() => value.delete(), option['timeout']);
	});
}

export function sendEmbedList(message: Message, pageList: MessageEmbed[], option?: { emojiList: EmojiResolvable[], timeout: number }): void {
	if(pageList.length > 1) {
		if(typeof(option) === 'undefined') {
			option = {
				emojiList: ['◀', '▶', '❌'],
				timeout: 300000
			}
		} else {
			if(typeof(option['emojiList']) === 'undefined' || option['emojiList'].length !== 3) {
				option['emojiList'] = ['◀', '▶', '❌'];
			} else if(typeof(option['timeout']) === 'undefined') {
				option['timeout'] = 300000;
			}
		}

		const emojiList: EmojiResolvable[] = option['emojiList'];
		const timeout: number = option['timeout'];
		let pageNumber: number = 0;
		
		message.channel.send(pageList[pageNumber].setFooter(`(Page ${pageNumber + 1}/${pageList.length},\ntime limit ${timeout / 1000 / 60} minute(s) setted)`))
		.then(function (value: Message): void | PromiseLike<void> {
			resolvePromiseByOrder(emojiList.map((_value: EmojiResolvable, index: number, array: EmojiResolvable[]) => value.react(_value)))
			.then(function (_value: any[]): void | PromiseLike<void> {
				const reactionCollector: ReactionCollector = value.createReactionCollector((...argList: any[]) => true, { time: timeout });

				reactionCollector.on('collect', function (reaction: MessageReaction, user: User): void {
					reaction.users.remove(user);

					let isRequiredToEdit: boolean = false;

					if(!user['bot'] && emojiList.includes(reaction['emoji']['name'])) {
						switch(reaction['emoji']['name']) {
							case emojiList[0]:
								if(pageNumber > 0) {
									pageNumber--;

									isRequiredToEdit = true;
								}

								break;
							case emojiList[1]:
								if(pageNumber + 1 < pageList.length) {
									pageNumber++;

									isRequiredToEdit = true;
								}
								
								break;
							case emojiList[2]:
								reactionCollector.stop();
								
								break;
						}
					}

					if(isRequiredToEdit) {
						value.edit(pageList[pageNumber].setFooter(`(Page ${pageNumber + 1}/${pageList.length},\ntime limit ${timeout / 1000} setted)`));
					}
				});

				reactionCollector.on('end', function (collected: Collection<string, MessageReaction>, reason: string): void {
					value.reactions.removeAll()
					.then(function (value: Message): void | PromiseLike<void> {
						if(message.deletable) {
							value.delete();
						}
					});
				});
			});
		});

		return;
	} else {
		throw Error('Lack of page');
	}
}

export function getObjectValueList(object: Object, valueList?: any[]): any[] {
	valueList = valueList || [];

	const _valueList: any[] = Object.values(object);

	for(let i: number = 0; i < _valueList.length; i++) {
		if(typeof(_valueList[i]) === 'object') {
			getObjectValueList(_valueList[i], valueList);
		} else {
			valueList.push(_valueList[i]);
		}
	}

	return valueList;
}