import fs from 'fs';
import { createGzip } from 'zlib';
import { pipeline } from 'stream';
import { Time } from '@library/types';
import { getTime } from './utility';

interface LogFileStat {
	lastModified: Date;
	fileSize: number;
}

interface LoggerOption {
	logHandlerList: {(log: Log): void}[]
}

interface Log {
	level: 'emerg' | 'alert' | 'crit' | 'error' | 'warn' | 'notice' | 'info' | 'debug';
	message: string;
	time: Time;
}


if([process.env.LOG_DIRECTORY].includes(undefined)) {
	throw Error('Unconfigured environmental variable');
}

function zip(sourcePath: string, outputPath: string): Promise<void> {
	return new Promise<void>(function (resolve: (value: void | PromiseLike<void>) => void, reject: (reason?: any) => void): void {
		try {
			pipeline(fs.createReadStream(sourcePath), createGzip(), fs.createWriteStream(outputPath), function (error: NodeJS.ErrnoException | null | undefined): void {
				if(error !== null && typeof(error) !== 'undefined') {
					throw error;/*Error('Error occurred while compressing file')*/ 
				}

				resolve();
			});
		} catch(error: any) {
			reject(error);

			return;
		}
	});
}

function getApacheLogMessage(log: Log): string {
	return `[${log['time']['year']}-${log['time']['month']}-${log['time']['date']} ${log['time']['hour']}:${log['time']['minute']}:${log['time']['second']} ${log['time']['timeZone']}] [${log['level']}] "${log['message']}"`;
}

const levelList = ['emerg', 'alert', 'crit', 'error', 'warn', 'notice', 'info', 'debug'] as const;

export class Logger {
	option: LoggerOption;
	callHandler: {(log: Log): void};
	
	constructor(option: LoggerOption) {
		this.option = option;
		this.callHandler = function (log: Log): void {
			for(let i: number = 0; i < option['logHandlerList'].length; i++) {
				option['logHandlerList'][i](log);
			}
		}
	}

	public emerg(message: any): void {
		this.callHandler({
			level: 'emerg',
			message: String(message),
			time: getTime()
		});
	}

	public alert(message: any): void {
		this.callHandler({
			level: 'alert',
			message: String(message),
			time: getTime()
		});
	}

	public crit(message: any): void {
		this.callHandler({
			level: 'crit',
			message: String(message),
			time: getTime()
		});
	}

	public error(message: any): void {
		this.callHandler({
			level: 'error',
			message: String(message),
			time: getTime()
		});
	}

	public warn(message: any): void {
		this.callHandler({
			level: 'warn',
			message: String(message),
			time: getTime()
		});
	}

	public notice(message: any): void {
		this.callHandler({
			level: 'notice',
			message: String(message),
			time: getTime()
		});
	}

	public info(message: any): void {
		this.callHandler({
			level: 'info',
			message: String(message),
			time: getTime()
		});
	}

