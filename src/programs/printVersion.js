const pckg = require('../../package.json')

const printVersion = args => {
  if (args.version) {
    const version = pckg.version

    process.stdout.write(version + '\n')
    process.stdout.end()
    process.exit(0)
  }
}

module.exports = {
  printVersion
}