const mergeField = (field, obj1, obj2) => ({
  [field]: {
    _: [
      ...((obj1[field] || {})._ || []),
      ...((obj2[field] || {})._ || [])
    ],
    ...(obj1[field] || {}),
    ...(obj2[field] && typeof obj2[field]._ === 'undefined' ? {} : obj2[field]),
    list: [
      ...((obj1[field] || {}).list || []),
      ...(obj2[field] && typeof obj2[field]._ === 'undefined' ? [obj2[field]] : []),
    ]
  },
})

const mergeArgs = (obj1, obj2) => ({
  ...obj1,
  ...mergeField('chunker', obj1, obj2),
  ...mergeField('deserializer', obj1, obj2),
  ...mergeField('applier', obj1, obj2),
  ...mergeField('serializer', obj1, obj2)
})

const fromArgs = ({errs, args}) => ({
  errs,
  args: args.slice(1).reduce(mergeArgs, args[0])
})

module.exports = fromArgs