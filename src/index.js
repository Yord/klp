const os = require('os')
const path = require('path')
const {flag} = require('shargs/opts')
const {klp} = require('./opts')
const {klpParser} = require('./parser')
const {transform, repl, printDocs, printErrors, printSubdocs, printSubsubdocs, printVersion} = require('./programs')

let dotKlp = {}

try {
  dotKlp = require(path.join(os.homedir(), '.klp'))
} catch (e) {
  if (e.code !== 'MODULE_NOT_FOUND' || !e.message.match(/Cannot\sfind\smodule\s'.+\.klp'/)) throw e
}

Object.assign(global, dotKlp.context || {})

const basePlugins = [
  require('./plugins/id'),
  ...dotKlp.plugins,
]

const baseDefaults = {
  chunker: 'id',
  deserializer: 'id',
  applier: 'id',
  serializer: 'id'
}

const extraPlugins = [
  require('klp-dsv'),
  require('klp-core'),
  require('klp-json')
]

const extraDefaults = {
  chunker: 'line',
  deserializer: 'json',
  applier: 'map',
  serializer: 'json'
}

const defaults = {
  ...extraDefaults,
  ...dotKlp.defaults
}

const parse = parser(klp, klpParser, basePlugins, baseDefaults, extraPlugins, defaults)

const argv = process.argv.slice(2)
const {cmd, args, errs} = parse(argv)


printVersion(args)

repl(cmd, args)

printDocs(cmd, args)

const parts = ['chunker', 'deserializer', 'applier', 'serializer']
parts.forEach(printSubdocs(cmd, args))
parts.forEach(printSubsubdocs(cmd, args))

printErrors(errs, args)

transform(args)

function parser (klp, parser, basePlugins, baseDefaults, extraPlugins, defaults) {
  return argv => {
    const helper = (plugins, defaults) => {
      const emptyPlugin = {chunkers: [], deserializers: [], appliers: [], serializers: []}
      const concatField = (field, obj1, obj2) => ({[field]: [...obj1[field], ...(obj2[field] || [])]})
      const mergePlugins = (acc, plugin) => ({
        ...concatField('chunkers', acc, plugin),
        ...concatField('deserializers', acc, plugin),
        ...concatField('appliers', acc, plugin),
        ...concatField('serializers', acc, plugin)
      })
      const plugin = plugins.reduce(mergePlugins, emptyPlugin)
  
      const cmd  = klp(plugin, defaults)
      const cmd2 = addHelp(cmd)

      const parse = parser(cmd2)
      return {cmd: cmd2, ...parse(argv)}
    }
  
    const plugins = [...extraPlugins, ...basePlugins]
  
    const {cmd, args, errs} = helper(plugins, defaults)
    if (!args.noPlugins) return {cmd, args, errs}
    
    return {cmd, ...helper(basePlugins, baseDefaults)}
  }
}

function addHelp (cmd) {
  return {
    ...cmd,
    opts: [
      ...cmd.opts.map(opt => opt.opts ? addHelp(opt) : opt),
      flag('help', ['--help'])
    ]
  }
}