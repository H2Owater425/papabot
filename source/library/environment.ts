import 'dotenv/config';

export const REQUIRED_ENVIRONMENT_VARIABLE_NAMES = ['TOKEN', 'PREFIX', 'NAVER_AUTHORIZATIONS', 'EMBED_COLOR'] as const;

for(let i = 0; i < REQUIRED_ENVIRONMENT_VARIABLE_NAMES['length']; i++) {
	if(typeof(process['env'][REQUIRED_ENVIRONMENT_VARIABLE_NAMES[i]]) === 'undefined') {
		throw new Error('Unconfigured environment variable(' + REQUIRED_ENVIRONMENT_VARIABLE_NAMES[i] + ')');
	}
}

process['env']['TZ'] = 'UTC';