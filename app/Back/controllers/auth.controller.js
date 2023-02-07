const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

//Pour valider le format de l'adresse mail
function validateEmail(email) {

  let validRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email.match(validRegex)) {
    return true;
  } else {
    return false;
  }
}

exports.signup = (req, res) => {
  if(validateEmail(req.body.email)) {

  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      let token = jwt.sign({ username: user.username }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      /*if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.status(200).send({
              message: "User registered successfully!",
              accessToken: token
            });
          });
        });
      } else {
        // user role = 1
        user.setRoles([0]).then(() => {
          res.status(200).send({
            message: "User registered successfully!",
            accessToken: token
          });
        });
      }*/
      res.status(200).send({
        message: "User registered successfully!",
        accessToken: token
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
  } else {
    res.status(422).send({message: "Format de l'email incorrect",});
  }
    
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      
      let token = jwt.sign({ username: user.username }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      console.log(req.body);
      res.status(500).send({ message: req.body });
    });
};
