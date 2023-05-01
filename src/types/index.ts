export interface Place {
	[index: string]: any
	id_place: number
	place_name: string
	description: string
	photo_url: string
	address: string | null
	latitude: number | null
	longtitude: number | null
	city_name: string
	country_name: string
}
