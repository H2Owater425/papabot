import { Language, NaverAccount } from "@library/type";

export class NaverAuthorization {
	private accounts: NaverAccount[];
	private currentIndex: number;
	private lastDate: Date;

	constructor(accounts: NaverAccount[]) {
		this['accounts'] = accounts;
		this['currentIndex'] = 0;
		this['lastDate'] = new Date();
	}

	public getHeaders(): Record<string, string> {
		if((new Date()).getTime() - Math.trunc(this['lastDate'].getTime() / 86400000) * 86400000 > 86400000) {
			this['currentIndex'] = 0;
		}

		return {
			'X-Naver-Client-Id': this['accounts'][this['currentIndex']]['id'],
			'X-Naver-Client-Secret': this['accounts'][this['currentIndex']]['secret']
		};
	}

	public addIndex(): void {
		if(this['accounts']['length'] !== this['currentIndex'] + 1) {
			this['currentIndex']++;
		} else {
			this['currentIndex'] = 0;
		}

		return;
	}
}

export const naverAuthorization: NaverAuthorization = new NaverAuthorization(JSON.parse(process['env']['NAVER_AUTHORIZATIONS']));

//export const languages: Record<Language['code'], Language> = {
//	'ko': {
//		code: 'ko',
//		name: 'Korean',
//		translateableCodes: ['en', 'ja', 'zh-cn', 'zh-tw', 'vi', 'hi', 'th', 'de', 'ru', 'es', 'it', 'fr']
//	},
//	'en': {
//		code: 'en',
//		name: 'English',
//		translateableCodes: ['ko', 'ja', 'fr', 'zh-cn', 'zh-tw']
//	},
//	'ja': {
//		code: 'ja',
//		name: 'Japanese',
//		translateableCodes: ['ko', 'en', 'zh-cn', 'zh-tw']
//	},
//	'zh-cn': {
//		code: 'zh-cn',
//		name: 'Simplified Chinese',
//		translateableCodes: ['ko', 'en', 'ja', 'zh-tw']
//	},
//	'zh-tw': {
//		code: 'zh-tw',
//		name: 'Traditional Chinese',
//		translateableCodes: ['ko', 'en', 'ja', 'zh-cn']
//	},
//	'vi': {
//		code: 'vi',
//		name: 'Vietnamese',
//		translateableCodes: ['ko']
//	},
//	'id': {
//		code: 'id',
//		name: 'Indonesian',
//		translateableCodes: ['ko']
//	},
//	'th': {
//		code: 'th',
//		name: 'Thai',
//		translateableCodes: ['ko']
//	},
//	'de': {
//		code: 'de',
//		name: 'German',
//		translateableCodes: ['ko']
//	},
//	'ru': {
//		code: 'ru',
//		name: 'Russian',
//		translateableCodes: ['ko']
//	},
//	'es': {
//		code: 'es',
//		name: 'Spanish',
//		translateableCodes: ['ko']
//	},
//	'it': {
//		code: 'it',
//		name: 'Italian',
//		translateableCodes: ['ko']
//	},
//	'fr': {
//		code: 'fr',
//		name: 'French',
//		translateableCodes: ['ko', 'en']
//	},
//	'hi': {
//		code: 'hi',
//		name: 'Hindi',
//		translateableCodes: ['ko']
//	},
//	'pt': {
//		code: 'pt',
//		name: 'Portuguese',
//		translateableCodes: ['en']
//	}
//}

export const languageCodes: Language['code'][] = ['ko', 'en', 'ja', 'zh-cn', 'zh-tw', 'vi', 'id', 'th', 'de', 'ru', 'es', 'it', 'fr', 'hi', 'pt'];

