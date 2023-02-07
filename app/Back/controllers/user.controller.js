const db = require("../models");
const User = db.user;
const Sequelize = require('sequelize');
const op = Sequelize.Op;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.allUsers = (req, res) => {
  //Récupère tous les utilisateurs sauf le user en cours
  User.findAll({
    where: {
      id: {
        [op.not]: req.params.userId
      }
    }
  })
  .then(users => {
    res.status(200).send(users); 
  });
};