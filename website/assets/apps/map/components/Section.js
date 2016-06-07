import React, { Component, PropTypes } from "react";
import Radium from "radium";
import { Button } from "./forms";

class Section extends Component {
  static propTypes = {
    header: PropTypes.element
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
      base: {
        padding: '0 0 2px'
      },
      sectionBody: {
        base: {
          margin: '4px 0',
          display: 'block',
          overflow: 'hidden',
          transition: 'max-height 0.25s ease-in',
          maxHeight: 0
        },
        expanded: {
          maxHeight: '500px'
        },
        collapsed: {
          maxHeight: 0
        }
      }
    }
    return (
      <section className="expandable" style={styles.base}>
        <header>
        {this.props.header || ""}
        </header>
        <div class="sectionBody" style={[
          styles.sectionBody.base,
          styles.sectionBody[this.state.expanded ? 'expanded': 'collapsed']
        ]}>
        {this.props.children}
        </div>
        <footer>
          <Button onClick={this.handleToggle}>{toggleButtonText}</Button>
        </footer>
      </section>
    );

  }
}
Section = Radium(Section);

export default Section;
