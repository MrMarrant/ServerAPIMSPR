var jwtUtils = require("../utils/jwt.utils");
var models = require("../models");
var asyncLib = require("async");
const ITEMS_LIMIT = 50;

module.exports = {
  createCoupon: function (req, res) {
    // Get l'authentification du Header
    var headerAuth = req.headers["authorization"];
    var userId = jwtUtils.getUserId(headerAuth);

    // Paramètres
    var code = req.body.code;
    var dateDebut = req.body.dateDebut;
    var dateExpiration = req.body.dateExpiration;
    var productId = req.body.productId;
    var reduction = req.body.reduction;
    var condition = req.body.condition;

    if (
      code.length == null ||
      reduction == null ||
      dateDebut == null ||
      dateExpiration == null ||
      productId == null ||
      condition.length == null
    ) {
      return res.status(400).json({ error: "Paramètres manquant" });
    }

    asyncLib.waterfall([
            // Vérifie si l'utilisateur est connecté et existant
      function (done) {
        models.User.findOne({
          where: { id: userId },
        })
          .then(function (userFound) {
            done(null, userFound);
          })
          .catch(function (err) {
            return res
              .status(500)
              .json({ error: "Impossible de vérifier lutilisateur ou vous n'êtes pas connecté" });
          });
      },
      // Vérifie si le produit entré existe 
      function (userFound, done) {
        if (userFound) {
            console.log("connexion vérifié")
          models.Product.findOne({
            where: { id: productId },
          })
            .then(function (productFound) {
              done(null, productFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "Impossible de trouver le produit identifié" });
            });
        } else {
          return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
      },
      // Vérifie que le coupon n'existe pas déjà via le code
      function (productFound, done) {
        if (productFound) {
          models.Coupon.findOne({
            where: { code: code },
          })
            .then(function (couponFound) {
              if (couponFound == null) {
                done(null, couponFound);
              }
              else{
                return res
                .status(403)
                .json({ error: "Le coupon que vous scanné a déjà été scanné" });
              }
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "Impossible de trouver le coupon identifié" + err });
            });
        } else {
          return res.status(404).json({ error: "Produit non trouvé" });
        }
      },
      function (couponFound, done) {
        if (couponFound == null) {
          models.Coupon.create({
            code: code,
            dateDebut: dateDebut,
            dateExpiration: dateExpiration,
            productId: productId,
            userId: userId,
            reduction: reduction,
            condition: condition
          }).then(function (newCoupon) {
            done(null, newCoupon);
          });
        } else {
          return res.status(404).json({ error: "Coupon non trouvé" });
        }
      },
      function (newCoupon, done) {
        if (newCoupon) {
          return res.status(201).json(newCoupon);
        } else {
          return res
            .status(500)
            .json({ error: "Impossible de créer le coupon" });
        }
      },
    ]);
  },
  everyCoupon: function (req, res) {
    // Get l'authentification du Header
    var headerAuth = req.headers["authorization"];
    var userId = jwtUtils.getUserId(headerAuth);

    var fields = req.query.fields;
    var limit = parseInt(req.query.limit);
    var offset = parseInt(req.query.offset);
    var order = req.query.order;
    if (limit > ITEMS_LIMIT) {
      limit = ITEMS_LIMIT;
    }

    asyncLib.waterfall([
      function (done) {
        models.User.findOne({
          where: { id: userId },
        })
          .then(function (userFound) {
            done(null, userFound);
          })
          .catch(function (err) {
            return res
              .status(500)
              .json({ error: "Impossible de vérifier lutilisateur" });
          });
      },
      function (userFound, done) {
        if (userFound) {
          models.Coupon.findAll({
            where: { userId: userId },
            order: [order != null ? order.split(":") : ["code", "ASC"]],
            attributes:
              fields !== "*" && fields != null ? fields.split(",") : null,
            limit: !isNaN(limit) ? limit : null,
            offset: !isNaN(offset) ? offset : null,
            include: [{
              model: models.Product,
              attributes: ['nom']
             }],
          })
            .then(function (messages) {
              if (messages) {
                res.status(200).json(messages);
              } else {
                res.status(404).json({ error: "Coupon Non trouvé" });
              }
            })
            .catch(function (err) {
              console.log(err);
              res.status(500).json({ error: "Champs Invalide" });
            });
        } else {
          return res
            .status(404)
            .json({ error: "Utilisateur non trouvé ou non connecté" });
        }
      },
    ]);
  },
  oneCoupon: function (req, res) {
    // Get l'authentification du Header
    var headerAuth = req.headers["authorization"];
    var userId = jwtUtils.getUserId(headerAuth);
    var code = req.body.code;

    asyncLib.waterfall([
      function (done) {
        models.User.findOne({
          where: { id: userId },
        })
          .then(function (userFound) {
            console.log(userFound)
            done(null, userFound);
          })
          .catch(function (err) {
            return res.status(500).json({
              error: "Impossible de vérifier lutilisateur ou non connecté" + err,
            });
          });
      },
      function (userFound, done) {
        if (userFound) {
          models.Coupon.findOne({
            // as: "c",
            attributes: ["code", "dateDebut","dateExpiration", "reduction", "condition"],
            where: { code: code },
            include: [{
              model: models.Product,
            //   as: 'Product',
            attributes: ['nom']
             }],
            truncate: true,
          })
            .then(function (couponFound) {
              console.log("Type de coupon : ")
              console.log(Object.prototype.toString.apply(couponFound))
              console.log("code : ")
              console.log(couponFound.code)
              //couponFound.nomProduit = productFound.nom
              //console.log("nomProduit : ")
              //console.log(couponFound.nomProduit)
              if (couponFound) {
                res.status(200).json(couponFound);
              } else {
                res.status(404).json({ error: "Coupon Non trouvé" });
              }
            })
            .catch(function (err) {
              console.log(err);
              res.status(500).json({ error: "Champs Invalide : " + err });
            });
        } else {
          return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
      },
    ]);
  },
  /*
  updateCoupon: function (req, res) {
    var code = req.body.nom;
    var prix = req.body.prix;
    var headerAuth = req.headers["authorization"];
    var userId = jwtUtils.getUserId(headerAuth);

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            where: { id: userId },
          })
            .then(function (userFound) {
              console.log(userFound);
              done(null, userFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "Impossible de vérifier lutilisateur" });
            });
        },
        function (userFound, done) {
          if (userFound) {
            models.Product.findOne({
              attributes: ["id", "nom", "prix"],
              where: { nom: nom },
              truncate: true,
            })
              .then(function (productFound) {
                console.log("productfound 2 : ");
                console.log(productFound);
                done(null, productFound);
              })
              .catch(function (err) {
                return res.status(500).json({
                  error: "Impossible de trouver le produit",
                });
              });
          } else {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
          }
        },
        function (productFound, done) {
          console.log("productfound 3 : ");
          console.log(productFound);
          if (productFound) {
            productFound
              .update({
                prix: prix,
              })
              .then(function () {
                console.log("productfound 4 : ");
                console.log(productFound);
                done(productFound);
              })
              .catch(function (err) {
                res.status(500).json({
                  error: "Impossible de mettre à jour le produit : " + err,
                });
              });
          } else {
            return res.status(404).json({ error: "Produit non trouvé" });
          }
        },
      ],
      function (updateProduct) {
        if (updateProduct) {
          return res.status(201).json(updateProduct);
        } else {
          return res
            .status(500)
            .json({ error: "Impossible de mettre à jour le produit" });
        }
      }
    );
  }, */
};
