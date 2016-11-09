import React, { Component, PropTypes } from 'react';

class OptionSelect extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    if (this.props.onSelect) {
      this.props.onSelect(event);
    }
  }

  render() {
    return (
      <div>
        <label htmlFor={this.props.name}>
          {this.props.labelName}:
        </label>
        <select
          onChange={this.handleChange}
          name={this.props.name}
          value={this.state.value}
          enabled={this.props.enabled}
        >
          <option value="">---------</option>
          {this.props.options.map((opt, i) => {
            const optKey = `${opt.name}-${i}`;
            return (
              <option key={optKey} value={opt.value}>{opt.name}</option>
            );
          })}
        </select>
      </div>
    );
  }
}

OptionSelect.propTypes = {
  name: PropTypes.string.isRequired,
  labelName: PropTypes.string.isRequired,
  onSelect: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.instanceOf(Option)),
  enabled: PropTypes.bool,
};

OptionSelect.defaultProps = {
  options: [],
  enabled: true,
};


export default OptionSelect;
