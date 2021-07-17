"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@library/logger");
const translator_1 = require("@library/translator");
const utility_1 = require("@library/utility");
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
if ([process.env.COLOR].includes(undefined)) {
    throw Error('Unconfigured environmental variable');
}
class default_1 extends discord_akairo_1.Listener {
    constructor() {
        super('message', {
            event: 'message',
            emitter: 'client'
        });
    }
    exec(message) {
        var _a;
        const botId = ((_a = this['client']['user']) === null || _a === void 0 ? void 0 : _a['id']) || '';
        message.awaitReactions(function (reaction, user) {
            const targetLanguage = translator_1.getLanguageInformation(reaction['emoji']['name']);
            if (!user['bot'] && !utility_1.getObjectValueList(targetLanguage).includes(undefined)) {
                if (!reaction['users']['cache'].map((value, key, collection) => key).includes(botId)) {
                    translator_1.getTranslatedResult(message['content'], targetLanguage['code'])
                        .then(function (value) {
                        message.lineReplyNoMention(new discord_js_1.MessageEmbed({
                            color: process.env.COLOR,
                            author: {
                                name: user['username'],
                                iconURL: `https://cdn.discordapp.com/avatars/${user['id']}/${user['avatar']}.png?size=128`
                            },
                            description: value['text'],
                            footer: {
                                text: `${value['sourceLanguage']['fullName']}(${value['sourceLanguage']['code']}) → ${value['targetLanguage']['fullName']}(${value['targetLanguage']['code']})`,
                                iconURL: 'https://cdn.h2owr.xyz/images/papabot/translate_icon.png'
                            }
                        }));
                        message.react(reaction['emoji']['name']);
                        return;
                    })
                        .catch(function (error) {
                        let errorInformation = {
                            name: 'Unknown error',
                            description: 'Unknown error detected,\nplease notice this to developer(<@${381745799723483136}>)'
                        };
                        switch (error) {
                            case 'API_ERROR':
                                errorInformation = {
                                    name: 'API error',
                                    description: 'Error occurred while fetching api,\nplease notice this to developer(<@${381745799723483136}>)'
                                };
                            case 'REQUEST_LIMIT':
                                errorInformation = {
                                    name: 'Request limit',
                                    description: 'Reached api\'s reuqest limit,\nplease try again'
                                };
                            case 'UNKOWN_LANGUAGE':
                                errorInformation = {
                                    name: 'Unknown language',
                                    description: 'Unknwon language,\nplease use translator to supported language'
                                };
                            case 'INVALID_LANGUAGE':
                                errorInformation = {
                                    name: 'Invalid language',
                                    description: 'Invalid source/target language,\nplease use translator to supported language'
                                };
                        }
                        message.lineReplyNoMention(new discord_js_1.MessageEmbed({
                            color: 'ff0000',
                            author: {
                                name: errorInformation['name'],
                                iconURL: 'https://cdn.h2owr.xyz/images/papabot/error_icon.png'
                            },
                            description: errorInformation['description'],
                            footer: {
                                text: '(Time limit 30 seconds setted)'
                            }
                        }))
                            .then(function (value) {
                            // @ts-expect-error :: Will only get one that isn't list
                            setTimeout(() => value.delete(), 30000);
                        });
                        logger_1.logger.warn(`${errorInformation['name']} @ DISCORD(${message['id']})`);
                    });
                }
                else {
                    logger_1.logger.notice(`Already translated message @ Discord(${message['id']})`);
                }
            }
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=message.js.map