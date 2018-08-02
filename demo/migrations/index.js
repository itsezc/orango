const arango = require('../../arango/Arango').getInstance()
const Builder = require('../../avocado/Builder')

async function importCategories(conn) {
  const Model = arango.model('Category')

  let items = require('./data/categories')
  items = arango.toArray(items)

  let docs = await Builder.getInstance()
    .data(items)
    .convertTo(Model)
    .toObject()
    .exec()

  await Model.importDocs(docs, true)
}

async function importUsers() {
  const Model = arango.model('User')

  let items = require('./data/users')
  items = arango.toArray(items)

  let docs = await Builder.getInstance()
    .data(items)
    .convertTo(Model)
    .toObject()
    .exec()

  await Model.importDocs(docs, true)
}

async function importFriends() {
  const Model = arango.model('Friend')

  let items = require('./data/friends')
  items = arango.toArray(items)

  let docs = await Builder.getInstance()
    .data(items)
    .convertTo(Model)
    .toObject()
    .exec()

  await Model.importDocs(docs, true)
}

async function importAllDocs() {
  await importCategories()
  await importUsers()
  await importFriends()
}

module.exports = {
  importAllDocs,
  importCategories,
  importUsers,
  importFriends
}