import React, { Component, PropTypes } from "react";
import Section from "./section";
import SearchBar from "./searchbar";


class InitiativeFilter extends Component {
  render() {
    var hed = <SearchBar placeholder="Initiative Title" name="initiative__name" />;

    return (
      <Section header={hed}>
        <select name="principal_agent__name" defaultValue="">
          <option value="">Principal Agent</option>
        </select>
        <select name="region__name" defaultValue="">
          <option value="">Region</option>
        </select>
      </Section>
    );
  }
}


class FunderFilter extends Component {
  render() {
    var hed = <SearchBar placeholder="Funder" name="projectfunding__sources__name" />;

    return (
      <Section header={hed}>
      {/*Amount, Country*/}
        <select name="principal_agent__name" defaultValue="">
          <option value="">Principal Agent</option>
        </select>
        <select name="projectfunding__sources__countries__name" defaultValue="">
          <option value="">Country</option>
        </select>
      </Section>
    );
  }
}


class ProjectFilter extends Component {
  static propTypes = {
    fields: PropTypes.arrayOf(PropTypes.element)
  };

  render() {
    var hed = <SearchBar placeholder="Project" name="name" />;

    return (
      <Section header={hed}>
        <select defaultValue="">
          <option value="">Infrastructure Type</option>
          <option value="road">Road</option>
          <option value="rail">Rail</option>
          <option value="seaport">Seaport</option>
        </select>
        <select defaultValue="">
          <option value="">Status</option>
          <option value="started">Started</option>
          <option value="completed">Completed</option>
        </select>
        <InitiativeFilter />
        <FunderFilter />
      </Section>
    );
  }
}

export default class SearchBox extends Component {

  render() {

    return (
      <div className="searchbox" style={{maxWidth: 360}}>
        <ProjectFilter />
      </div>
    );
  }
}
