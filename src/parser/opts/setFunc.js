const {traverseOpts} = require('shargs/parser')

const setFunc = traverseOpts(({func}) => typeof func !== 'undefined')(opt => ({
  opts: [
    {
      ...opt,
      ...(!Array.isArray(opt.values) ? {} : {
        values: [
          ...opt.values,
          {key: 'func', types: ['function'], values: [opt.func]}
        ]
      })
    }
  ]
}))

module.exports = setFunc