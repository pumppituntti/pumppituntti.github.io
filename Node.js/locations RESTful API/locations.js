const express = require("express");
const connection = require("./connection.js");
var locations = express.Router();
const Validator = require("jsonschema").Validator;
const validator = new Validator();

var schema = {
  properties: {
    latitude: {
      type: "number",
      minimum: -90,
      maximum: 90,
    },
    longitude: {
      type: "number",
      minimum: -180,
      maximum: 180,
    },
  },
};

locations.use(express.json());

locations.get("/max?", async (req, res) => {
  try {
    if (req.query.latitude) {
      let filter = `latitude <= ${req.query.latitude.toString()}`;
      console.log(filter);
      let result = await connection.filter(filter);
      res.send(result);
    } else if (req.query.longitude) {
      let filter = `longitude <= ${req.query.longitude.toString()}`;
      console.log(filter);
      let result = await connection.filter(filter);
      res.send(result);
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    console.log(err);
  }
});

locations.get("/min?", async (req, res) => {
  try {
    if (req.query.latitude) {
      let filter = `latitude >= ${req.query.latitude.toString()}`;
      console.log(filter);
      let result = await connection.filter(filter);
      res.send(result);
    } else if (req.query.longitude) {
      let filter = `longitude >= ${req.query.longitude.toString()}`;
      console.log(filter);
      let result = await connection.filter(filter);
      res.send(result);
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    console.log(err);
  }
});

locations.get("/", async (req, res) => {
  try {
    let result = await connection.findAll();
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

locations.get("/:number([0-9]+)", async (req, res) => {
  try {
    let num = req.params.number;
    let result = await connection.findById(num);
    if (Object.keys(result).length !== 0) {
      res.send(result);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
  }
});

locations.post("/", async (req, res) => {
  try {
    let loc = req.body;
    let result = validator.validate(loc, schema);
    if (result.errors.length === 0) {
      console.log(await connection.save(loc));
      res.statusCode = 201;
      res.send(loc);
    } else {
      res.end;
      res.statusCode = 400;
      res.send(res.statusCode + " Bad request\n" + result.errors);
    }
  } catch (err) {
    console.log(err);
  }
});

locations.delete("/:number([0-9]+)", async (req, res) => {
  try {
    let num = req.params.number;
    console.log(await connection.deleteById(num));
    res.statusCode = 204;
    res.send(res.statusCode + "Deleted");
  } catch (err) {
    console.log(err);
  }
});

module.exports = locations;
