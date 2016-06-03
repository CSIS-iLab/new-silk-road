import React, { Component, PropTypes } from "react";
import Section from "./Section";
import SearchBar from "./SearchBar";
import CountrySelectContainer from "./CountrySelectContainer";
import RegionSelectContainer from "./RegionSelectContainer";
import StatusSelectContainer from "./StatusSelectContainer";
import InfrastructureTypeSelectContainer from "./InfrastructureTypeSelectContainer";
import PrincipalAgentSelectContainer from './PrincipalAgentSelectContainer'
import {Select} from "./forms";
import Radium, { Style } from "radium";
import SearchActions from '../actions/SearchActions';
import SearchStore from '../stores/SearchStore';

let searchBoxStyle = {
  maxWidth: 360,
  form: {
    margin: '0 3px'
  },
  '.section-row': {
    display: 'block',
    clear: 'both',
    marginBottom: 4
  },
  'section > footer > button': {
    display: 'block',
    fontSize: 12,
    width: '100%'
  },
  footer: {
    marginTop: 2
  },
  button: {
    backgroundColor: '#eee'
  },
  label: {
    display: 'inline-block',
    width: 80,
    marginRight: 3,
    textAlign: 'right'
  },
  input: {
    maxWidth: 204,
    marginRight: 2
  },
  select: {
    marginRight: 6
  },
  'label, input, button': {
    display: 'inline-block'
  }
}

export default class SearchBox extends Component {
  state = {
    query: {},
    results: [],
    errorMessage: null,
    searchEnabled: false
  }

  componentDidMount() {
    SearchStore.listen(this.onSearchResults);
  }

  handleQueryUpdate = (inputName, value) => {
    let queryUpdate = Object.assign({}, this.state.query);
    let trimValue = value.trim();
    if (trimValue !== '') {
      queryUpdate[inputName] = trimValue;
    } else {
      delete queryUpdate[inputName];
    }
    let enableSearch = Object.keys(queryUpdate).length > 0;
    this.setState({query: queryUpdate, searchEnabled: enableSearch});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(this.state.query).length > 0) {
      SearchActions.search(this.state.query);
    }
  }

  onSearchResults = (data) => {
    var { results, errorMessage } = data;
    this.setState({results: results, errorMessage: errorMessage});
  }

  render() {
    return (
      <div className="searchbox">
        <Style
          scopeSelector=".searchbox"
          rules={searchBoxStyle}
        />
        <form onSubmit={this.handleSubmit}>
          <Section header={
            <SearchBar
              label="Project" name="name__icontains"
              value={this.state.projectTitle}
              onSearchInput={this.handleQueryUpdate}
              searchEnabled={this.state.searchEnabled}
            />
          }>
          <div className="section-row">
            <InfrastructureTypeSelectContainer onSelect={this.handleQueryUpdate} />
          </div>
          <div className="section-row">
            <StatusSelectContainer onSelect={this.handleQueryUpdate} />
          </div>
            <Section header={
              <SearchBar label="Initiative" name="initiatives__name__icontains"
                onSearchInput={this.handleQueryUpdate}
                searchEnabled={this.state.searchEnabled}
               />
            }>
              <PrincipalAgentSelectContainer onSelect={this.handleQueryUpdate} />
              <RegionSelectContainer onSelect={this.handleQueryUpdate} />
            </Section>
            <Section header={
              <SearchBar label="Funder" name="funding__sources__name__icontains"
                onSearchInput={this.handleQueryUpdate}
                searchEnabled={this.state.searchEnabled}
              />
            }>
              <div className="section-row">
                <label for="amount">Amount:</label>
                <Select name="compare" value="">
                  <option value="">----</option>
                </Select>
                <Select name="amount" value="">
                  <option value="">----</option>
                  <option value="100000">100,000</option>
                </Select>
              </div>
              <div className="section-row">
                <CountrySelectContainer onSelect={this.handleQueryUpdate} />
              </div>
            </Section>
          </Section>
        </form>
      </div>
    );
  }
}
