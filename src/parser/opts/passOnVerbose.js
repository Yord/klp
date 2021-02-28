const passOnVerbose = ({errs, opts}) => {
  const verboses = opts.filter(({key}) => key === 'verbose')

  if (verboses.length === 0) return {errs, opts}

  const opts2 = []

  for (const opt of opts) {
    if (Array.isArray(opt.opts)) {
      opts2.push({
        ...opt,
        ...(!opt.values ? {} : {values: [...opt.values, ...verboses]})
      })
    } else {
      opts2.push(opt)
    }
  }

  return {errs, opts: opts2}
}

module.exports = passOnVerbose