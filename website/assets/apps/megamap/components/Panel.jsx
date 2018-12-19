import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

class Panel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  render() {
    const styles = {
      expandable_panel__body: {
        base: {
          display: 'block',
        },
        expanded: {
          display: 'block',
        },
        collapsed: {
          display: 'none',
        },
      },
    };
    return (
      <section className="expandable-panel">
        <h2 className="expandable-panel__title">{this.props.title}</h2>
        <div
          className="expandable-panel__body"
          style={[
            styles.expandable_panel__body.base,
          ]}
        >
          {this.props.children}
        </div>
      </section>
    );
  }
}

Panel.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};


export default Radium(Panel);
