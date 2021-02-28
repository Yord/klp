const {failRest, flagAsNumber, flagsAsBools} = require('shargs/parser')

module.exports = [
  flagAsNumber('verbose'),
  flagsAsBools,
  failRest
]