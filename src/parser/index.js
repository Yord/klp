const {parserSync} = require('shargs')

const stages = {
  argv: require('./argv'),
  opts: require('./opts'),
  args: require('./args'),
  fromArgs: require('./fromArgs')
}

const klpParser = parserSync(stages)

const klpLexer = parserSync({
  toArgv: require('./argv'),
  toArgs:   ({errs, opts}) => ({errs, args: opts}),
  fromArgs: ({errs, args}) => ({errs, opts: args})
})

module.exports = {
  klpParser,
  klpLexer
}