import React, { Component, PropTypes } from "react";
import Panel from "./Panel";
import SearchBar from "./SearchBar";
import {FunderCountrySelect, ProjectCountrySelect} from "./country-selects";
import {ProjectRegionSelect} from "./region-selects";
import StatusSelectContainer from "./StatusSelectContainer";
import InfrastructureTypeSelectContainer from "./InfrastructureTypeSelectContainer";
import PrincipalAgentSelectContainer from './PrincipalAgentSelectContainer';
import CurrencyAmountSelectContainer from './CurrencyAmountSelectContainer';
import DateRangeSelect from './DateRangeSelect';
import ResultsView from './ResultsView';
import ErrorView from './ErrorView';
import {Select, Button} from "./forms";
import SearchActions from '../actions/SearchActions';
import SearchStore from '../stores/SearchStore';

const yearLookupOptions = [
  {
    label: 'Completion Year',
    value: 'planned_completion_year'
  },
  {
    label: 'Commencement Year',
    value: 'commencement_year'
  },
  {
    label: 'Start Year',
    value: 'start_year'
  }
]

export default class SearchView extends Component {

  state = {
    query: {},
    results: [],
    nextURL: null,
    previousURL: null,
    error: null,
    searchEnabled: false,
    expanded: false,
    isSearching: false,
    searchCount: 0
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
        if (value && value !== '' && (Array.isArray(value) && value.length !== 0)) {
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
    var { results, next, previous, error, isSearching, searchCount } = data;
    this.setState({results, nextURL: next, previousURL: previous, error, isSearching, searchCount});
    this._collapsePanels();
  }

  render() {
    const { results, nextURL, previousURL, error, query, isSearching, searchCount } = this.state;
    const errorView = error ? (<ErrorView errorMessage="Sorry, the application encountered an error." />) : null;
    return (
      <div className="searchView">
        <header>
          <h2>Search for Projects</h2>
        </header>
        <div className="inner">
          <div className="searchWidget">
          <form onSubmit={this.handleSubmit}>
          <SearchBar
          id="primarySearch"
          placeholder="Project Title" name="name__icontains"
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
          <div className="sectionRow">
          <ProjectRegionSelect onSelect={this.handleQueryUpdate} />
          </div>
          <div className="sectionRow">
          <ProjectCountrySelect onSelect={this.handleQueryUpdate} />
          </div>
          <div className="sectionRow">
          <DateRangeSelect
          labelName="Filter by Year..."
          dateLookupOptions={yearLookupOptions}
          lowerBoundLabel='Year'
          upperBoundLabel='Year'
          onSelect={this.handleQueryUpdate}
          />
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
          <FunderCountrySelect onSelect={this.handleQueryUpdate} />
          </div>
          </Panel>
          </form>
          </div>
          {(() => {
            if (searchCount > 0 &&
              !isSearching &&
              !errorView &&
              results.length === 0) {
                return (
                  <div className="sectionRow">
                  <p>Sorry, we didn't find any matches.</p>
                  </div>
                );
              }
            })()}
            <div className="resultsViewWrapper">
            <ResultsView
            results={results}
            onNextClick={this.handleResultsNavClick}
            nextURL={nextURL}
            onPreviousClick={this.handleResultsNavClick}
            previousURL={previousURL}
            />
            </div>

            {errorView}
        </div>
        <footer>
          <p><a href="/map/help/" target="_blank" className='button help' title='Help'>Help</a></p>
        </footer>
      </div>
    );
  }
}
