import React, { PropTypes } from 'react';

const ErrorView = props => (<div className="errorView"><p>{props.errorMessage}</p></div>);

ErrorView.propTypes = {
  errorMessage: PropTypes.string,
};

export default ErrorView;
