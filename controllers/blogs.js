const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  // Retrn 400 Bad request if title and URL are missing
  if (!blog.title && !blog.url) {
    response.status(400)
  }

  const savedBlog = await blog.save()
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