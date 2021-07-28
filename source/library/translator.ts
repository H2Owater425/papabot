import { LanguageInformation, LooseObject, Time, TranslatedResult } from '@library/types';
import fetch, { HeaderInit, Response } from 'node-fetch';
import { getParsedJson, getTime } from '@library/utility';

if([process.env.NAVER_AUTHORIZATION_LIST].includes(undefined)) {
	throw Error('Unconfigured environmental variable');
}

export const languageCode = ['ko', 'en', 'ja', 'zh-cn', 'zh-tw', 'vi', 'id', 'th', 'de', 'ru', 'es', 'it', 'fr', 'hi', 'pt', undefined] as const;
export const languageFullName = ['Korean', 'English', 'Japanese', 'Simplified Chinese', 'Traditional Chinese', 'Vietnamese', 'Indonesian', 'Thai', 'German', 'Russian', 'Spanish', 'Italian', 'French', 'Hindi', 'Portuguese', undefined];
export const languageInformation: { [key: string]: LanguageInformation } = {
	'ko': {
		code: 'ko',
		fullName: 'Korean',
		translateableLanguageCode: ['en', 'ja', 'zh-cn', 'zh-tw', 'vi', 'hi', 'th', 'de', 'ru', 'es', 'it', 'fr']
	},
	'en': {
		code: 'en',
		fullName: 'English',
		translateableLanguageCode: ['ko', 'ja', 'fr', 'zh-cn', 'zh-tw']
	},
	'ja': {
		code: 'ja',
		fullName: 'Japanese',
		translateableLanguageCode: ['ko', 'en', 'zh-cn', 'zh-tw']
	},
	'zh-cn': {
		code: 'zh-cn',
		fullName: 'Simplified Chinese',
		translateableLanguageCode: ['ko', 'en', 'ja', 'zh-tw']
	},
	'zh-tw': {
		code: 'zh-tw',
		fullName: 'Traditional Chinese',
		translateableLanguageCode: ['ko', 'en', 'ja', 'zh-cn']
	},
	'vi': {
		code: 'vi',
		fullName: 'Vietnamese',
		translateableLanguageCode: ['ko']
	},
	'id': {
		code: 'id',
		fullName: 'Indonesian',
		translateableLanguageCode: ['ko']
	},
	'th': {
		code: 'th',
		fullName: 'Thai',
		translateableLanguageCode: ['ko']
	},
	'de': {
		code: 'de',
		fullName: 'German',
		translateableLanguageCode: ['ko']
	},
	'ru': {
		code: 'ru',
		fullName: 'Russian',
		translateableLanguageCode: ['ko']
	},
	'es': {
		code: 'es',
		fullName: 'Spanish',
		translateableLanguageCode: ['ko']
	},
	'it': {
		code: 'it',
		fullName: 'Italian',
		translateableLanguageCode: ['ko']
	},
	'fr': {
		code: 'fr',
		fullName: 'French',
		translateableLanguageCode: ['ko', 'en']
	},
	'hi': {
		code: 'hi',
		fullName: 'Hindi',
		translateableLanguageCode: ['ko']
	},
	'pt': {
		code: 'pt',
		fullName: 'Portuguese',
		translateableLanguageCode: ['en']
	}
}

export function getLanguageInformation(code: any): LanguageInformation {
	switch(code) {
		case '🇰🇷': // flag
		case 'ko':
		case 'Korean':
			return languageInformation['ko'];

		case '🇬🇧': // flag
		case '🇺🇸': // flag
		case '🇦🇺': // flag
		case '🇳🇿': // flag
		case '🇨🇦': // flag
		case '🇮🇪': // flag
		case 'en':
		case 'English':
			return languageInformation['en'];

		case '🇯🇵': // flag
		case 'ja':
		case 'Japanese':
			return languageInformation['ja'];

		case '🇨🇳': // flag
		case 'zh-cn':
		case 'Simplified Chinese':
			return languageInformation['zh-cn'];

		case '🇹🇼': // flag
		case 'zh-tw':
		case 'Traditional Chinese':
			return languageInformation['zh-tw'];

		case '🇻🇳': // flag
		case 'vi':
		case 'Vietnamese':
			return languageInformation['vi'];

		case '🇮🇩':
		case 'id':
		case 'Indonesian':
			return languageInformation['id'];

		case '🇹🇭': // flag
		case '🇰🇭': // flag
		case 'th':
		case 'Thai':
			return languageInformation['th'];

		case '🇩🇪': // flag
		case '🇦🇹': // flag
		case '🇨🇭': // flag
		case '🇱🇮': // flag
		case '🇧🇪': // flag
		case '🇱🇺': // flag
		case 'de':
		case 'German':
			return languageInformation['de'];

		case '🇷🇺': // flag
		case '🇧🇾': // flag
		case '🇰🇿': // flag
		case '🇺🇿': // flag
		case '🇰🇬': // flag
		case '🇦🇲': // flag
		case 'ru':
		case 'Russian':
			return languageInformation['ru'];

		case '🇲🇽': // flag
		case '🇦🇷': // flag
		case '🇪🇸': // flag
		case '🇨🇴': // flag
		case '🇻🇪': // flag
		case '🇪🇨': // flag
		case '🇨🇱': // flag
		case '🇵🇪': // flag
		case '🇬🇹': // flag
		case '🇨🇺': // flag
		case '🇩🇴': // flag
		case '🇧🇴': // flag
		case '🇭🇳': // flag
		case '🇸🇻': // flag
		case '🇳🇮': // flag
		case '🇵🇾': // flag
		case '🇨🇷': // flag
		case '🇵🇦': // flag
		case '🇺🇾': // flag
		case '🇵🇷': // flag
		case 'es':
		case 'Spanish':
			return languageInformation['es'];

		case '🇮🇹': // flag
		case '🇻🇦': // flag
		case '🇸🇲':
		case 'it':
		case 'Italian':
			return languageInformation['it'];

		case '🇫🇷': // flag
		case 'fr':
		case 'French':
			return languageInformation['fr'];

		case '🇫🇯': // flag
		case 'hi':
		case 'Hindi':
			return languageInformation['hi'];

		case '🇵🇹': // flag
		case '🇧🇷': // flag
		case '🇦🇴': // flag
		case '🇲🇿': // flag
		case '🇹🇱': // flag
		case '🇸🇹': // flag
		case '🇨🇻': // flag
		case '🇬🇼': // flag
		case 'pt':
		case 'Portuguese':
			return languageInformation['pt'];

		default:
			return {
				code: undefined,
				fullName: undefined,
				translateableLanguageCode: []
			};
	}
}

