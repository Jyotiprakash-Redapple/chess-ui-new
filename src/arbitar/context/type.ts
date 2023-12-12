import { newSocketConnect } from "./reducer/move";

export interface Getnewmovenotation {
	piece: any;
	rank: any;
	file: any;
	x: any;
	y: any;
	position: any;
	promotesTo: any;
}

export interface Makenewmove {
	newPosition: any;
	newMove: any;
	checkStatus: any;
}

export interface Setpicessqoureinfo {
	pieces_square_info: any;
}

export interface MakecandidateMove {
	candicateMove: any;
}

export interface Openpromotionbox {
	rank: any;
	file: any;
	x: any;
	y: any;
}

export interface Savekillpices {
	prevPosition: any;
	x: any;
	y: any;
}

export interface Newsocketconnect {
	socket: any;
}

export interface Newgameinit {
	arg: any;
}
export interface Updateboard {
	arg: any;
}
