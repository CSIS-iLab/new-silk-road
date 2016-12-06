const createOptionMapper = (labelProp, valueProp) =>
  data => data.map((obj) => {
    const objHasNameAndId = {}.hasOwnProperty.call(obj, labelProp) &&
                            {}.hasOwnProperty.call(obj, valueProp);
    if (objHasNameAndId) {
      return Object.create({ label: obj[labelProp], value: obj[valueProp] });
    }
    return null;
  }).filter(value => value !== null);

const nameIdMapper = createOptionMapper('name', 'id');

const nameSlugMapper = createOptionMapper('name', 'slug');

const generateRangeQuery = (lookupName, lowerValue = null, upperValue = null) => {
  if (!lookupName) return {};
  return {
    [`${lookupName}__gte`]: (lowerValue && lowerValue !== '') ? `${lowerValue}` : null,
    [`${lookupName}__lte`]: (upperValue && upperValue !== '') ? `${upperValue}` : null,
  };
};

const hasSearchableValue = queryObj =>
  Object.values(queryObj).some((value) => {
    if (Array.isArray(value)) {
      return value.length !== 0;
    }
    if (typeof value === 'string' || value instanceof String) {
      return value.trim() !== '';
    }
    if (typeof value === 'number') {
      return true;
    }
    return Object.values(value).some((x) => {
      if (typeof value === 'string' || value instanceof String) {
        return x.trim() !== '';
      }
      return x !== null;
    });
  });


export {
  nameIdMapper,
  nameSlugMapper,
  generateRangeQuery,
  hasSearchableValue,
};
