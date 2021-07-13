"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = void 0;
const fs_1 = __importDefault(require("fs"));
const zlib_1 = require("zlib");
const stream_1 = require("stream");
const utility_1 = require("./utility");
if ([process.env.LOG_DIRECTORY].includes(undefined)) {
    throw Error('Unconfigured environmental variable');
}
function zip(sourcePath, outputPath) {
    return new Promise(function (resolve, reject) {
        try {
            stream_1.pipeline(fs_1.default.createReadStream(sourcePath), zlib_1.createGzip(), fs_1.default.createWriteStream(outputPath), function (error) {
                if (error !== null && typeof (error) !== 'undefined') {
                    throw error; /*Error('Error occurred while compressing file')*/
                }
                resolve();
            });
        }
        catch (error) {
            reject(error);
            return;
        }
    });
}
function getApacheLogMessage(log) {
    return `[${log['time']['year']}-${log['time']['month']}-${log['time']['date']} ${log['time']['hour']}:${log['time']['minute']}:${log['time']['second']} ${log['time']['timeZone']}] [${log['level']}] "${log['message']}"`;
}
const levelList = ['emerg', 'alert', 'crit', 'error', 'warn', 'notice', 'info', 'debug'];
class Logger {
    constructor(option) {
        this.option = option;
        this.callHandler = function (log) {
            for (let i = 0; i < option['logHandlerList'].length; i++) {
                option['logHandlerList'][i](log);
            }
        };
    }
    emerg(message) {
        this.callHandler({
            level: 'emerg',
            message: String(message),
            time: utility_1.getTime()
        });
    }
    alert(message) {
        this.callHandler({
            level: 'alert',
            message: String(message),
            time: utility_1.getTime()
        });
    }
    crit(message) {
        this.callHandler({
            level: 'crit',
            message: String(message),
            time: utility_1.getTime()
        });
    }
    error(message) {
        this.callHandler({
            level: 'error',
            message: String(message),
            time: utility_1.getTime()
        });
    }
    warn(message) {
        this.callHandler({
            level: 'warn',
            message: String(message),
            time: utility_1.getTime()
        });
    }
    notice(message) {
        this.callHandler({
            level: 'notice',
            message: String(message),
            time: utility_1.getTime()
        });
    }
    info(message) {
        this.callHandler({
            level: 'info',
            message: String(message),
            time: utility_1.getTime()
        });
    }
    debug(message) {
        this.callHandler({
            level: 'debug',
            message: String(message),
            time: utility_1.getTime()
        });
    }
}
exports.Logger = Logger;
exports.logger = new Logger({
    logHandlerList: [
        function (log) {
            const logLevelNumber = levelList.indexOf(log['level']);
            const apacheLogMessage = getApacheLogMessage(log);
            if (logLevelNumber >= 7) {
                console.debug(apacheLogMessage);
            }
            else if (logLevelNumber >= 6) {
                console.info(apacheLogMessage);
            }
            else if (logLevelNumber >= 4) {
                console.warn(apacheLogMessage);
            }
            else if (logLevelNumber >= 0) {
                console.error(apacheLogMessage);
            }
            return;
        },
        function (log) {
            // @ts-expect-error :: Aleady checked availability of environmental variable
            fs_1.default.access(process.env.LOG_DIRECTORY, fs_1.default.F_OK, function (error) {
                new Promise(function (resolve, reject) {
                    try {
                        if (error === null) {
                            // @ts-expect-error :: Aleady checked availability of environmental variable
                            fs_1.default.mkdir(process.env.LOG_DIRECTORY, { recursive: true }, function (error) {
                                if (error === null) {
                                    resolve();
                                    return;
                                }
                                else {
                                    throw Error('Error occurred while creating directory');
                                }
                            });
                            return;
                        }
                    }
                    catch (error) {
                        reject(error);
                        return;
                    }
                })
                    .then(function (value) {
                    const logLevelNumber = levelList.indexOf(log['level']);
                    const logPath = logLevelNumber > 3 ? `${process.env.LOG_DIRECTORY}/translate-bot.access.log` : `${process.env.LOG_DIRECTORY}/translate-bot.error.log`;
                    let isFirstLog = false;
                    new Promise(function (resolve, reject) {
                        try {
                            fs_1.default.stat(logPath, function (error, stat) {
                                if (error === null) {
                                    resolve({
                                        lastModified: stat['mtime'],
                                        fileSize: stat['size']
                                    });
                                    return;
                                }
                                else {
                                    fs_1.default.writeFile(logPath, '', function (error) {
                                        if (error === null) {
                                            isFirstLog = true;
                                            resolve({
                                                lastModified: new Date(),
                                                fileSize: 0
                                            });
                                            return;
                                        }
                                        else {
                                            throw Error('Error occurred while creating log file');
                                        }
                                    });
                                    return;
                                }
                            });
                        }
                        catch (error) {
                            reject(error);
                            return;
                        }
                    })
                        .then(function (logFileStat) {
                        new Promise(function (resolve, reject) {
                            try {
                                const lastModifiedTime = utility_1.getTime(logFileStat['lastModified']);
                                if (new Date().getTime() - new Date(`${lastModifiedTime['year']}-${lastModifiedTime['month']}-${lastModifiedTime['date']}`).getTime() > 604800000 || logFileStat['fileSize'] > 10485760) {
                                    // @ts-expect-error :: Aleady checked availability of environmental variable
                                    fs_1.default.readdir(process.env.LOG_DIRECTORY, function (error, fileList) {
                                        var _a;
                                        if (error === null) {
                                            let latestNumber = 0;
                                            for (let i = 0; i < fileList.length; i++) {
                                                const compressedLogNumber = Number((_a = fileList[i].match(RegExp(`(?<=translate-bot\.${logLevelNumber > 3 ? 'access' : 'error'}\.log\.)[0-9]+(?=\.gz)`))) === null || _a === void 0 ? void 0 : _a[0]);
                                                if (compressedLogNumber > latestNumber) {
                                                    latestNumber = compressedLogNumber;
                                                }
                                            }
                                            fs_1.default.copyFile(logPath, `${logPath}.${latestNumber + 1}`, function (error) {
                                                if (error === null) {
                                                    fs_1.default.writeFile(logPath, '', function (error) {
                                                        if (error === null) {
                                                            zip(`${logPath}.${latestNumber + 1}`, `${logPath}.${latestNumber + 1}.gz`)
                                                                .then(function (value) {
                                                                fs_1.default.unlink(`${logPath}.${latestNumber + 1}`, function (error) {
                                                                    if (error === null) {
                                                                        resolve();
                                                                        return;
                                                                    }
                                                                    else {
                                                                        throw Error('Error occurred while deleting temp log file');
                                                                    }
                                                                });
                                                                return;
                                                            });
                                                            return;
                                                        }
                                                        else {
                                                            throw Error('Error occurred while emptying contents of log file');
                                                        }
                                                    });
                                                    return;
                                                }
                                                else {
                                                    throw Error('Error occurred while copying log file');
                                                }
                                            });
                                            return;
                                        }
                                        else {
                                            throw Error('Error occurred while reading file list');
                                        }
                                    });
                                }
                                else {
                                    resolve();
                                    return;
                                }
                            }
                            catch (error) {
                                reject(error);
                                return;
                            }
                        })
                            .then(function (value) {
                            fs_1.default.readFile(logPath, function (error, data) {
                                if (error === null) {
                                    if (data.toString().length === 0) {
                                        isFirstLog = true;
                                    }
                                    fs_1.default.appendFile(logPath, isFirstLog ? getApacheLogMessage(log) : '\n' + getApacheLogMessage(log), function (error) {
                                        if (error === null) {
                                            return;
                                        }
                                        else {
                                            throw Error('Error occurred while writing log file');
                                        }
                                    });
                                    return;
                                }
                                else {
                                    throw Error('Error occurred while reading log file');
                                }
                            });
                        });
                    });
                });
            });
        }
    ]
});
//# sourceMappingURL=logger.js.map