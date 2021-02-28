const {traverseOpts} = require('shargs/parser')

const castJson = traverseOpts(({types = []}) => types.includes('json'))(opt => {
  const types  = opt.types
  const values = opt.values

  if (!Array.isArray(values)) return opt

  for (let index = 0; index < types.length; index++) {
    const type = types[index]

    if (type === 'json' && typeof values[index] === 'string') {
      values[index] = JSON.parse(values[index])
    }
  }

  return {
    opts: [{...opt, values}]
  }
})

module.exports = castJson