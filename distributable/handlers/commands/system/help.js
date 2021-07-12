"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utility_1 = require("@library/utility");
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
if ([process.env.COLOR, process.env.PREFIX].includes(undefined)) {
    throw Error('Unconfigured environmental variable');
}
class default_1 extends discord_akairo_1.Command {
    constructor() {
        super('help', {
            aliases: ['help', '도움', '도움말'],
            category: 'system',
            channel: 'guild',
            args: [
                {
                    id: 'commandOrCategory',
                    type: discord_akairo_1.Argument.union('commandAlias', (message, string) => this.handler.categories.get(string) || null)
                }
            ],
            description: {
                content: 'Prints help',
                argument: '<Command | Category>'
            }
        });
    }
    exec(message, { commandOrCategory }) {
        if (commandOrCategory instanceof discord_akairo_1.Command) {
            const command = commandOrCategory;
            message.channel.send(new discord_js_1.MessageEmbed({
                color: process.env.COLOR,
                thumbnail: {
                    url: 'https://cdn.h2owr.xyz/images/papabot/logo.png'
                },
                title: `Papabot | Command(${command})`,
                fields: [
                    {
                        name: 'Description',
                        value: typeof (command['description']['content']) === 'string' ? command['description']['content'] : '***None***',
                        inline: false
                    },
                    {
                        name: 'Usage',
                        value: typeof (command['description']['argument']) === 'string' ? `${process.env.PREFIX}${command} ${command['description']['argument']}` : '***None***',
                        inline: false
                    },
                    {
                        name: 'Aliases',
                        value: command['aliases'].length !== 0 ? command['aliases'].map((value, index, array) => `\`${value}\``)
                            .join(', ') : '***None***',
                        inline: false
                    }
                ]
            }));
            return;
        }
        else if (commandOrCategory instanceof discord_akairo_1.Category) {
            const category = commandOrCategory;
            message.channel.send(new discord_js_1.MessageEmbed({
                color: process.env.COLOR,
                thumbnail: {
                    url: 'https://cdn.h2owr.xyz/images/papabot/logo.png'
                },
                title: `Papabot | Category(${category})`,
                description: category.filter((value, key, Collection) => value['aliases'].length > 0)
                    .map((value, key, collection) => `• **${value['id']}**`).join('\n')
            }));
            return;
        }
        else {
            const _this = this;
            const pageList = Array.from(this.handler.categories.values())
                .map(function (value, index, array) {
                return new discord_js_1.MessageEmbed({
                    color: process.env.COLOR,
                    thumbnail: {
                        url: 'https://cdn.h2owr.xyz/images/papabot/logo.png'
                    },
                    title: `Papabot | Help`,
                    fields: [
                        {
                            name: value['id'],
                            value: value.filter((value, key, collection) => value['aliases'].length > 0)
                                .map(function (value, key, collection) {
                                return `• **${value['id']}**`;
                            }).join('\n'),
                            inline: true
                        }
                    ]
                });
            });
            utility_1.sendEmbedList(message, pageList);
            return;
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=help.js.map