const {traverseOpts} = require('shargs/parser')

const castFunction = traverseOpts(({types = []}) => types.includes('function'))(opt => {
  const errs = []
  const types  = opt.types
  const values = opt.values

  if (!Array.isArray(values)) return opt

  for (let index = 0; index < types.length; index++) {
    const type = types[index]

    if (type === 'function' && typeof values[index] === 'string') {
      try {
        values[index] = eval(values[index])
      } catch (err) {
        errs.push({
          code: 'FunctionEvaluationError',
          msg: 'The function you are trying to evaluate was not a proper JavaScript function.',
          info: err
        })
      }
    }
  }

  return {
    opts: [{...opt, values}],
    errs
  }
})

module.exports = castFunction