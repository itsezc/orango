require('app-module-path').addPath(__dirname)
const orango = require('orango')
const readFiles = require('./helpers/readFiles')
const pluralize = require('pluralize')
const {
  sortToAQL,
  filterToAQL,
  setDefaultsToNull,
  arrayOverride,
  createUniqueId
} = orango.helpers
require('colors')

const AQB = orango.AQB

function parseQuery(data) {
  let ModelCls = orango.model(data.model)
  let col = ModelCls.collectionName
  let doc = pluralize.singular(col)
  let aql = AQB.for(doc).in(col)
  let filterAQL = filterToAQL(data.filter, doc)
  let result = doc
  if (data.select) {
    let select = data.select.split(' ')
    for (let i = 0; i < select.length; i++) {
      select[i] = AQB.str(select[i])
    }
    result = AQB.KEEP(doc, select)
  }

  aql = aql.filter(AQB.expr(filterAQL))
  if (data.offset && data.limit) {
    aql = aql.limit(data.offset, data.limit)
  } else if (data.offset) {
    aql = aql.limit(data.offset, 10)
  } else if (data.limit) {
    aql = aql.limit(data.limit)
  }

  // dummy
  // these are just properties???
  let merges = ['junk', 'test']
  // these are populates
  let appends = ['user']

  let appendData = {}
  for(let name of appends) {
    appendData[name] = name
  }

  result = AQB.MERGE(result, AQB.expr(merges.join(', ')), appendData)

  // AQB.KEEP(aqb.DOCUMENT(aqb.CONCAT(aqb.str('users/'), 'tweet.user')), AQB.str('firstName'), AQB.str('lastName'))

  aql = aql.return(result)
  return aql.toAQL()
}

async function main() {
  readFiles('models')

  let result = parseQuery({
    model: 'Tweet',
    method: 'find',
    filter: {
      $or: [{
        active: true
      }, {
        test: 1
      }]
    },
    limit: 10,
    offset: 1,
    select: 'firstName lastName',
    populate: [{
        model: 'User',
        computed: true,
        select: 'firstName lastName'
      },
      {
        model: 'Comment',
        limit: 10,
        computed: true,
        populate: [{
          model: 'User',
          computed: true,
          select: 'firstName lastName'
        }]
      }
    ],
    computed: true
  })

  console.log(result.green)
}

main()