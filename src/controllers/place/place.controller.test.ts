import request from "supertest";
import App from "../../app";

const app = App.app;

describe("Test Place Controller", () => {
	describe("/GET one", () => {
		it("should return status 400 if id is not provided", async () => {
			const res = await request(app).get("/api/v1/places/asd").expect(400);
			expect(res.badRequest).toBe(true);
			expect(res.error).toBeTruthy();
		});
	});

	describe("/POST new", () => {
		it("should return status 400 if incorrect body provided", async () => {
			const res = await request(app)
				.post("/api/v1/places/new")
				.send({
					place_name: "test",
					description: "test",
					latitude: 123,
					longtitude: 234,
				})
				.expect(400);
			expect(res.badRequest).toBe(true);
			expect(res.text).toBe(
				'{"status":400,"message":"Missing fields: photo_url, address, city_name, country_name"}'
			);
		});
	});

	describe("/DELETE", () => {
		it("should return status 400 if id is not provided", async () => {
			const res = await request(app)
				.delete("/api/v1/places/delete/asd")
				.expect(400);
			expect(res.badRequest).toBe(true);
			expect(res.error).toBeTruthy();
		});
	});

	describe("/PATCH update", () => {
		it("should return status 400 if id is not provided", async () => {
			const res = await request(app)
				.patch("/api/v1/places/update/as")
				.expect(400);

			expect(res.badRequest).toBe(true);
			expect(res.error).toBeTruthy();
		});
	});
});
