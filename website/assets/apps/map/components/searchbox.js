import React, { Component, PropTypes } from "react";
import Section from "./section";
import SearchBar from "./searchbar";
import {Select} from "./forms";
import Radium, { Style } from "radium";


let searchBoxStyle = {
  maxWidth: 360,
  // position: 'absolute',
  // left: 10,

  '.section-row': {
    display: 'block',
    clear: 'both',
    marginBottom: 4
  },
  footer: {
    marginTop: 2
  },
  button: {
    backgroundColor: '#eee'
  }
}

class InitiativeFilter extends Component {
  render() {
    var hed = <SearchBar label="Initiative" name="initiative__name" />;

    return (
      <Section header={hed}>
        <Select name="principal_agent__name" defaultValue="">
          <option value="">Principal Agent</option>
        </Select>
        <Select name="region__name" defaultValue="">
          <option value="">Region</option>
        </Select>
      </Section>
    );
  }
}


class FunderFilter extends Component {
  render() {
    var hed = <SearchBar label="Funder" name="projectfunding__sources__name" />;

    return (
      <Section header={hed}>
      <div className="section-row">
        <label>
        <span>Amount</span>
        <Select name="compare" defaultValue="">
        <option value="">----</option>
        </Select>
        <Select name="amount" defaultValue="">
        <option value="">----</option>
        <option value="100000">100,000</option>
        </Select>
        </label>
      </div>
      <div className="section-row">
        <Select name="projectfunding__sources__countries__name" defaultValue="">
        <option value="">Country</option>
        </Select>
      </div>
      </Section>
    );
  }
}


class ProjectFilter extends Component {
  static propTypes = {
    fields: PropTypes.arrayOf(PropTypes.element)
  };

  render() {
    var hed = <SearchBar label="Project" name="name" />;

    return (
      <Section header={hed}>
        <Select name="infrastructure_type__name" defaultValue="">
          <option value="">Infrastructure Type</option>
          <option value="road">Road</option>
          <option value="rail">Rail</option>
          <option value="seaport">Seaport</option>
        </Select>
        <Select name="status__name" defaultValue="">
          <option value="">Status</option>
          <option value="started">Started</option>
          <option value="completed">Completed</option>
        </Select>
        <InitiativeFilter />
        <FunderFilter />
      </Section>
    );
  }
}

export default class SearchBox extends Component {

  render() {

    return (
      <div className="searchbox">
        <Style
          scopeSelector=".searchbox"
          rules={searchBoxStyle}
        />
        <ProjectFilter />
      </div>
    );
  }
}
