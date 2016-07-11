import React, { Component, PropTypes } from "react";


class Input extends Component {
  static defaultProps = {
    type: 'text',
    inputText: '',
    size: 10
  }
  static propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    size: PropTypes.number,
    inputText: PropTypes.string,
    onUserInput: PropTypes.func
  };

  handleUserInput = (e) => {
    const {onUserInput} = this.props;
    if (onUserInput) {
      onUserInput(this.refs.inputEl.value, e);
    }
  }

  render() {
    const {inputText, onUserInput, ...inputProps} = this.props;
    return (
      <input  {...inputProps}
              ref="inputEl"
              value={this.props.inputText}
              onChange={this.handleUserInput.bind(this)}
               />
    )
  }
}

class Button extends Component {
  static defaultProps = {
    type: 'button',
    enabled: true,
    value: null
  }
  static propTypes = {
    type: PropTypes.oneOf(['submit', 'reset', 'button']),
    onClick: PropTypes.func,
    enabled: PropTypes.bool,
    value: PropTypes.string
  };

  render() {
    const {enabled, ...buttonProps} = this.props;
    return (
      <button {...buttonProps}
              disabled={!this.props.enabled}
              onClick={this.props.onClick}
               >{this.props.children}</button>
    )
  }
}


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
      enabled,
      ...selectProps
    } = this.props;

    return (
      <select {...selectProps}
        ref="selectEl"
        value={this.state.value}
        onChange={this.handleChange}
        disabled={!this.props.enabled}
      >
      {this.props.children}
      </select>
    );
  }
}

export { Input, Button, Select };
