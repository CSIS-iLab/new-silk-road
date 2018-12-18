import React, { Component } from 'react';
import classNames from 'classnames';

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
      <div
        className={`infrastructureIcon__container ${this.state.selected}`}
        onClick={this.handleClick.bind(this)}
      >
        <div
          className={classNames(
            this.getSpanColorClass(),
            this.state.selected,
            'infrastructureIcon__icon',
          )}
        >
          <span
            width={40}
            height={40}
            className={classNames(
              this.getSpanIconClass(),
              'infrastructureIcon__inner-icon'
            )}
            alt={this.getAltText()}
            onMouseEnter={this.props.unHide}
          />
        </div>
        <div
          className={classNames(
            'infrastructureIcon__label',
            { hidden: this.props.hidden },
          )}
        >{this.label}</div>
      </div>
    )
  }
}
