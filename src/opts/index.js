const {command, flag, subcommand} = require('shargs/opts')

const desc = (
  'Kelpie is a small, fast and magical row-based data processor similar to pxi, jq, ' +
  'fx, mlr and awk. It is as fast as gawk, 3x faster than jq and mlr and 15x faster ' +
  'than fx. Kelpie has a rich plugin ecosystem and makes writing and using your own ' +
  'plugins simple. You may enrich Kelpie with Lodash, Ramda or any other JavaScript ' +
  'data processing library. Read more in the manual at https://github.com/Yord/klp.'
)

const klp = (plugin, _defaults) => {
  const createDefault = (field, list) => {
    const defaultStage = list.find(_ => _.name === field)
    const {name, opts, func, ...rest} = defaultStage
    return subcommand(opts)(name, [name], {...rest, defaultValues: opts, func})
  }

  const defaults = {
    chunker: createDefault(_defaults.chunker, plugin.chunkers),
    deserializer: createDefault(_defaults.deserializer, plugin.deserializers),
    applier: createDefault(_defaults.applier, plugin.appliers),
    serializer: createDefault(_defaults.serializer, plugin.serializers)
  }

  const pluginGroup = plugins => subcommand(
    plugins.map(({name, opts, func, ...rest}) => subcommand(opts)(name, [name], {...rest, func}))
  )
  
  return command('klp', [
    pluginGroup(plugin.chunkers)('chunker', ['--by'], {
      descArg: 'chunker',
      defaultValues: [defaults.chunker],
      desc: 'Extracts tokens from standard input chunks (e.g. whole lines).'
    }),
    pluginGroup(plugin.deserializers)('deserializer', ['--from'], {
      descArg: 'format',
      defaultValues: [defaults.deserializer],
      desc: 'Deserializes tokens to an AST using a format (e.g. JSON, CSV).'
    }),
    pluginGroup(plugin.appliers)('applier', ['--with'], {
      descArg: 'applier',
      defaultValues: [defaults.applier],
      desc: 'Modifies the AST with JavaScript functions (e.g. map, filter).'
    }),
    pluginGroup(plugin.serializers)('serializer', ['--to'], {
      descArg: 'format',
      defaultValues: [defaults.serializer],
      desc: 'Serializes the formatted AST to standard out (e.g. JSON, CSV).'
    }),
    flag('interactive', ['--repl'], {
      desc: 'Starts Kelpie in interactive mode featuring a command factory.'
    }),
    flag('failEarly', ['--fail-fast'], {
      defaultValues: [-1],
      descDefault: '',
      desc: 'Writes only the first error message to standard err and exits.'
    }),
    flag('noPlugins', ['--no-plugins'], {
      desc: 'Enables only the id plugin and plugins from the ~/.klp module. ' +
            'Also sets the defaults of --by, --from, --with and --to to id.'
    }),
    flag('verbose', ['-v'], {
      defaultValues: [0],
      descDefault: '',
      desc: 'Provides more information in error messages and activates line ' +
            'tracking. Apply more than once (e.g. -vvv) to be more verbose.'
    }),
    flag('jsonErrors', ['--json-errors'], {
      desc: 'Writes errors to standard err in JSON, instead of text format.'
    }),
    flag('version', ['--version'], {
      desc: "Only writes Kelpie's version number to standard out and exits."
    })
  ], {desc})
}

module.exports = {
  klp
}