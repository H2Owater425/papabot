"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjectValueList = exports.sendEmbedList = exports.resolvePromiseByOrder = exports.getParsedJson = exports.getTime = void 0;
function getTime(date = new Date()) {
    var _a;
    function getDoubleDigit(_number) {
        return _number > 9 ? String(_number) : '0' + _number;
    }
    return {
        year: String(date.getUTCFullYear()),
        month: getDoubleDigit(date.getUTCMonth() + 1),
        date: getDoubleDigit(date.getUTCDate()),
        hour: getDoubleDigit(date.getUTCHours()),
        minute: getDoubleDigit(date.getUTCMinutes()),
        second: getDoubleDigit(date.getUTCSeconds()),
        timeZone: ((_a = date.toString().match(/[+-](?:2[0-3]|[01][0-9])[0-5][0-9]/)) === null || _a === void 0 ? void 0 : _a[0]) || '+0000'
    };
}
exports.getTime = getTime;
function getParsedJson(target) {
    const dictionary = JSON.parse(typeof (target) === 'object' ? JSON.stringify(target) : target);
    return dictionary;
}
exports.getParsedJson = getParsedJson;
function resolvePromiseByOrder(promiseList) {
    return new Promise(function (resolve, reject) {
        let valueList = [];
        promiseList.reduce(function (previousValue, currentValue, currentIndex, array) {
            return previousValue
                .then(function (value) {
                valueList.push(value);
                return currentValue;
            }, Promise.resolve)
                .catch(function (error) {
                reject(error);
                return;
            });
        })
            .then(function (value) {
            resolve(valueList);
            return;
        })
            .catch(function (error) {
            reject(error);
            return;
        });
        return;
    });
}
exports.resolvePromiseByOrder = resolvePromiseByOrder;
function sendEmbedList(message, pageList, option) {
    if (pageList.length > 1) {
        if (typeof (option) === 'undefined') {
            option = {
                emojiList: ['◀', '▶', '❌'],
                timeout: 300000
            };
        }
        else {
            if (typeof (option['emojiList']) === 'undefined' || option['emojiList'].length !== 3) {
                option['emojiList'] = ['◀', '▶', '❌'];
            }
            else if (typeof (option['timeout']) === 'undefined') {
                option['timeout'] = 300000;
            }
        }
        const emojiList = option['emojiList'];
        const timeout = option['timeout'];
        let pageNumber = 0;
        message.channel.send(pageList[pageNumber].setFooter(`(Page ${pageNumber + 1}/${pageList.length},\ntime limit ${timeout / 1000 / 60} minute(s) setted)`))
            .then(function (value) {
            resolvePromiseByOrder(emojiList.map((_value, index, array) => value.react(_value)))
                .then(function (_value) {
                const reactionCollector = value.createReactionCollector((...argList) => true, { time: timeout });
                reactionCollector.on('collect', function (reaction, user) {
                    reaction.users.remove(user);
                    let isRequiredToEdit = false;
                    if (!user['bot'] && emojiList.includes(reaction['emoji']['name'])) {
                        switch (reaction['emoji']['name']) {
                            case emojiList[0]:
                                if (pageNumber > 0) {
                                    pageNumber--;
                                    isRequiredToEdit = true;
                                }
                                break;
                            case emojiList[1]:
                                if (pageNumber + 1 < pageList.length) {
                                    pageNumber++;
                                    isRequiredToEdit = true;
                                }
                                break;
                            case emojiList[2]:
                                reactionCollector.stop();
                                break;
                        }
                    }
                    if (isRequiredToEdit) {
                        value.edit(pageList[pageNumber].setFooter(`(Page ${pageNumber + 1}/${pageList.length},\ntime limit ${timeout / 1000} setted)`));
                    }
                });
                reactionCollector.on('end', function (collected, reason) {
                    value.reactions.removeAll()
                        .then(function (value) {
                        if (message.deletable) {
                            value.delete();
                        }
                    });
                });
            });
        });
        return;
    }
    else {
        throw Error('Lack of page');
    }
}
exports.sendEmbedList = sendEmbedList;
function getObjectValueList(object, valueList) {
    valueList = valueList || [];
    const _valueList = Object.values(object);
    for (let i = 0; i < _valueList.length; i++) {
        if (typeof (_valueList[i]) === 'object') {
            getObjectValueList(_valueList[i], valueList);
        }
        else {
            valueList.push(_valueList[i]);
        }
    }
    return valueList;
}
exports.getObjectValueList = getObjectValueList;
//# sourceMappingURL=utility.js.map