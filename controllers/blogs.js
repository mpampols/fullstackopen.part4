const jwt = require('jsonwebtoken')

const blogsRouter = require('express').Router()

const middleware = require('./utils/middleware')

const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', {username: 1, name: 1, id: 1})

  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  // Get the authenticated user
  const token = middleware.tokenExtractor(request)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({
      error: 'Token missing or invalid'
    })
  }
  const user = await User.findById(decodedToken.id)

  // Build the blog object with the related user
  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user._id
  })

  // Return 400 Bad request if title and URL are missing
  if (!blog.title && !blog.url) {
    response.status(400)
  }

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(blog._id)
  await user.save()

  response.json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const blogToBeUpdated = {
    title: request.body.title,
    author: request.body.author,
    likes: request.body.likes,
    url: request.body.url,
  }
  const opts = {
    runValidators: true,
    new: true,
    context: 'query',
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blogToBeUpdated, opts)
  response.json(updatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter