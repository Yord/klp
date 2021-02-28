module.exports = {
  name: 'id',
  desc: 'Interprets each standard input chunk as a token.',
  opts: [],
  func: ({}) => (data, prevLines) => (
    {err: [], chunks: [data], lines: [], lastLine: prevLines, rest: ''}
  )
}