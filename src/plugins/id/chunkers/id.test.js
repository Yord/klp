const {anything, assert, constant, property} = require('fast-check')
const {func: chunker} = require('./id')

test('passes on data as one big chunk, ignoring lines completely', () => {
  const err       = []
  const argv      = anything().chain(verbose => constant({verbose}))
  const data      = anything()
  const prevLines = anything()

  assert(
    property(data, prevLines, (data, prevLines) =>
      expect(
        chunker(argv)(data, prevLines)
      ).toStrictEqual(
        {err, chunks: [data], lines: [], lastLine: prevLines, rest: ''}
      )
    )
  )
})