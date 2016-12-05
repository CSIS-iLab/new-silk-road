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


export {
  nameIdMapper,
  nameSlugMapper,
  generateRangeQuery,
};
