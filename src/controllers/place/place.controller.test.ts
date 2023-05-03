import request from "supertest";
import App from "../../app";

const app = App.app;

describe("Test Place Controller", () => {
	describe("/GET all", () => {
		it("should return list of places", async () => {
			const res = await request(app)
				.get("/api/v1/places")
				.expect(200)
				.expect("Content-Type", /json/);

			expect(res.body.length).toBeGreaterThan(0);
			expect(res.body).not.toBeFalsy();
		});
	});

	describe("/GET one", () => {
		it("should return a single place", async () => {
			const res = await request(app).get("/api/v1/places/2").expect(200);
			expect(res.body).not.toBeFalsy();
		});

		it("should return status 400 if id is not provided", async () => {
			const res = await request(app).get("/api/v1/places/asd").expect(400);
			expect(res.badRequest).toBe(true);
			expect(res.error).toBeTruthy();
		});

		it("should return status 404 if place is not found", async () => {
			const res = await request(app).get("/api/v1/places/1000").expect(404);
			expect(res.notFound).toBe(true);
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

		it("should return status 201 if correct body provided", async () => {
			const res = await request(app)
				.post("/api/v1/places/new")
				.send({
					place_name: "test",
					description: "test",
					latitude: 123,
					longtitude: 234,
					photo_url: "test",
					address: "test",
					city_name: "test",
					country_name: "test",
				})
				.expect(201)
				.expect("Content-Type", /json/);

			expect(res.body).not.toBeFalsy();
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

		it("should return status 404 if place not found", async () => {
			const res = await request(app)
				.delete("/api/v1/places/delete/1000")
				.expect(404);

			expect(res.notFound).toBe(true);
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

		it("should return status 404 if place not found", async () => {
			const res = await request(app)
				.delete("/api/v1/places/update/1000")
				.expect(404);

			expect(res.notFound).toBe(true);
		});

		it("should return status 201 if body and id are passed correctly", async () => {
			const res = await request(app)
				.patch("/api/v1/places/update/3")
				.send({
					place_name: "Updated",
					description: "Updated",
					latitude: 123,
					longtitude: 234,
					photo_url: "Updated",
					address: "Updated",
					city_name: "Updated",
					country_name: "Updated",
				})
				.expect(201)
				.expect("Content-Type", /json/);

			expect(res.body).not.toBeFalsy();
		});
	});
});
