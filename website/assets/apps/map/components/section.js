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

  render() {
    let toggleButtonText = this.state.expanded ? 'Collapse' : 'Expand';
    let styles = {
      base: {
        padding: '0 0 2px'
      },
      body: {
        display: this.state.expanded ? 'block' : 'none'
      }
    }
    return (
      <section className="expandable" style={styles.base}>
        <header>
        {this.props.header || ""}
        </header>
        <div class="sectionBody" style={styles.body}>
        {this.props.children}
        </div>
        <footer>
          <Button onClick={this.handleToggle}>{toggleButtonText}</Button>
        </footer>
      </section>
    );

  }
}

module.exports = Radium(Section);
