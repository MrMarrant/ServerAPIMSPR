var express = require("express");
const productsController = require("./routes/productsController");
var usersController = require("./routes/usersController");

exports.router = (function(){
    var apiRouter = express.Router();

    // Route User
    apiRouter.route("/users/register/").post(usersController.register);
    apiRouter.route("/users/login/").post(usersController.login);
    apiRouter.route("/users/me/").get(usersController.getUserProfile);
    apiRouter.route("/users/me/").put(usersController.updateUserProfile);

    // Route Product
    apiRouter.route("/product/create/").post(productsController.createProduct);
    apiRouter.route("/product/update/").put(productsController.updateProduct);
    apiRouter.route("/product/getall/").get(productsController.everyProduct);
    apiRouter.route("/product/get/").get(productsController.oneProduct);

    return apiRouter;
}) ();