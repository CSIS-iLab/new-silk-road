import React, { Component, PropTypes } from "react";
import Radium from "radium";
import { Button } from "./forms";

class Panel extends Component {
  static propTypes = {
    title: PropTypes.string,
  }

  state = {
    expanded: false
  }


  handleToggle = (e) => {
    this.setState({expanded: !this.state.expanded});
  }

  collapse = () => {
    this.setState({expanded: false});
  }

  expand = () => {
    this.setState({expanded: True});
  }

  render() {
    let toggleButtonText = this.state.expanded ? 'Collapse' : 'Expand';
    let styles = {
      sectionBody: {
        base: {
          display: 'block',
        },
        expanded: {
          display: 'block',
        },
        collapsed: {
          display: 'none',
        }
      }
    }
    let buttonClass = `toggle ${this.state.expanded ? 'expanded' : 'collapsed'}`;
    return (
      <section className="expandable">
        <header>
        <h4>{this.props.title}</h4>
        <Button className={buttonClass} onClick={this.handleToggle}>{toggleButtonText}</Button>
        </header>
        <div className="sectionBody" style={[
          styles.sectionBody.base,
          styles.sectionBody[this.state.expanded ? 'expanded': 'collapsed']
        ]}>
        {this.props.children}
        </div>
      </section>
    );

  }
}
Panel = Radium(Panel);

export default Panel;
