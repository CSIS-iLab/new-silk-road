import React, { Component, PropTypes } from "react";
import Radium from "radium";

class Input extends Component {
  static defaultProps = {
    type: 'text'
  }
  static propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'search', 'submit'])
  };

  state = {
    value: ''
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
  }

  render() {
    let styles = {
      base: {
        borderTop: 'none',
        borderRight: 'none',
        borderBottom: '1px solid #af0623',
        borderLeft: 'none'
      }
    }
    return (
      <input type={this.props.type}
              name={this.props.name}
              placeholder={this.props.placeholder}
              style={styles.base}
              value={this.state.value}
              onChange={this.handleChange}
               />
    )
  }
}
Input = Radium(Input)

class Button extends Component {
  static defaultProps = {
    type: 'button'
  }
  static propTypes = {
    type: PropTypes.oneOf(['submit', 'reset', 'button'])
  };

  render() {
    let styles = {
      base: {
        border: 0,
        padding: '2px',
        backgroundColor: 'transparent',
        ':hover': {
          cursor: 'pointer'
        },
      },
    }
    return (
      <button type={this.props.type}
              style={styles.base}
              onClick={this.props.onClick}
               >{this.props.children}</button>
    )
  }
}
Button = Radium(Button)


export { Input, Button };
