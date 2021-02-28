module.exports = {
  name: 'id',
  desc: 'Passes the AST on without modifying it.',
  opts: [],
  func: ({}) => (jsons, lines) => (
    {err: [], jsons}
  )
}