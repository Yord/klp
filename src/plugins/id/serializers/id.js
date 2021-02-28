module.exports = {
  name: 'id',
  desc: 'Applies toString and joins without newlines.',
  opts: [],
  func: ({verbose}) => jsons => {
    let str   = ''
    const err = []

    for (let index = 0; index < jsons.length; index++) {
      const obj = jsons[index]
      if (typeof obj !== 'undefined' && obj !== null) str += obj.toString()
    }

    return {err, str}
  }
}