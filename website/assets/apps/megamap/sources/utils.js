function parameterizeQuery(query) {
  const params = Object.keys(query).map((key) => {
    return query[key] ? [key, query[key]].join("=") : null;
  });
  return params.filter((value) => value !== null).join("&");
}

export {parameterizeQuery};
