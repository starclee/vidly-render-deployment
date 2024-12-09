let request = require("supertest");
let { Genre } = require("../../models/genre");
let { User } = require("../../models/user");
const mongoose = require("mongoose");

let server, name, token;

let executionFn = async () => {
  return await request(server)
    .post("/api/genres")
    .set("x-auth-token", token)
    .send({ name });
};

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });

  afterEach(async () => {
    await server.close();
    await Genre.deleteMany({});
  });

  beforeEach(async () => {
    token = new User().generateAuthToken();
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        {
          name: "Genre1",
        },
        {
          name: "Genre2",
        },
      ]);

      let res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((x) => x.name === "Genre1")).toBeTruthy();
      expect(res.body.some((x) => x.name === "Genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("Should return the valid genre for the given id", async () => {
      let genre = new Genre({ name: "Genre" });
      await genre.save();

      let res = await request(server).get("/api/genres/" + genre._id);
      // console.log({ genre,res : res.body });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("Should return 404 status if invalid id passed", async () => {
      let res = await request(server).get("/api/genres/" + 2);
      expect(res.status).toBe(404);
    });

    it("Should return 404 status if invalid id passed", async () => {
      let id = new mongoose.Types.ObjectId().toHexString();
      let res = await request(server).get("/api/genres/" + id);
      expect(res.status).toBe(404);
    });
  });

  describe("POST", () => {
    it("Should return 401 error if client is not authenticated", async () => {
      token = "";
      const res = await executionFn();
      expect(res.status).toBe(401);
    });

    it("Should return 400 if input having less than 3 characters ", async () => {
      name = "ge";
      const res = await executionFn();
      expect(res.status).toBe(400);
    });

    it("Should return 400 if input having more than 12 characters ", async () => {
      name = new Array(14).join("abc");
      const res = await executionFn();
      expect(res.status).toBe(400);
    });

    it("Should save the genre if name of the genre is valid ", async () => {
      name = "genre1";
      const res = await executionFn();
      let genre = await Genre.find({ name });
      expect(genre).not.toBeNull();
    });

    it("Should return the genre if name of the genre is valid ", async () => {
      name = "genre1";
      const res = await executionFn();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name");
    });
  });

  describe("PUT /:id", () => {
    it("should return 200 if given id is valid", async () => {
      name = "genre1";
      let res = await executionFn();

      let id = res.body._id;
      let putRes = await request(server)
        .put("/api/genres/" + id)
        .set("x-auth-token", token)
        .send({ name: "genre2" });

      expect(putRes.status).toBe(200);
    });
  });

  describe("DELETE /:id", () => {
    it("should return 200 and delete the data", async () => {
      name = "genre1";
      let res = await executionFn();

      let id = res.body._id;

      token = new User({
        _id: new mongoose.Types.ObjectId().toHexString(),
        isAdmin: true,
      }).generateAuthToken();

      let delRes = await request(server)
        .delete("/api/genres/" + id)
        .set("x-auth-token", token);

      expect(delRes.status).toBe(200);
    });
  });
});
