module.exports = {
  name: 'id',
  desc: 'Does not deserialize tokens, but returns them unchanged.',
  opts: [],
  func: ({}) => (chunks, lines) => ({err: [], jsons: chunks})
}