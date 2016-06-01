import React, { Component, PropTypes } from "react";
import Section from "./section";
import SearchBar from "./searchbar";
import CountrySelectContainer from "./CountrySelectContainer";
import {Select} from "./forms";
import Radium, { Style } from "radium";
import xhr from "xhr";

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
        console.log(JSON.parse(body));
      }
    });
  }
  state = {
    name: '',
    initiative__name: '',
    projectfunding__sources__countries__name: ''
  }

  handleValueUpdate = (inputName, value) => {
    var stateUpdate = {};
    stateUpdate[inputName] = value;
    this.setState(stateUpdate);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
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
              onSearchInput={this.handleValueUpdate}
            />
          }>
          <div className="section-row">
            <Select name="infrastructure_type__name" value="">
            <option value="">Infrastructure Type</option>
            <option value="road">Road</option>
            <option value="rail">Rail</option>
            <option value="seaport">Seaport</option>
            </Select>
            <Select name="status__name" value="">
            <option value="">Status</option>
            <option value="started">Started</option>
            <option value="completed">Completed</option>
            </Select>
          </div>
            <Section header={
              <SearchBar label="Initiative" name="initiative__name"
                onSearchInput={this.handleValueUpdate}
               />
            }>
              <Select name="principal_agent__name" value="">
                <option value="">Principal Agent</option>
              </Select>
              <Select name="region__name" value="">
                <option value="">Region</option>
              </Select>
            </Section>
            <Section header={
              <SearchBar label="Funder" name="projectfunding__sources__name"
                onSearchInput={this.handleValueUpdate}
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
                <CountrySelectContainer onSelect={this.handleValueUpdate} name="projectfunding__sources__countries__name" />
              </div>
            </Section>
          </Section>
        </form>
      </div>
    );
  }
}
