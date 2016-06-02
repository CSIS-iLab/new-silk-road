const formStyles = {
  cursor: 'pointer',
  padding: 2,
  borderRadius: 0,
}

const bordered = {
  border: '1px solid #556377'
}

const inputStyle = {
  base: Object.assign({}, formStyles, {
    borderTop: 'none',
    borderLeft: 'none',
    borderBottom: '1px solid #af0623',
    borderRight: 'none',
  })
};

const buttonStyle = {
  base: Object.assign({
    border: 'none'
  }, formStyles),
  bordered: Object.assign({}, bordered),
  disabled: {
    cursor: 'default',
    border: '1px solid transparent'
  }
};

const selectStyle = {
  base: Object.assign({}, formStyles, bordered)
};

export {inputStyle, buttonStyle, selectStyle};
