"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTranslatedResult = exports.getLanguageInformation = exports.languageInformation = exports.languageFullName = exports.languageCode = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const utility_1 = require("@library/utility");
if ([process.env.NAVER_AUTHORIZATION_LIST].includes(undefined)) {
    throw Error('Unconfigured environmental variable');
}
exports.languageCode = ['ko', 'en', 'ja', 'zh-cn', 'zh-tw', 'vi', 'id', 'th', 'de', 'ru', 'es', 'it', 'fr', 'hi', 'pt', undefined];
exports.languageFullName = ['Korean', 'English', 'Japanese', 'Simplified Chinese', 'Traditional Chinese', 'Vietnamese', 'Indonesian', 'Thai', 'German', 'Russian', 'Spanish', 'Italian', 'French', 'Hindi', 'Portuguese', undefined];
exports.languageInformation = {
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
};
function getLanguageInformation(code) {
    switch (code) {
        case '🇰🇷': // flag
        case 'ko':
        case 'Korean':
            return exports.languageInformation['ko'];
        case '🇬🇧': // flag
        case '🇺🇸': // flag
        case '🇦🇺': // flag
        case '🇳🇿': // flag
        case '🇨🇦': // flag
        case '🇮🇪': // flag
        case 'en':
        case 'English':
            return exports.languageInformation['en'];
        case '🇯🇵': // flag
        case 'ja':
        case 'Japanese':
            return exports.languageInformation['ja'];
        case '🇨🇳': // flag
        case 'zh-cn':
        case 'Simplified Chinese':
            return exports.languageInformation['zh-cn'];
        case '🇹🇼': // flag
        case 'zh-tw':
        case 'Traditional Chinese':
            return exports.languageInformation['zh-tw'];
        case '🇻🇳': // flag
        case 'vi':
        case 'Vietnamese':
            return exports.languageInformation['vi'];
        case '🇮🇩':
        case 'id':
        case 'Indonesian':
            return exports.languageInformation['id'];
        case '🇹🇭': // flag
        case '🇰🇭': // flag
        case 'th':
        case 'Thai':
            return exports.languageInformation['th'];
        case '🇩🇪': // flag
        case '🇦🇹': // flag
        case '🇨🇭': // flag
        case '🇱🇮': // flag
        case '🇧🇪': // flag
        case '🇱🇺': // flag
        case 'de':
        case 'German':
            return exports.languageInformation['de'];
        case '🇷🇺': // flag
        case '🇧🇾': // flag
        case '🇰🇿': // flag
        case '🇺🇿': // flag
        case '🇰🇬': // flag
        case '🇦🇲': // flag
        case 'ru':
        case 'Russian':
            return exports.languageInformation['ru'];
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
            return exports.languageInformation['es'];
        case '🇮🇹': // flag
        case '🇻🇦': // flag
        case '🇸🇲':
        case 'it':
        case 'Italian':
            return exports.languageInformation['it'];
        case '🇫🇷': // flag
        case 'fr':
        case 'French':
            return exports.languageInformation['fr'];
        case '🇫🇯': // flag
        case 'hi':
        case 'Hindi':
            return exports.languageInformation['hi'];
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
            return exports.languageInformation['pt'];
        default:
            return {
                code: undefined,
                fullName: undefined,
                translateableLanguageCode: []
            };
    }
}
exports.getLanguageInformation = getLanguageInformation;
class NaverAuthorization {
    constructor(authorizationList) {
        this.authorizationList = authorizationList;
        this.currentIndex = 0;
        this.lastDate = utility_1.getTime();
    }
    getAuthenticatedHeader() {
        if (new Date().getTime() - new Date(`${this.lastDate['year']}-${this.lastDate['month']}-${this.lastDate['date']}`).getTime() > 86400000) {
            this.currentIndex = 0;
        }
        return {
            'X-Naver-Client-Id': this.authorizationList[this.currentIndex]['id'],
            'X-Naver-Client-Secret': this.authorizationList[this.currentIndex]['secret']
        };
    }
    addIndex() {
        if (this.authorizationList.length > this.currentIndex + 1) {
            this.currentIndex++;
        }
        else {
            this.currentIndex = 0;
        }
    }
}
// @ts-expect-error :: Aleady checked availability of environmental variable
const naverAuthorization = new NaverAuthorization(utility_1.getParsedJson(process.env.NAVER_AUTHORIZATION_LIST));
function getTranslatedResult(text, targetLanguageCode) {
    return new Promise(function (resolve, reject) {
        if (typeof (targetLanguageCode) !== 'undefined') {
            node_fetch_1.default(`https://openapi.naver.com/v1/papago/detectLangs?query=${encodeURIComponent(text)}`, {
                method: 'POST',
                headers: Object.assign({ 'Content-Type': 'application/x-www-form-urlencoded' }, naverAuthorization.getAuthenticatedHeader())
            })
                .then(function (value) {
                if (value['status'] === 200) {
                    value.json()
                        .then(function (value) {
                        var _a;
                        const sourceLanguage = getLanguageInformation(value['langCode']);
                        if (![sourceLanguage['code'], sourceLanguage['fullName']].includes(undefined)) {
                            if ((_a = sourceLanguage['translateableLanguageCode']) === null || _a === void 0 ? void 0 : _a.includes(targetLanguageCode)) {
                                node_fetch_1.default(`https://openapi.naver.com/v1/papago/n2mt`, {
                                    method: 'POST',
                                    body: JSON.stringify({
                                        source: value['langCode'],
                                        target: targetLanguageCode,
                                        text: text
                                    }),
                                    headers: Object.assign({ 'Content-Type': 'application/json' }, naverAuthorization.getAuthenticatedHeader())
                                })
                                    .then(function (value) {
                                    if (value['status'] === 200) {
                                        value.json()
                                            .then(function (value) {
                                            const targetLanguage = getLanguageInformation(targetLanguageCode);
                                            resolve({
                                                sourceLanguage: sourceLanguage,
                                                targetLanguage: targetLanguage,
                                                text: value['message']['result']['translatedText']
                                            });
                                            return;
                                        })
                                            .catch(function (error) {
                                            reject(error);
                                            return;
                                        });
                                    }
                                    else {
                                        reject('API_ERROR');
                                        return;
                                    }
                                })
                                    .catch(function (error) {
                                    reject(error);
                                    return;
                                });
                            }
                            else {
                                reject('INVALID_LANGUAGE');
                                return;
                            }
                        }
                        else {
                            reject('UNKOWN_LANGUAGE');
                            return;
                        }
                    })
                        .catch(function (error) {
                        reject(error);
                        return;
                    });
                }
                else if (value['status'] === 429) {
                    naverAuthorization.addIndex();
                    reject('REQUEST_LIMIT');
                    return;
                }
                else {
                    reject('API_ERROR');
                    return;
                }
            })
                .catch(function (error) {
                reject(error);
                return;
            });
        }
    });
}
exports.getTranslatedResult = getTranslatedResult;
//# sourceMappingURL=translator.js.map