const {subdocs} = require('../usage')

const printSubdocs = (cmd, args) => {
  return field => {
    if (args[field].help) {
      const help = subdocs(field)(cmd)

      process.stdout.write(help)
      process.stdout.end()
      process.exit(0)
    }
  }
}

module.exports = {
  printSubdocs
}