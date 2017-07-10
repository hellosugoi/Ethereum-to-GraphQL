import { Author, View, FortuneCookie, MetCoinContract } from './connectors'

const resolvers = {
  Query: {
    author(root, args) {
      return Author.find({ where: args })
    },
    getFortuneCookie() {
      return FortuneCookie.getOne()
    },
    metaCoin() {
      return new Promise((resolve, reject) => {
        MetCoinContract
            .deployed()
            .then(instance => {
              return instance.getBalance.call()
            })
            .then(data => {
              console.log('HEY CAN YOU SEE ME? ------------------------')
              return resolve(4)
            })
            .catch(e => {
              return reject(e)
            })
      })



    }
  },
  Author: {
    posts(author) {
      return author.getPosts()
    },
  },
  Post: {
    author(post) {
      return post.getAuthor()
    },
    views(post) {
      return View.findOne({ postId: post.id })
                 .then(view => view.views)
    }
  },

};

export default resolvers;
