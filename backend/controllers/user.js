const Users = require('../models/users')
const jwt = require('jsonwebtoken')
const { secret } = require('../config/environment')
const users = require('../models/users')

function createUser(req, res) {
  const body = req.body
  Users
    .create(body)
    .then(user => {
      res.send(user)
    })
    .catch(error => res.send(error))
}

function loginUser(req, res) {
  Users
    .findOne({ email: req.body.email })
    .then(user => {
      if (!user) return res.status(404).send({ message: 'Not found' })
      if (!user.validatePassword(req.body.password)) {
        return res.status(401).send({ message: 'Unauthorized' })
      }

      const token = jwt.sign(
        { sub: user.id },
        secret,
        { expiresIn: '12h' }
      )
      const username = user.username
      res.status(202).send({ token, username, message: 'login successful' })
    })
    .catch(error => res.send(error))
}

function findUsers(req, res) {
  users.find()
    .then(users => res.send(users))
    .catch(error => res.send(error))
}


function findUser(req, res) {
  Users
    .findById(req.params.userId)
    .then(user => res.send(user))
    .catch(error => res.send(error))
}

module.exports = {
  createUser,
  loginUser,
  findUser,
  findUsers
}