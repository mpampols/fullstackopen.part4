const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body
  const password = request.body.password

  // Return 400 Bad request if title and URL are missing
  if (password.length < 3) {
    response.status(400).send({ error: 'Password must be at least 3 characters long'})
    return
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.json(savedUser)
})

afterAll(() => {
  mongoose.connection.close()
})

module.exports = usersRouter