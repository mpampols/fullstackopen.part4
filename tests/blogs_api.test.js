const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const blogSchema = require('../models/blog')
const helper = require('./test_helper')

jest.setTimeout(10000)

beforeEach(async () => {
  await blogSchema.deleteMany({})
  let blogObject = new blogSchema(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new blogSchema(helper.initialBlogs[1])
  await blogObject.save()
  blogObject = new blogSchema(helper.initialBlogs[2])
  await blogObject.save()
})

/**
 * 4.8: Blog list tests, step1
 */
test('all blog posts are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

/**
 * 4.9*: Blog list tests, step2
 */
test('the unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  for (let blogPost of response.body) {
    expect(blogPost.id).toBeDefined()
  }
})

/**
 * 4.10: Blog list tests, step3
 */
test('verify that HTTP POST creates a blog post', async () => {
  const newBlogPost = {
    'title': 'Marc\'s blog 4',
    'author': 'Marc Pampols 4',
    'url': 'https://marcpampols4.net',
    'likes': 25,
  }

  await api
    .post('/api/blogs')
    .send(newBlogPost)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
})

/**
 * 4.11*: Blog list tests, step4
 */
test('if likes property is missing, default to 0', async () => {
  const blogToBeAdded = {
    'title': 'Marc\'s blog test',
    'author': 'Marc Pampols',
    'url': 'https://marcpampols.net',
  }

  const addedBlog = await api
    .post('/api/blogs')
    .send(blogToBeAdded)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const processedBlogToView = JSON.parse(JSON.stringify(addedBlog.body))
  expect(processedBlogToView).toHaveProperty('likes', 0)
})

/**
 * 4.12*: Blog list tests, step5
 */
test('return 400 Bad Request if title and URL are missing', async () => {
  const blogToBeAdded = {
    'author': 'Marc Pampols',
  }

  await api
    .post('/api/blogs')
    .send(blogToBeAdded)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

/**
 * Close mongoose connection after running all tests
 */
afterAll(() => {
  mongoose.connection.close()
})