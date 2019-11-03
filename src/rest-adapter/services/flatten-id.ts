import _ from 'lodash';

export function flattenId(object: any) {
  const flattenedAsArray = _.map(object, (value, key) => {
    if (!_.keys(value).includes('id')) {
      return { key, value };
    }
    const newKey = `${key}_id`;
    return { key: newKey, value: value.id };
  });

  return _.mapValues(_.keyBy(flattenedAsArray, 'key'), 'value');
}
