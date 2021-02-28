const {traverseOpts} = require('shargs/parser')

const cutChar = traverseOpts(({types = []}) => types.includes('char'))(opt => {
  const types  = opt.types
  const values = opt.values

  if (!Array.isArray(values)) return opt

  for (let index = 0; index < types.length; index++) {
    const type = types[index]

    if (type === 'char' && typeof values[index] === 'string') {
      values[index] = values[index].slice(0, 1)
    }
  }

  return {
    opts: [{...opt, values}]
  }
})

module.exports = cutChar