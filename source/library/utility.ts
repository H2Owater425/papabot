import { ClientRequest, IncomingMessage } from 'http';
import { request } from 'https';
import { Language, RejectFunction, ResolveFunction } from '@library/type';
import { EmbedField, EmbedOptions } from 'eris';
import { client } from '@application';
import { getLanguage, languageCodes } from './translator';

export function fetchBuffer(url: string, options: Omit<RequestInit, 'headers'> & { headers?: Record<string, string> } = {}): Promise<Buffer> {
	return new Promise<Buffer>(function (resolve: ResolveFunction<Buffer>, reject: RejectFunction): void {
		const _url: URL = new URL(url);

		const clientRequest: ClientRequest = request({
			hostname: _url['hostname'],
			path: _url['pathname'] + _url['search'],
			method: options['method'],
			port: 443,
			headers: options['headers']
		}, function (incomingMessage: IncomingMessage): void {
			const buffers: Buffer[] = [];
			let bufferLength: number = 0;

			if(incomingMessage['statusCode'] === 200) {
				incomingMessage.on('data', function (chunk: any): void {
					buffers.push(chunk);
					bufferLength += chunk['byteLength'];

					return;
				})
				.on('error', reject)
				.on('end', function (): void {
					resolve(Buffer.concat(buffers, bufferLength));

					return;
				});
			} else {
				reject(new Error('Invalid response status code'));
			}

			return;
		});

		if(typeof(options['body']) !== 'undefined') {
			clientRequest.write(options['body']);
		}

		clientRequest.end();

		return;
	});
}

export function getStringBetween(target: string, options: {
	starting?: string;
	ending?: string;
} = {}): string {
	const startingIndex: number = typeof(options['starting']) === 'string' ? target.indexOf(options['starting']) + options['starting']['length'] : 0;
	const endingIndex: number = typeof(options['ending']) === 'string' ? target.indexOf(options['ending']) : target['length'] - 1;

	return target.slice(startingIndex !== -1 ? startingIndex : 0, endingIndex !== -1 ? endingIndex : target['length'] - 1);
}

export function getHelpEmbed(index: number, pageSize: number): EmbedOptions {
	const helpEmbed: EmbedOptions = {
		color: Number.parseInt(process['env']['EMBED_COLOR'], 16),
		thumbnail: { url: 'https://cdn.h2owr.xyz/images/papabot/logo.png' },
		title: 'Papabot | 도움',
		description: '',
		footer: { text: (index + 1) + '/' + Math.ceil(client['commandLabels']['length'] / pageSize) },
		fields: []
	};

	index *= pageSize;

	while((helpEmbed['fields'] as EmbedField[])['length'] !== pageSize && typeof(client['commands'][client['commandLabels'][index]]) === 'object') {
		(helpEmbed['fields'] as EmbedField[]).push({
			name: '`' + process['env']['PREFIX'] + client['commandLabels'][index] + '`',
			value: client['commands'][client['commandLabels'][index]]['description']
		});

		index++;
	}

	(helpEmbed['fields'] as EmbedField[]).push({
		name: '\u200b',
		value: '*`' + process['env']['PREFIX'] + '도움 ' + process['env']['PREFIX'] + '<명령어>`를 통해 더 많은 정보를 확인하세요*'
	});

	return helpEmbed;
}

export function getLanguageEmbed(index: number, pageSize: number): EmbedOptions {
	const languageEmbed: EmbedOptions = {
		color: Number.parseInt(process['env']['EMBED_COLOR'], 16),
		thumbnail: { url: 'https://cdn.h2owr.xyz/images/papabot/logo.png' },
		title: 'Papabot | 언어',
		description: '',
		footer: { text: (index + 1) + '/' + Math.ceil(languageCodes['length'] / pageSize) },
		fields: []
	};

	index *= pageSize;

	while((languageEmbed['fields'] as EmbedField[])['length'] !== pageSize && index !== languageCodes['length']) {
		const language: Language = getLanguage(languageCodes[index]) as Language;
		
		(languageEmbed['fields'] as EmbedField[]).push({
			name: '`' + language['name'] + '(' + language['code'] + ')`',
			value: '\u200b'
		});

		index++;
	}

	(languageEmbed['fields'] as EmbedField[]).push({
		name: '\u200b',
		value: '*`' + process['env']['PREFIX'] + '언어 <코드|이름|국기(이모지)>`를 통해 더 많은 정보를 확인하세요*'
	});

	return languageEmbed;
}