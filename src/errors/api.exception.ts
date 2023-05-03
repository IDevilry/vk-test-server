class APIException extends Error {
	status: number;
	message: string;
	constructor(status: number, name: string, message: string) {
		super(message);
		this.status = status;
		this.message = message;
		this.name = name;
	}
}

export default APIException;
