import React, { Component, PropTypes } from "react";
import Panel from "./Panel";
import SearchBar from "./SearchBar";
import CountrySelectContainer from "./CountrySelectContainer";
import RegionSelectContainer from "./RegionSelectContainer";
import StatusSelectContainer from "./StatusSelectContainer";
import InfrastructureTypeSelectContainer from "./InfrastructureTypeSelectContainer";
import PrincipalAgentSelectContainer from './PrincipalAgentSelectContainer';
import CurrencyAmountSelectContainer from './CurrencyAmountSelectContainer';
import ResultsView from './ResultsView';
import ErrorView from './ErrorView';
import {Select, Button} from "./forms";
import SearchActions from '../actions/SearchActions';
import SearchStore from '../stores/SearchStore';


export default class SearchView extends Component {
  static propTypes = {
    maxHeight: PropTypes.number.isRequired,
  }

  state = {
    query: {},
    results: [],
    nextURL: null,
    previousURL: null,
    error: null,
    searchEnabled: false,
    expanded: false
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

  handleResultsNavClick = (e) => {
    if (e.target.value) {
      SearchActions.load(e.target.value);
    }
  }

  _collapsePanels() {
    this.refs.projectsPanel.collapse();
    this.refs.initiativesPanel.collapse();
    this.refs.fundersPanel.collapse();
  }

  onSearchResults = (data) => {
    var { results, next, previous, error } = data;
    this.setState({results, nextURL: next, previousURL: previous, error});
    this._collapsePanels();
  }

  render() {
    const { maxHeight } = this.props;
    const { results, nextURL, previousURL, error } = this.state;
    const searchViewHeight = results.length > 0 ? maxHeight : 'auto';
    const resultsViewHeight = results.length > 0 ? maxHeight - 76 : 0;
    const errorView = error ? (<ErrorView errorMessage="Sorry, the application encountered an error." />) : null;
    return (
      <div className="searchView" style={{height: searchViewHeight}}>
        <div className="searchWidget">
          <form onSubmit={this.handleSubmit}>
          <SearchBar
          id="primarySearch"
          placeholder="Project Title" name="name__icontains"
          value={this.state.projectTitle}
          onSearchInput={this.handleQueryUpdate}
          searchEnabled={this.state.searchEnabled}
          />
          <Panel title='Projects' ref='projectsPanel'>
            <div className="sectionRow">
              <InfrastructureTypeSelectContainer onSelect={this.handleQueryUpdate} />
            </div>
            <div className="sectionRow">
              <StatusSelectContainer onSelect={this.handleQueryUpdate} />
            </div>
          </Panel>
          <Panel title='Initiatives' ref='initiativesPanel'>
            <div className="sectionRow">
              <SearchBar placeholder="Initiative Title" name="initiatives__name__icontains"
              onSearchInput={this.handleQueryUpdate}
              searchEnabled={this.state.searchEnabled}
              showSubmit={false}
              />
            </div>
            <div className="sectionRow">
              <PrincipalAgentSelectContainer onSelect={this.handleQueryUpdate} />
            </div>
            <div className="sectionRow">
              <RegionSelectContainer onSelect={this.handleQueryUpdate} />
            </div>
          </Panel>
          <Panel title='Funders' ref='fundersPanel'>
            <div className="sectionRow">
              <SearchBar placeholder="Funder Name" name="funding__sources__name__icontains"
              onSearchInput={this.handleQueryUpdate}
              searchEnabled={this.state.searchEnabled}
              showSubmit={false}
              />
            </div>
            <div className="sectionRow">
              <CurrencyAmountSelectContainer onSelect={this.handleQueryUpdate} />
            </div>
            <div className="sectionRow">
              <CountrySelectContainer onSelect={this.handleQueryUpdate} />
            </div>
          </Panel>
          </form>
        </div>
        <ResultsView
          style={{height: resultsViewHeight}}
          results={results}
          onNextClick={this.handleResultsNavClick}
          nextURL={nextURL}
          onPreviousClick={this.handleResultsNavClick}
          previousURL={previousURL}
        />
        {errorView}
      </div>
    );
  }
}
