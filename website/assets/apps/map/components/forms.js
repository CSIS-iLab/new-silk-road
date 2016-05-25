import React, { Component, PropTypes } from "react";
import Radium, { Style } from "radium";
import {inputStyle, buttonStyle, selectStyle} from "./form-styles";


class Input extends Component {
  static defaultProps = {
    type: 'text'
  }
  static propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    type: PropTypes.string
  };

  state = {
    value: ''
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      <input  {...this.props}
              style={inputStyle.base}
              value={this.state.value}
              onChange={this.handleChange}
               />
    )
  }
}
Input = Radium(Input);

class Button extends Component {
  static defaultProps = {
    type: 'button'
  }
  static propTypes = {
    type: PropTypes.oneOf(['submit', 'reset', 'button'])
  };

  render() {
    return (
      <button type={this.props.type}
              style={buttonStyle.base}
              onClick={this.props.onClick}
               >{this.props.children}</button>
    )
  }
}
Button = Radium(Button);


class Select extends Component {
  render() {
    return (
      <select {...this.props}
      style={selectStyle.base}
      >
      {this.props.children}
      </select>
    );
  }
}

export { Input, Button, Select };