	public debug(message: any): void {
		this.callHandler({
			level: 'debug',
			message: String(message),
			time: getTime()
		});
	}
}
export const logger: Logger = new Logger({
	logHandlerList: [
		function (log: Log): void {
			const logLevelNumber: number = levelList.indexOf(log['level']);
			const apacheLogMessage: string = getApacheLogMessage(log);

			if(logLevelNumber >= 7) {
				console.debug(apacheLogMessage);
			} else if(logLevelNumber >= 6) {
				console.info(apacheLogMessage);
			} else if(logLevelNumber >= 4) {
				console.warn(apacheLogMessage);
			} else if(logLevelNumber >= 0) {
				console.error(apacheLogMessage);
			}

			return;
		},
		function (log: Log): void {
			// @ts-expect-error :: Aleady checked availability of environmental variable
			fs.access(process.env.LOG_DIRECTORY, fs.F_OK, function (error: NodeJS.ErrnoException | null): void {
				new Promise<void>(function (resolve: (value: void | PromiseLike<void>) => void, reject: (reason?: any) => void): void {
					try {
						if(error === null) {
							// @ts-expect-error :: Aleady checked availability of environmental variable
							fs.mkdir(process.env.LOG_DIRECTORY, { recursive: true }, function (error: NodeJS.ErrnoException | null): void {
								if(error === null) {
									resolve();

									return;
								} else {
									throw Error('Error occurred while creating directory');
								}
							});

							return;
						}
					} catch(error: any) {
						reject(error);

						return;
					}
				})
				.then(function (value: void): void | PromiseLike<void> {
					const logLevelNumber: number = levelList.indexOf(log['level']);
					const logPath: string = logLevelNumber > 3 ? `${process.env.LOG_DIRECTORY}/translate-bot.access.log` : `${process.env.LOG_DIRECTORY}/translate-bot.error.log`;
					let isFirstLog: boolean = false;

					new Promise<LogFileStat>(function (resolve: (value: LogFileStat | PromiseLike<LogFileStat>) => void, reject: (reason?: any) => void): void {
						try {
							fs.stat(logPath, function (error: NodeJS.ErrnoException | null, stat: fs.Stats): void {
								if(error === null) {
									resolve({
										lastModified: stat['mtime'],
										fileSize: stat['size']
									});

									return;
								} else {
									fs.writeFile(logPath, '', function (error: NodeJS.ErrnoException | null): void {
										if(error === null) {
											isFirstLog = true;

											resolve({
												lastModified: new Date(),
												fileSize: 0
											});

											return;
										} else {
											throw Error('Error occurred while creating log file');
										}
									});
		
									return;
								}
							});
						} catch(error: any) {
							reject(error);

							return;
						}
					})
					.then(function (logFileStat: LogFileStat): void | PromiseLike<void> {
						new Promise<void>(function (resolve: (value: void | PromiseLike<void>) => void, reject: (reason?: any) => void): void {
							try {
								const lastModifiedTime: Time = getTime(logFileStat['lastModified']);

								if(new Date().getTime() -  new Date(`${lastModifiedTime['year']}-${lastModifiedTime['month']}-${lastModifiedTime['date']}`).getTime() > 604800000 || logFileStat['fileSize'] > 10485760) {
									// @ts-expect-error :: Aleady checked availability of environmental variable
									fs.readdir(process.env.LOG_DIRECTORY, function (error: NodeJS.ErrnoException | null, fileList: string[]): void {
										if(error === null) {
											let latestNumber: number = 0;

											for(let i: number = 0; i < fileList.length; i++) {
												const compressedLogNumber: number = Number(fileList[i].match(RegExp(`(?<=translate-bot\.${logLevelNumber > 3 ? 'access' : 'error'}\.log\.)[0-9]+(?=\.gz)`))?.[0]); 
												if(compressedLogNumber > latestNumber) {
													latestNumber = compressedLogNumber;
												}
											}

											fs.copyFile(logPath, `${logPath}.${latestNumber+1}`, function (error: NodeJS.ErrnoException | null): void {
												if(error === null) {
													fs.writeFile(logPath, '', function (error: NodeJS.ErrnoException | null): void {
														if(error === null) {
															zip(`${logPath}.${latestNumber+1}`, `${logPath}.${latestNumber+1}.gz`)
															.then(function (value: void): void | PromiseLike<void> {
																fs.unlink(`${logPath}.${latestNumber+1}`, function (error: NodeJS.ErrnoException | null): void {
																	if(error === null) {
																		resolve();

																		return;
																	} else {
																		throw Error('Error occurred while deleting temp log file');
																	}
																});

																return;
															});

															return;
														} else {
															throw Error('Error occurred while emptying contents of log file');
														}
													});

													return;
												} else {
													throw Error('Error occurred while copying log file');
												}
											});

											return;
										} else {
											throw Error('Error occurred while reading file list');
										}
									});
								} else {
									resolve();

									return;
								}
							} catch(error: any) {
								reject(error);

								return;
							}
						})
						.then(function (value: void): void | PromiseLike<void> {
							fs.readFile(logPath, function(error: NodeJS.ErrnoException | null, data: Buffer): void {
								if(error === null) {
									if(data.toString().length === 0) {
										isFirstLog = true;
									}
		
									fs.appendFile(logPath, isFirstLog ? getApacheLogMessage(log) : '\n' + getApacheLogMessage(log), function (error: NodeJS.ErrnoException | null): void {
										if(error === null) {
											return;
										} else {
											throw Error('Error occurred while writing log file');
										}
									});

									return;
								} else {
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