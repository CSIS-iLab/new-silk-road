import React, { Component } from 'react';

export default class InfrastructureIcon extends Component {

  constructor(props) {
    super(props);
    this.label = props.properties.label;
    this.value = props.properties.value;
    this.state = {selected: ''}
  }

  getAltText() {
    return 'Image representing visual display of a ' + this.label.toLowerCase() + ' on a map';
  }

  getSpanColorClass() {
    return this.label.replace(/ /g, '').toLowerCase() + '-color';
  }

  getSpanIconClass() {
    return this.label.replace(/ /g, '').toLowerCase() + '_white'
  }

  handleClick(){
    /* Return the element's id value. */
    this.props.returnIdOnClick(this.value);
    let sel = this.state.selected === '' ? 'selected' : '';
    this.setState({ selected: sel });
  }

  render() {
    return (
      <div className="infrastructureIconContainer" onClick={this.handleClick.bind(this)}>
        <span className={`${this.getSpanColorClass()} ${this.state.selected}`} >
          <span width={40} height={40} className={`${this.getSpanIconClass()}`} alt={this.getAltText()}></span>
        </span>
        <div className="infrastructureIconLabel">{this.label}</div>
      </div>
    )
  }
}
