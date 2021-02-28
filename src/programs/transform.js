const transform = ({chunker, deserializer, applier, serializer, failEarly}) => {
  const {func: chunkerFunc, ...chunkerArgs} = Object.values(chunker.list[0])[0]
  const chunk = chunkerFunc(chunkerArgs)

  const {func: deserializerFunc, ...deserializerArgs} = Object.values(deserializer.list[0])[0]
  const deserialize = deserializerFunc(deserializerArgs)

  const apply = (jsons, lines) => {
    let err = []
  
    for (const app of applier.list) {
      const {func: applierFunc, ...applierArgs} = Object.values(app)[0]
      const {err: err2, jsons: jsons2} = applierFunc(applierArgs)(jsons, lines)

      err = [...err, ...err2]
      jsons = jsons2
    }

    return {err, jsons}
  }

  const {func: serializerFunc, ...serializerArgs} = Object.values(serializer.list[0])[0]
  const serialize = serializerFunc(serializerArgs)

  const fs = {chunk, deserialize, apply, serialize}
  const processor = pxi(fs)
  const run = runner(failEarly)

  run(processor)
}

module.exports = {
  transform
}

function pxi ({chunk, deserialize, apply, serialize}) {
  let buffer      = ''
  let linesOffset = 0

  return (data, noMoreData) => {
    const {err: cErr, chunks, lines, lastLine, rest} = chunk(buffer + data, linesOffset, noMoreData)
    const {err: dErr, jsons}                         = deserialize(chunks, lines)
    const {err: aErr, jsons: jsons2}                 = apply(jsons, lines)
    const {err: sErr, str}                           = serialize(jsons2)

    const err = cErr.concat(dErr).concat(aErr).concat(sErr)

    buffer      = rest
    linesOffset = lastLine

    return {err, str}
  }
}

function runner (failEarly) {
  const handle = handler(failEarly)

  return pxi => {
    process.stdin.setEncoding('utf8')

    process.stdout.on('error', () => process.exit(1))
    process.stderr.on('error', () => process.exit(1))

    process.stdin
    .on('data', data => {
      const {str} = handle(pxi(data, false))
      process.stdout.write(str)
    })
    .on('end',   () => {
      const {str} = handle(pxi('', true))
      process.stdout.write(str)
      process.exit(0)
    })
    .on('error', () => process.exit(1))
  }
}

function handler (failEarly) {
  return obj => {
    const err = obj.err || []
    if (err.length > 0) {
      const msgs = err.map(({msg, line, info}) =>
        (typeof line !== 'undefined' ? '(Line ' + line + ') ' : '') +
        msg + 
        (typeof info !== 'undefined' ? ', in ' + info : '') +
        '\n'
      )
      process.stderr.write(msgs.join(''))
      if (failEarly) process.exit(1)
    }
    return obj
  }
}