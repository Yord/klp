const {subsubdocs} = require('../usage')

const printSubsubdocs = (cmd, args) => {
  return field => {
    if (args[field].list.length > 0) {
      const helpNeeded = args[field].list.find(obj => Object.values(obj).some(value => value.help))
      if (helpNeeded) {
        const subfield = Object.keys(helpNeeded)[0]
        const help = subsubdocs(field, subfield)(cmd)

        process.stdout.write(help)
        process.stdout.end()
        process.exit(0)
      }
    }
  }
}

module.exports = {
  printSubsubdocs
}