interface _NaverAuthorization {
	id: string;
	secret: string;
}

class NaverAuthorization {
	private authorizationList: _NaverAuthorization[];
	private currentIndex: number;
	private lastDate: Time;

	constructor(authorizationList: _NaverAuthorization[]) {
		this.authorizationList = authorizationList;
		this.currentIndex = 0;
		this.lastDate = getTime();
	}

	public getAuthenticatedHeader(): HeaderInit {
		if(new Date().getTime() - new Date(`${this.lastDate['year']}-${this.lastDate['month']}-${this.lastDate['date']}`).getTime() > 86400000) {
			this.currentIndex = 0;
		}

		return {
			'X-Naver-Client-Id': this.authorizationList[this.currentIndex]['id'],
			'X-Naver-Client-Secret': this.authorizationList[this.currentIndex]['secret']
		}
	}

	public addIndex(): void {
		if(this.authorizationList.length > this.currentIndex + 1) {
			this.currentIndex++;
		} else {
			this.currentIndex = 0;
		}
	}
}

// @ts-expect-error :: Aleady checked availability of environmental variable
const naverAuthorization: NaverAuthorization = new NaverAuthorization(getParsedJson(process.env.NAVER_AUTHORIZATION_LIST));

export function getTranslatedResult(text: string, targetLanguageCode: typeof languageCode[number]): Promise<TranslatedResult> {
	return new Promise<TranslatedResult>(function (resolve: (value: TranslatedResult | PromiseLike<TranslatedResult>) => void, reject: (reason?: any) => void): void {
		if(typeof(targetLanguageCode) !== 'undefined') {
			fetch(`https://openapi.naver.com/v1/papago/detectLangs?query=${encodeURIComponent(text)}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					...naverAuthorization.getAuthenticatedHeader()
				}
			})
			.then(function (value: Response): void | PromiseLike<void> {
				if(value['status'] === 200) {
					value.json().then(function (value: LooseObject): void | PromiseLike<void> {
						const sourceLanguage: LanguageInformation = getLanguageInformation(value['langCode']);

						if(![sourceLanguage['code'], sourceLanguage['fullName']].includes(undefined)) {
							if(sourceLanguage['translateableLanguageCode']?.includes(targetLanguageCode)) {
								fetch(`https://openapi.naver.com/v1/papago/n2mt`, {
									method: 'POST',
									body: JSON.stringify({
										source: value['langCode'],
										target: targetLanguageCode,
										text: text
									}),
									headers: {
										'Content-Type': 'application/json',
										...naverAuthorization.getAuthenticatedHeader()
									}
								})
								.then(function (value: Response): void | PromiseLike<void> {
									if(value['status'] === 200) {
										value.json().then(function (value: LooseObject): void | PromiseLike<void> {
											const targetLanguage: LanguageInformation = getLanguageInformation(targetLanguageCode);

											resolve({
												sourceLanguage: sourceLanguage,
												targetLanguage: targetLanguage,
												text: value['message']['result']['translatedText']
											});

											return;
										})
										.catch((error: any) => reject('CONVERSION_ERROR'));

										return;
									} else {
										reject('API_ERROR');
							
										return;
									}
								})
								.catch((error: any) => reject('API_ERROR'));

								return;
							} else {
								reject('INVALID_LANGUAGE');
					
								return;
							}
						} else {
							reject('UNKOWN_LANGUAGE');
				
							return;
						}
					})
					.catch((error: any) => reject('CONVERSION_ERROR'));

					return;
				} else if(value['status'] === 429) {
					naverAuthorization.addIndex();
					
					reject('REQUEST_LIMIT');
		
					return;
				} else {
					reject('API_ERROR');
		
					return;
				}
			})
			.catch((error: any) => reject('API_ERROR'));

			return;
		}
	});
}
