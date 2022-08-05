import { REQUIRED_ENVIRONMENT_VARIABLE_NAMES } from '@library/environment';
import { Client as _Client } from '@library/framework';
import { ClientEvents } from 'eris';
import { IncomingHttpHeaders } from 'http';

declare global {
	namespace NodeJS {
		interface ProcessEnv extends Record<typeof REQUIRED_ENVIRONMENT_VARIABLE_NAMES[number], string> {
			NODE_ENV: 'development' | 'production';
		}
	}
}

export type ResolveFunction<T = void> = (value: T | PromiseLike<T>) => void;

export type RejectFunction = (reason?: any) => void;

export type EventHandler<K extends keyof ClientEvents> = (..._arguments: ClientEvents[K]) => void;

export interface NaverAccount {
	id: string;
	secret: string;
}

export interface Language {
	code: 'ko' | 'en' | 'ja' | 'zh-cn' | 'zh-tw' | 'vi' | 'id' | 'th' | 'de' | 'ru' | 'es' | 'it' | 'fr' | 'hi' | 'pt';
	name: 'Korean' | 'English' | 'Japanese' | 'Simplified Chinese' | 'Traditional Chinese' | 'Vietnamese' | 'Indonesian' | 'Thai' | 'German' | 'Russian' | 'Spanish' | 'Italian' | 'French' | 'Hindi' | 'Portuguese';
	translateableCodes: Set<Language['code']>;
}