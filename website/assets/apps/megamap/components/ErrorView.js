import React, { Component, PropTypes } from "react";

export default class ErrorView extends Component {
  static propTypes = {
    errorMessage: PropTypes.string
  }

  render() {
    return (
      <div className="errorView">
        <p>{this.props.errorMessage}</p>
      </div>
    );
  }
}
