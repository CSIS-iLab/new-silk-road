import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class InfrastructureIcon extends Component {
  constructor(props) {
    super(props);
    this.label = props.properties.label;
    this.value = props.properties.value;
    this.state = { selected: false };

    this.handleClick = this.handleClick.bind(this);
  }

  get altText() {
    return `Image representing visual display of a ${this.label.toLowerCase()} on a map`;
  }

  get cssLabel() {
    return this.label.replace(/ /g, '').toLowerCase();
  }

  get colorClass() {
    return `${this.cssLabel}-color`;
  }

  get iconClass() {
    return `${this.cssLabel}_white`;
  }

  handleClick(){
    /* Return the element's id value. */
    this.props.returnIdOnClick(this.value);
    this.setState(oldState => ({ selected: !oldState.selected }));
  }

  render() {
    return (
      <div
        className={classNames(
          'infrastructureIcon__container',
          { selected: this.state.selected },
        )}
        onClick={this.handleClick}
      >
        <div
          className={classNames(
            this.colorClass,
            { selected: this.state.selected },
            'infrastructureIcon__icon',
          )}
        >
          <span
            width={40}
            height={40}
            className={classNames(
              this.iconClass,
              'infrastructureIcon__inner-icon',
            )}
            alt={this.altText}
          />
        </div>
        <div
          className={classNames(
            'infrastructureIcon__label',
            { 'infrastructureIcon__label--hidden': this.props.hidden },
            { 'infrastructureIcon__label--selected': this.state.selected },
          )}
        >{this.label}</div>
      </div>
    );
  }
}

InfrastructureIcon.propTypes = {
  hidden: PropTypes.bool,
  properties: PropTypes.shape({}),
  returnIdOnClick: PropTypes.func,
};

InfrastructureIcon.defaultProps = {
  hidden: true,
};
