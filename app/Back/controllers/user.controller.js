const db = require("../models");
const User = db.user;
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const Role = db.role;

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

exports.userList = (req, res) => {
  User.findAll()
  .then(users => {
    res.status(200).send(users); 
  });
};

exports.allUsers = (req, res) => {
  //Récupère tous les utilisateurs sauf l'utilisateur en cours
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

exports.profilePicture = (req, res) => {
  // Stocke le chemin de la photo de profil (non fonctionnel actuellement)
  User.findByPk(req.body.userId)
    .then(user => {

      user.profile_picture = req.body.profile_picture_path;
      user.save();
      
      return res.status(200).send(path);
    })
    .catch(err => {
      console.log(err);
});
};

/*exports.getRole = (req, res) => {
  Role.findByPk(req.body.roleId)
  .then(role => {
    res.status(200).send(role);
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
} */