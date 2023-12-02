export type _localStorage = string | undefined | null;
export interface App {
	gameMode: {
		online: string;
		offline: string;
	};
	player: {
		name: string;
		image: string;
	};
	opponent: {
		name: string;
		image: string;
	};
	imageArray: string[];
}
