export interface Place {
	[index: string]: any;
	id_place: number;
	place_name: string;
	description: string;
	photo_url: string;
	address: string | null;
	latitude: number | null;
	longtitude: number | null;
	city_name: string;
	country_name: string;
	userId_user: number | null;
}

export interface User {
	id_user: number;
	name: string;
	email: string;
	password: string;
	places: Place[];
	review: Review[];
}

export interface Review {
	id_review: number;
	text: string;
	rating: number;
	createdAt: Date;
	place: Place;
	user: User;
}
