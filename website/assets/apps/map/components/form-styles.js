const formStyles = {
  cursor: 'pointer',
}

const inputStyle = {
  base: Object.assign({}, formStyles, {
    border: 'none'
  })
};

const buttonStyle = {
  base: Object.assign({
    border: 'none'
  }, formStyles),
  disabled: {
    cursor: 'default',
    border: '1px solid transparent'
  }
};

const selectStyle = {
  base: Object.assign({}, formStyles)
};

export {inputStyle, buttonStyle, selectStyle};
