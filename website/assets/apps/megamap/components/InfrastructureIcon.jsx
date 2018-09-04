import React, { Component } from 'react';

export default class InfrastructureIcon extends Component {

  constructor(props) {
    super(props);
    this.label = props.properties.label;
    this.value = props.properties.value;
    this.state = {selected: ''}
  }

  getIconSource() {
    /* Return the icon source URL for an icon label */
    if (this.label === 'Road') {
      return '/static/img/database-icons/Road_white.svg';
    } else if (this.label === 'Seaport') {
      return '/static/img/database-icons/Seaport_white.svg';
    } else if (this.label === 'Rail') {
      return '/static/img/database-icons/Rail_white.svg';
    } else if (this.label === 'Intermodal') {
      return '/static/img/database-icons/Dryport_white.svg';
    } else if (this.label === 'Power Plant') {
      return '/static/img/database-icons/Powerplant_white.svg';
    }
    return '';
  }

  getAltText() {
    return 'Image representing visual display of a ' + this.label.toLowerCase() + ' on a map';
  }

  getSpanColorClass() {
    return this.label.toLowerCase() + '-color';
  }

  handleClick(){
    /* Return the element's id value. */
    this.props.returnIdOnClick(this.value);
    let sel = this.state.selected === '' ? 'selected' : '';
    this.setState({ selected: sel });
  }

  render() {
    return (
      <span className={`${this.getSpanColorClass()} ${this.state.selected}`} onClick={this.handleClick.bind(this)} >
        <img width={40} height={40} src={this.getIconSource()} alt={this.getAltText()} />
      </span>
    )
  }
}
