const {docs} = require('../usage')

const printDocs = (cmd, args) => {
  if (args.help) {
    const help = docs(cmd)

    process.stdout.write(help)
    process.stdout.end()
    process.exit(0)
  }
}

module.exports = {
  printDocs
}