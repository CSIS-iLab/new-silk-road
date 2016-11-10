function parameterizeQuery(query) {
  const params = Object.keys(query).map((key) => {
    const value = query[key];
    if (value) {
      if (Array.isArray(value)) {
        return value.map(x => `${key}=${x}`).join('&');
      }
      return [key, value].join('=');
    }
    return null;
  });
  return params.filter(value => value !== null).join('&');
}

export default parameterizeQuery;
