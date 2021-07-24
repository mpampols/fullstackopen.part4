const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue.likes
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce(
    (acc, blog) =>  acc = acc.likes > blog.likes ? acc : blog, 0
  )
}

/**
 * Returns the author who has the largest amount of blogs.
 * The return value also contains the number of blogs the top author has
 */
const mostBlogs = (blogs) => {
  let group = blogs.reduce((r, a) => {
    r[a.author] = [...r[a.author] || [], a]
    return r
  }, {})

  const mostBlogsAuthorObject = group[Object.keys(group).reduce(
    (acc, blog) =>  acc = acc.childElementCount > blog.childElementCount ? acc : blog, 0
  )]

  return {
    'author': mostBlogsAuthorObject[0].author,
    'blogs': mostBlogsAuthorObject.length
  }
}

const mostLikes = (blogs) => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue.likes

  let group = blogs.reduce((r, a) => {
    r[a.author] = [...r[a.author] || [], a]
    return r
  }, {})

  var largest = 0
  var mostLikedAuthor = ''
  Object.keys(group).forEach(key => {
    if (largest < group[key].reduce(reducer, 0)) {
      largest = group[key].reduce(reducer, 0)
      mostLikedAuthor = key
    }
  })

  return {
    'author': mostLikedAuthor,
    'likes': largest
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}