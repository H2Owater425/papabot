import { logger } from '@library/logger';
import { languageCode, languageFullName } from './translator';

declare module 'discord-akairo' {
	interface AkairoClient {
		commandHandler: CommandHandler;
		inhibitorHandler: InhibitorHandler;
		listenerHandler: ListenerHandler;
		logger: typeof logger;
	}
}

declare module 'discord.js' {
	interface Message {
		lineReply: (content: StringResolvable | APIMessage, option?: MessageOptions | MessageAdditions) => Promise<Message | Message[]>;
		lineReplyNoMention: (content: StringResolvable | APIMessage, option?: MessageOptions | MessageAdditions) => Promise<Message | Message[]>;
	}
}

export interface LooseObject {
	[key: string]: any;
}

export interface Time {
	year: string;
	month: string;
	date: string;
	hour: string;
	minute: string;
	second: string;
	timeZone: string;
}

export interface LanguageInformation {
	code: typeof languageCode[number];
	fullName: typeof languageFullName[number];
	translateableLanguageCode?: typeof languageCode[number][]
}

export interface TranslatedResult {
	sourceLanguage: LanguageInformation;
	targetLanguage: LanguageInformation;
	text: string | undefined;
}

export interface _RecationEmoji {
	emoji: {
		id: string | null;
		name: string;
		animated?: boolean
	};
	count: number;
	me: boolean;
}