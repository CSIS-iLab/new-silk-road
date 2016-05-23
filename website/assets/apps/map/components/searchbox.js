import React, { Component, PropTypes } from "react";

import belle from "belle";
const { TextInput, Button } = belle;

// belle.style.textInput.style = {
//   color: '#FFF',
//   background: '#5FB1CF',
// };

class ExpandableSection extends Component {
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
    return (
      <section className="expandable">
        <header>
        {this.props.header || ""}
        </header>
        <div class="sectionBody">
        {this.props.children}
        </div>
        <footer>
          <Button onClick={this.handleToggle}>{toggleButtonText}</Button>
        </footer>
      </section>
    );
  }
}

class ProjectFilter extends Component {
  static propTypes = {
    fields: PropTypes.arrayOf(PropTypes.element)
  };

  render() {
    var hed =
    <div>
      <TextInput placeholder="Project Title" maxRows={2} />
      <Button primary type='submit'>Search</Button>
    </div>;

    return (
      <ExpandableSection header={hed}>
        <p>Hi</p>
      </ExpandableSection>
    );
  }
}

export default class SearchBox extends Component {

  render() {

    return (
      <div className="searchbox">
        <ProjectFilter />
      </div>
    );
  }
}
