const {desc, note, notes, onlySubcommands, optsFilter, optsList, space, synopsis, usage, noSubcommands} = require('shargs/usage')

const width  = 80
const padEnd = 2

const style = colWidth => ({
  line: [{width}],
  cols: [{width: colWidth, padEnd}, {width: width - colWidth - padEnd}]
})

const subsubdocs = (key1, key2) => cmd => {
  const cmd1 = cmd.opts.find(opt => opt.key === key1)
  const cmd2 = cmd1.opts.find(opt => opt.key === key2)

  const colWidth = computeMaxOptDescLength(cmd2)

  return usage([
    noSubcommands(cmd2 =>
      synopsis({
        ...cmd2,
        key: `Usage: ${cmd.key} ${cmd1.args.join('|')} ${cmd2.args.join('|')}`
      })
    ),
    space,
    desc,
    space,
    optsFilter(_ => _.key !== 'help')(cmd =>
      usage(cmd.opts.length === 0 ? [] : [
        note('Options:'),
        optsList,
        space,
      ])(cmd)
    ),
    notes([
      'Help:',
      `${cmd.key} ${cmd1.args[0]} ${cmd2.args[0]} --help`
    ]),
    space,
    note('Copyright (c) Philipp Wille 2021')
  ])(cmd2)(style(colWidth))
}

const subdocs = key => cmd => {
  const cmd2 = cmd.opts.find(opt => opt.key === key)

  const colWidth = computeMaxOptDescLength(cmd2)

  return usage([
    noSubcommands(cmd2 =>
      synopsis({
        ...cmd2,
        key: `Usage: ${cmd.key} ${cmd2.args.join('|')} <${capitalize(key)}>`
      })
    ),
    space,
    desc,
    space,
    note(`${capitalize(key)}s:`),
    onlySubcommands(cmd =>
      optsList({...cmd, opts: cmd.opts.sort((a, b) => a.key < b.key ? -1 : 1)})
    ),
    space,
    onlySubcommands(
      usage([
        notes([
          'Help:',
          `${cmd.key} ${cmd2.args[0]} --help`,
          `${cmd.key} ${cmd2.args[0]} ${cmd2.opts[0].args[0]} --help`
        ]),
        space
      ])
    ),
    note('Copyright (c) Philipp Wille 2021')
  ])(cmd2)(style(colWidth))
}

const docs = cmd => {
  const colWidth = computeMaxOptDescLength(cmd)

  const deserializer = cmd.opts.find(_ => _.key === 'deserializer')

  return usage([
    cmd => synopsis({
      ...cmd,
      key: `Usage: ${cmd.key}`
    }),
    space,
    desc,
    space,
    note('Processing:'),
    onlySubcommands(optsList),
    space,
    note('Options:'),
    optsFilter(_ => _.key !== 'help')(noSubcommands(optsList)),
    space,
    notes([
      'Help:',
      `${cmd.key} --help`,
      `${cmd.key} ${deserializer.args[0]} --help`,
      `${cmd.key} ${deserializer.args[0]} ${deserializer.opts[0].args[0]} --help`
    ]),
    space,
    note('Copyright (c) Philipp Wille 2021')
  ])(cmd)(style(colWidth))
}

module.exports = {
  docs,
  subdocs,
  subsubdocs
}

function computeMaxOptDescLength (cmd) {
  function valuesLabel ({descArg, types, only = []}, equalsSign) {
    const value = (
      typeof descArg === 'string'            ? descArg :
      Array.isArray(only) && only.length > 0 ? only.join('|') :
      Array.isArray(types)                   ?
      types.length === 1                     ? types[0] :
      types.length > 1                       ? types.join(' ')
                                             : ''
                                             : ''
    )
  
    if (value === '') return ''
  
    return (equalsSign ? '=' : ' ') + '<' + value + '>'
  }

  function sortArgs (args) {
    const singleDash = []
    const doubleDash = []
    const others     = []
  
    for (let i = 0; i < args.length; i++) {
      const arg = args[i]
      if (arg.startsWith('--'))     doubleDash.push(arg)
      else if (arg.startsWith('-')) singleDash.push(arg)
      else                          others.push(arg)
    }
  
    return {singleDash, others, doubleDash}
  }

  function listArgs (opt) {
    const {singleDash, others, doubleDash} = sortArgs(opt.args || [])
    const commaList = [...singleDash, ...others, ...doubleDash].join(', ')
    return commaList + valuesLabel(opt, doubleDash.length > 0)
  }

  const opts      = (cmd.opts || []).filter(_ => _.key !== 'help')
  const descs     = opts.map(opt => opt.args ? listArgs(opt) : `<${opt.key}>`)
  const lengths   = descs.map(desc => desc.length)
  const maxLength = lengths.reduce((max, length) => Math.max(max, length), 0)
  return maxLength
}

function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}