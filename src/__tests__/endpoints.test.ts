import request from "supertest";
import app from "../../src/app";
import dbClient from "../database";

describe("endpoints", () => {
  afterAll(async () => {
    dbClient.$disconnect();
  });
  describe("api/v1/places/:id", () => {
    test("should return a list of places", async () => {
      const res = await request(app).get("/api/v1/places").expect(200);
      expect(res.body).toBeTruthy();
    });
    test("should return one place", async () => {
      const res = await request(app).get("/api/v1/places/1").expect(200);
      expect(res.body).toBeTruthy();
    });
    test("should return 400 if place does not correct", async () => {
      await request(app).get("/api/v1/places/ddd").expect(400);
    });
    test("should return 404 if place does not exist", async () => {
      await request(app).get("/api/v1/places/9999999").expect(404);
    });
  });

  describe("api/v1/places/new", () => {
    test("should return new place", async () => {
      const res = await request(app)
        .post("/api/v1/places/new")
        .send({
          place_name: "test",
          description: "test",
          photo_url: "test",
          city_name: "Test",
          country_name: "Test",
          address: "test",
          altitude: 123,
          longtitude: 123,
        })
        .expect(200);
      expect(res.body).toBeTruthy();
    });
  });
});
