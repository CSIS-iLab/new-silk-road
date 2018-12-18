import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class InfrastructureIcon extends Component {
  constructor(props) {
    super(props);
    this.label = props.properties.label;
    this.value = props.properties.value;
    this.state = { selected: '' };

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
    const sel = this.state.selected === '' ? 'selected' : '';
    this.setState({ selected: sel });
  }

  render() {
    return (
      <div
        className={`infrastructureIcon__container ${this.state.selected}`}
        onClick={this.handleClick}
      >
        <div
          className={classNames(
            this.colorClass,
            this.state.selected,
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
    );
  }
}

InfrastructureIcon.propTypes = {
  hidden: PropTypes.bool,
  properties: PropTypes.shape.isRequired,
  returnIdOnClick: PropTypes.func.isRequired,
  unHide: PropTypes.func.isRequired,
};

InfrastructureIcon.defaultProps = {
  hidden: true,
};
