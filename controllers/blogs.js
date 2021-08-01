const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', {username: 1, name: 1, id: 1})

  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  // Get the first user and we will assign it to new blogs
  const user = await User.find({}).limit(1)

  // Build the blog object with the related user
  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user[0]._id
  })

  // Return 400 Bad request if title and URL are missing
  if (!blog.title && !blog.url) {
    response.status(400)
  }

  const savedBlog = await blog.save()
  user[0].blogs = user[0].blogs.concat(blog._id)
  await user[0].save()

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