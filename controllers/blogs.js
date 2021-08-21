const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')

const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', {username: 1, name: 1, id: 1})
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  let user = request.user
  if (request.user == null) {
    user = await User.find({}).limit(1)
    user = user[0]
  }

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

  await blog.save()
  user.blogs = user.blogs.concat(blog._id)
  await user.save()

  const createdBlog = await Blog
    .findById(blog._id)
    .populate('user', {username: 1, name: 1, id: 1})
  response.json(createdBlog)
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
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

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user

  // Get the blog to get its author
  const blog = await Blog.findById(request.params.id)

  // Check of blog exists
  if (!blog) {
    return response.status(400).json({
      error: 'The blog you are trying to delete does not exists'
    })
  }

  // Blog can only be deleted by its author
  if (!request.token || (user.id.toString() !== blog.user.toString())) {
    return response.status(400).json({
      error: 'You can not delete the blog because you are not the author'
    })
  }

  // Delete the blog
  await Blog.findByIdAndRemove(request.params.id)

  response.status(204).end()
})

module.exports = blogsRouter