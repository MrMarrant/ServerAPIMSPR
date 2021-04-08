const express = require('express')
const bodyParser = require("body-parser");

const supertest = require('supertest');
var apiRouter = require('../apiRouter').router;
var app = express();
app.use("/mspr/", apiRouter);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

describe('Sample Test', () => {
  it('should test that true === true', () => {
    expect(true).toBe(true)
  })
})



describe("Test Root du Serveur", () => {

  it("Test l'url / du serveur, on attend une réponse 200", async () => {


    const response = await supertest(app).get('/');
    expect(200)

  });

  it("POST | Login avec jeanlouis", async () => {

    const response = await supertest(app).post('/users/login').send({
      email: 'jeanlouis@gmail.com',
      password: '12345'
    });
    console.log(response.status);
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Movies Saved Successfully.');

  });

});

