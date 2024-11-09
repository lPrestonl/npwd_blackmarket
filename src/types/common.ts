export interface ServerPromiseResp<T = undefined> {
	errorMsg?: string;
	status: 'ok' | 'error' | undefined;
	data?: T;
}

export enum PhoneEvents {
	TOGGLE_KEYS = 'npwd:toggleAllControls'
}