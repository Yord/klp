module.exports = {
  ...require('./transform'),
  ...require('./repl'),
  ...require('./printDocs'),
  ...require('./printErrors'),
  ...require('./printSubdocs'),
  ...require('./printSubsubdocs'),
  ...require('./printVersion')
}