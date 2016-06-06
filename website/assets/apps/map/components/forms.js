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
    type: PropTypes.string,
    inputText: PropTypes.string,
    onUserInput: PropTypes.func
  };

  state = {
    value: ''
  }

  handleUserInput = (e) => {
    this.props.onUserInput(this.refs.inputEl.value, e);
  }

  render() {
    return (
      <input  {...this.props}
              ref="inputEl"
              style={inputStyle.base}
              value={this.props.inputText}
              onChange={this.handleUserInput}
               />
    )
  }
}
Input = Radium(Input);

class Button extends Component {
  static defaultProps = {
    type: 'button',
    bordered: false,
    enabled: true
  }
  static propTypes = {
    type: PropTypes.oneOf(['submit', 'reset', 'button']),
    onClick: PropTypes.func,
    bordered: PropTypes.bool,
    enabled: PropTypes.bool,
    value: PropTypes.string
  };

  render() {
    return (
      <button type={this.props.type}
              disabled={!this.props.enabled}
              style={[
                buttonStyle.base,
                this.props.bordered && buttonStyle.bordered,
                !this.props.enabled && buttonStyle.disabled
              ]}
              value={this.props.value}
              onClick={this.props.onClick}
               >{this.props.children}</button>
    )
  }
}
Button = Radium(Button);


class Select extends Component {
  static propTypes = {
    enabled: PropTypes.bool,
    onSelect: PropTypes.func
  };
    state = {
      value: '',
      enabled: true
    }

    handleChange = (event) => {
      this.setState({value: event.target.value});
      if (this.props.onSelect) {
        this.props.onSelect(this.refs.selectEl.value, event);
      }
    }

  render() {
    var {
      value,
      ...other
    } = this.props;

    return (
      <select {...other}
        ref="selectEl"
        value={this.state.value}
        onChange={this.handleChange}
        style={selectStyle.base}
        disabled={!this.props.enabled}
      >
      {this.props.children}
      </select>
    );
  }
}

export { Input, Button, Select };
