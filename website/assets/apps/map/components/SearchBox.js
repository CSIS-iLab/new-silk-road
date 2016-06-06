import React, { Component, PropTypes } from "react";
import Section from "./Section";
import SearchBar from "./SearchBar";
import CountrySelectContainer from "./CountrySelectContainer";
import RegionSelectContainer from "./RegionSelectContainer";
import StatusSelectContainer from "./StatusSelectContainer";
import InfrastructureTypeSelectContainer from "./InfrastructureTypeSelectContainer";
import PrincipalAgentSelectContainer from './PrincipalAgentSelectContainer';
import CurrencyAmountSelectContainer from './CurrencyAmountSelectContainer';
import ResultsBox from './ResultsBox';
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
  },
  'ul.search-results': {
    listStyle: 'none',
    padding: '0 3px',
  },
  // '.searchResults': {
    // fontSize: 12
  // }
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

  handleQueryUpdate = (q) => {
    let queryUpdate = Object.assign({}, this.state.query);
    for (var key in q) {
      if (q.hasOwnProperty(key)) {
        let value = q[key];
        if (typeof value === "string") {
          value = value.trim();
        }
        if (value && value !== '') {
          queryUpdate[key] = value;
        } else {
          delete queryUpdate[key];
        }
      }
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
                <CurrencyAmountSelectContainer onSelect={this.handleQueryUpdate} />
              </div>
              <div className="section-row">
                <CountrySelectContainer onSelect={this.handleQueryUpdate} />
              </div>
            </Section>
          </Section>
        </form>
        <ResultsBox results={this.state.results} />
      </div>
    );
  }
}
