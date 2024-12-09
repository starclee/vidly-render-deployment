const { Rental } = require("../../models/rental");
const mongoose = require("mongoose");
const request = require("supertest");
const { User } = require("../../models/user");
const moment = require("moment");
const { Movie } = require("../../models/movie");

describe("/api/returns", () => {
  let server, customerId, movieId, rental, movie, token;

  const executeFn = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../index");

    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: "12345",
      genre: {
        name: "12345",
      },
      numberInStock: 10,
      dailyRentalRate: 2,
    });
    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        mobileNo: "6789090900",
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2,
      },
    });

    await rental.save();
  });

  afterEach(async () => {
    await Rental.deleteMany({});
    await Movie.deleteMany({});
    await server.close();
  });

  it("Should return 401 unauthroized access", async () => {
    token = "";
    let res = await executeFn();
    expect(res.status).toBe(401);
  });

  it("Should return 400 if Customer id is not given in the body of the request", async () => {
    customerId = "";
    let res = await executeFn();
    expect(res.status).toBe(400);
  });

  it("Should return 400 if Movie id is not given in the body of the request", async () => {
    movieId = "";
    let res = await executeFn();
    expect(res.status).toBe(400);
  });

  it("Should return 404 for given movie/customer", async () => {
    await Rental.deleteMany({});

    let res = await executeFn();
    expect(res.status).toBe(404);
  });

  it("Should return 400 if return is already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();

    let res = await executeFn();
    expect(res.status).toBe(400);
  });

  it("Should return 200 if it's a valid request", async () => {
    let res = await executeFn();
    expect(res.status).toBe(200);
  });

  it("Should return the Date returned property if valid request", async () => {
    let res = await executeFn();

    let rentalInDB = await Rental.findById(rental._id);
    let diffTime = new Date() - rentalInDB.dateReturned;
    expect(diffTime).toBeLessThan(10 * 1000);
  });

  it("Should return the rental amount based on Date out and returned", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();
    let res = await executeFn();

    let rentalInDB = await Rental.findById(rental._id);

    expect(rentalInDB.rentalFee).toBe(14);
  });

  it("Should increment the movie stock in the DB", async () => {
    let res = await executeFn();

    let movieInDB = await Movie.findById(movieId);

    expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);
  });

  it("Should return the rental if input is valid", async () => {
    let res = await executeFn();

    // let rentalInDB = await Rental.findById(rental._id);
    console.log("ff",res.body)

    expect(Object.keys(res.body)).toEqual(expect.arrayContaining(["dateOut","dateReturned","rentalFee","customer","movie"]))
  });
});
