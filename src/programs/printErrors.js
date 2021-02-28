const printErrors = (errs, args) => {
  if (errs.length > 0) {
    for (const err of errs) {
      const str = (
        (args.verbose >= 1 ? '(Line ' + (typeof err.line !== 'undefined' ? err.line : -1) + ') ' : '') +
        err.msg + 
        (args.verbose >= 2 ? (typeof err.info !== 'undefined' ? ', in ' + (typeof err.info === 'string' ? err.info : JSON.stringify(err.info)) : '') : '') +
        '\n'
      )
      const msg = (args.jsonErrors ? JSON.stringify(err) : str) + '\n'
      process.stderr.write(msg)
    }

    process.stderr.end()
    process.exit(1)
  }
}

module.exports = {
  printErrors
}