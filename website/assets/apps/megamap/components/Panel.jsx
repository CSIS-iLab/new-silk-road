import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { Button } from './forms';

class Panel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };

    this.handleToggle = this.handleToggle.bind(this);
    this.collapse = this.collapse.bind(this);
    this.expand = this.expand.bind(this);
  }

  handleToggle() {
    this.setState({ expanded: !this.state.expanded });
  }

  collapse() {
    this.setState({ expanded: false });
  }

  expand() {
    this.setState({ expanded: true });
  }

  render() {
    const toggleButtonText = this.state.expanded ? 'Collapse' : 'Expand';
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
    const buttonClass = `toggle ${this.state.expanded ? 'expanded' : 'collapsed'}`;
    return (
      <section className="expandable">
        <a onClick={this.handleToggle} tabIndex="0">
          <header>
            <h4>{this.props.title}</h4>
            <Button className={buttonClass}>{toggleButtonText}</Button>
          </header>
        </a>
        <div
          className="sectionBody"
          style={[
            styles.sectionBody.base,
            styles.sectionBody[this.state.expanded ? 'expanded' : 'collapsed'],
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
