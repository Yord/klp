const {requireOpts, restrictToOnly, reverseFlags, setDefaultValues} = require('shargs/parser')

module.exports = [
  setDefaultValues,
  restrictToOnly,
  requireOpts,
  reverseFlags,
  require('./castJson'),
  require('./castFunction'),
  require('./cutChar'),
  require('./setFunc'),
  require('./passOnVerbose')
]