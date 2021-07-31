const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    'title': 'Marc\'s blog 1',
    'author': 'Marc Pampols',
    'url': 'https://marcpampols.net',
    'likes': 5,
  },
  {
    'title': 'Marc\'s blog 2',
    'author': 'Marc Pampols 2',
    'url': 'https://marcpampols2.net',
    'likes': 10,
  },
  {
    'title': 'Marc\'s blog 3',
    'author': 'Marc Pampols 3',
    'url': 'https://marcpampols3.net',
    'likes': 15,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb
}