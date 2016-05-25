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

export default class SearchBox extends Component {
  state = {
    name: '',
    initiative__name: ''
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
                <label>
                  <span>Amount</span>
                  <Select name="compare" value="">
                    <option value="">----</option>
                  </Select>
                  <Select name="amount" value="">
                    <option value="">----</option>
                    <option value="100000">100,000</option>
                  </Select>
                </label>
              </div>
              <div className="section-row">
                <Select name="projectfunding__sources__countries__name" value="">
                  <option value="">Country</option>
                </Select>
              </div>
            </Section>
          </Section>
        </form>
      </div>
    );
  }
}
