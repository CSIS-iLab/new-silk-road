import React, { Component, PropTypes } from "react";
import Section from "./section";
import SearchBar from "./searchbar";
import {Select} from "./forms";


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
      {/*Amount, Country*/}
        <Select name="principal_agent__name" defaultValue="">
          <option value="">Principal Agent</option>
        </Select>
        <Select name="projectfunding__sources__countries__name" defaultValue="">
          <option value="">Country</option>
        </Select>
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
      <div className="searchbox" style={{maxWidth: 360}}>
        <ProjectFilter />
      </div>
    );
  }
}
