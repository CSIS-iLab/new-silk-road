import React, { Component, PropTypes } from "react";
import Section from "./Section";
import SearchBar from "./SearchBar";
import CountrySelectContainer from "./CountrySelectContainer";
import RegionSelectContainer from "./RegionSelectContainer";
import StatusSelectContainer from "./StatusSelectContainer";
import InfrastructureTypeSelectContainer from "./InfrastructureTypeSelectContainer";
import {Select} from "./forms";
import Radium, { Style } from "radium";
import xhr from "xhr";
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
  constructor(props) {
    super(props);
    xhr({
      uri: '/api/regions/',
      headers: {
        "Accept": "application/json"
      }
    }, function (err, resp, body) {
      if (resp.statusCode == 200) {
        // console.log(JSON.parse(body));
      }
    });
  }
  state = {
    query: {},
    results: [],
    errorMessage: null
  }

  componentDidMount() {
    SearchStore.listen(this.onSearchResults);
  }

  handleQueryUpdate = (inputName, value) => {
    console.log("handleQueryUpdate");
    console.log(`${inputName}: ${value}`);
    var queryUpdate = Object.assign({}, this.state.query);
    queryUpdate[inputName] = value;
    this.setState({query: queryUpdate});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // TODO: prevent search when query is emptyish
    console.log(this.state.query);
    SearchActions.search(this.state.query);
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
              label="Project" name="name"
              value={this.state.projectTitle}
              onSearchInput={this.handleQueryUpdate}
            />
          }>
          <div className="section-row">
            <InfrastructureTypeSelectContainer onSelect={this.handleQueryUpdate} />
          </div>
          <div className="section-row">
            <StatusSelectContainer onSelect={this.handleQueryUpdate} />
          </div>
            <Section header={
              <SearchBar label="Initiative" name="initiative__name"
                onSearchInput={this.handleQueryUpdate}
               />
            }>
            <Select name="principal_agent__name" value="">
              <option value="">Principal Agent</option>
              </Select>
              <RegionSelectContainer onSelect={this.handleQueryUpdate} />
            </Section>
            <Section header={
              <SearchBar label="Funder" name="funding__sources__name"
                onSearchInput={this.handleQueryUpdate}
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
