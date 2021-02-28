const repl = (cmd, args) => {
  if (args.interactive) {
    console.log(JSON.stringify(args, null, 2))

    process.exit(0)
  }
}

module.exports = {
  repl
}