export function getLanguage(information: string): Language | null {
	switch(information) {
		case '🇰🇷': // flag
		case 'ko':
		case 'Korean': {
			return {
				code: 'ko',
				name: 'Korean',
				translateableCodes: new Set<Language['code']>(['en', 'ja', 'zh-cn', 'zh-tw', 'vi', 'hi', 'th', 'de', 'ru', 'es', 'it', 'fr'])
			};
		}

		case '🇬🇧': // flag
		case '🇺🇸': // flag
		case '🇦🇺': // flag
		case '🇳🇿': // flag
		case '🇨🇦': // flag
		case '🇮🇪': // flag
		case 'en':
		case 'English': {
			return {
				code: 'en',
				name: 'English',
				translateableCodes: new Set<Language['code']>(['ko', 'ja', 'fr', 'zh-cn', 'zh-tw'])
			};
		}

		case '🇯🇵': // flag
		case 'ja':
		case 'Japanese': {
			return {
				code: 'ja',
				name: 'Japanese',
				translateableCodes: new Set<Language['code']>(['ko', 'en', 'zh-cn', 'zh-tw'])
			};
		}

		case '🇨🇳': // flag
		case 'zh-cn':
		case 'Simplified Chinese': {
			return {
				code: 'zh-cn',
				name: 'Simplified Chinese',
				translateableCodes: new Set<Language['code']>(['ko', 'en', 'ja', 'zh-tw'])
			};
		}

		case '🇹🇼': // flag
		case 'zh-tw':
		case 'Traditional Chinese': {
			return {
				code: 'zh-tw',
				name: 'Traditional Chinese',
				translateableCodes: new Set<Language['code']>(['ko', 'en', 'ja', 'zh-cn'])
			};
		}

		case '🇻🇳': // flag
		case 'vi':
		case 'Vietnamese': {
			return {
				code: 'vi',
				name: 'Vietnamese',
				translateableCodes: new Set<Language['code']>(['ko'])
			};
		}

		case '🇮🇩':
		case 'id':
		case 'Indonesian': {
			return {
				code: 'id',
				name: 'Indonesian',
				translateableCodes: new Set<Language['code']>(['ko'])
			};
		}

		case '🇹🇭': // flag
		case '🇰🇭': // flag
		case 'th':
		case 'Thai': {
			return {
				code: 'th',
				name: 'Thai',
				translateableCodes: new Set<Language['code']>(['ko'])
			};
		}

		case '🇩🇪': // flag
		case '🇦🇹': // flag
		case '🇨🇭': // flag
		case '🇱🇮': // flag
		case '🇧🇪': // flag
		case '🇱🇺': // flag
		case 'de':
		case 'German': {
			return {
				code: 'de',
				name: 'German',
				translateableCodes: new Set<Language['code']>(['ko'])
			};
		}

		case '🇷🇺': // flag
		case '🇧🇾': // flag
		case '🇰🇿': // flag
		case '🇺🇿': // flag
		case '🇰🇬': // flag
		case '🇦🇲': // flag
		case 'ru':
		case 'Russian': {
			return {
				code: 'ru',
				name: 'Russian',
				translateableCodes: new Set<Language['code']>(['ko'])
			};
		}

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
		case 'Spanish': {
			return {
				code: 'es',
				name: 'Spanish',
				translateableCodes: new Set<Language['code']>(['ko'])
			};
		}

		case '🇮🇹': // flag
		case '🇻🇦': // flag
		case '🇸🇲':
		case 'it':
		case 'Italian': {
			return {
				code: 'it',
				name: 'Italian',
				translateableCodes: new Set<Language['code']>(['ko'])
			};
		}

		case '🇫🇷': // flag
		case 'fr':
		case 'French': {
			return {
				code: 'fr',
				name: 'French',
				translateableCodes: new Set<Language['code']>(['ko', 'en'])
			};
		}

		case '🇫🇯': // flag
		case 'hi':
		case 'Hindi': {
			return {
				code: 'hi',
				name: 'Hindi',
				translateableCodes: new Set<Language['code']>(['ko'])
			};
		}

		case '🇵🇹': // flag
		case '🇧🇷': // flag
		case '🇦🇴': // flag
		case '🇲🇿': // flag
		case '🇹🇱': // flag
		case '🇸🇹': // flag
		case '🇨🇻': // flag
		case '🇬🇼': // flag
		case 'pt':
		case 'Portuguese': {
			return {
				code: 'pt',
				name: 'Portuguese',
				translateableCodes: new Set<Language['code']>(['en'])
			};
		}

		default: {
			return null;
		}
	}
}