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
      sectionBody: {
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
      <section className="expandable">
        <h4>{this.props.title}</h4>
        <div
          className="sectionBody"
          style={[
            styles.sectionBody.base,
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
