"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const translator_1 = require("@library/translator");
const utility_1 = require("@library/utility");
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const elementNumber = 7;
class default_1 extends discord_akairo_1.Command {
    constructor() {
        super('list', {
            aliases: ['list', '목록'],
            category: 'translation',
            channel: 'guild',
            args: [
                {
                    id: 'languageCodeOrFullName',
                    // @ts-expect-error :: Already removed undefined value from array
                    type: [...translator_1.languageCode.filter((value, index, array) => typeof (value) !== 'undefined'), ...translator_1.languageFullName.filter((value, index, array) => typeof (value) !== 'undefined')],
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
    exec(message, { languageCodeOrFullName }) {
        var _a;
        if (languageCodeOrFullName !== null) {
            const languageInformation = translator_1.getLanguageInformation(languageCodeOrFullName);
            // @ts-expect-error :: Already removed undefined value from array
            const targetLanguageInformationList = (_a = languageInformation['translateableLanguageCode']) === null || _a === void 0 ? void 0 : _a.filter((value, index, array) => typeof (value) !== 'undefined').map(function (value, index, array) {
                return translator_1.getLanguageInformation(value);
            });
            const pageCount = Math.ceil(targetLanguageInformationList.length / elementNumber);
            let pageList = [];
            for (let i = 0; i < pageCount; i++) {
                pageList.push(new discord_js_1.MessageEmbed({
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
                                .map((value, index, array) => `• **${value['fullName']}(${value['code']})**`).join('\n')
                        }
                    ]
                }));
            }
            if (pageList.length > 1) {
                utility_1.sendEmbedList(message, pageList);
            }
            else {
                message.channel.send(pageList[0]);
            }
            return;
        }
        else {
            const languageInformationList = Object.values(translator_1.languageInformation);
            const pageCount = Math.ceil(languageInformationList.length / elementNumber);
            let pageList = [];
            for (let i = 0; i < pageCount; i++) {
                pageList.push(new discord_js_1.MessageEmbed({
                    color: process.env.COLOR,
                    thumbnail: {
                        url: 'https://cdn.h2owr.xyz/images/translate-bot/logo.png'
                    },
                    title: 'Papabot | Language list',
                    description: languageInformationList.slice(i * elementNumber, i * elementNumber + elementNumber)
                        .map((value, index, array) => `• **${value['fullName']}(${value['code']})**`).join('\n')
                }));
            }
            utility_1.sendEmbedList(message, pageList);
            return;
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=list.js.map