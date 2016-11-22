import React, { Component } from 'react';
import Select from 'react-select';
import Panel from './Panel';
import { FunderCountrySelect, ProjectCountrySelect } from './country-selects';
import ProjectRegionSelect from './region-selects';
import StatusSelectContainer from './StatusSelectContainer';
import PrincipalAgentSelectContainer from './PrincipalAgentSelectContainer';
import CurrencyAmountSelectContainer from './CurrencyAmountSelectContainer';
import InfrastructureTypeStore from '../stores/InfrastructureTypeStore';
import InfrastructureTypeActions from '../actions/InfrastructureTypeActions';
import DateRangeSelect from './DateRangeSelect';
import ResultsView from './ResultsView';
import ErrorView from './ErrorView';
import SearchActions from '../actions/SearchActions';
import SearchStore from '../stores/SearchStore';

const nameIdMapper = data => data.results.map(
  obj => Object.create({ label: obj.name, value: obj.id }),
);

const emptyQueryState = () => Object.create({
  name__icontains: '',
  initiatives__name__icontains: '',
  funding__sources__name__icontains: '',
  infrastructure_type: [],
});

const yearLookupOptions = [
  {
    label: 'Completion Year',
    value: 'planned_completion_year',
  },
  {
    label: 'Commencement Year',
    value: 'commencement_year',
  },
  {
    label: 'Start Year',
    value: 'start_year',
  },
];

export default class SearchView extends Component {

  static handleResultsNavClick(e) {
    if (e.target.value) {
      SearchActions.load(e.target.value);
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      infrastructure_type: {
        options: [],
      },
      query: emptyQueryState(),
      results: [],
      nextURL: null,
      previousURL: null,
      error: null,
      searchEnabled: false,
      expanded: false,
      isSearching: false,
      searchCount: 0,
    };
    this.resetQueryState = this.resetQueryState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleQueryUpdate = this.handleQueryUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSearchResults = this.onSearchResults.bind(this);
  }

  componentDidMount() {
    SearchStore.listen(this.onSearchResults);
    InfrastructureTypeStore.listen(
      store => this.setState({
        infrastructure_type: { options: nameIdMapper(store) },
      }),
    );
    InfrastructureTypeActions.fetch();
  }

  onSearchResults(data) {
    const { results, next, previous, error, isSearching, searchCount } = data;
    this.setState({
      results,
      nextURL: next,
      previousURL: previous,
      error,
      isSearching,
      searchCount,
    });
    this.collapsePanels();
  }

  collapsePanels() {
    this.projectsPanel.collapse();
    this.initiativesPanel.collapse();
    this.fundersPanel.collapse();
  }

  resetQueryState() {
    this.setState({ query: emptyQueryState(), searchEnabled: false });
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.handleQueryUpdate({ [`${name}`]: value });
  }

  handleQueryUpdate(q) {
    // TODO: Migrate this logic to a Store that manages the state of the search query.
    const queryUpdate = Object.assign({}, this.state.query, q);
    const enableSearch = Object.values(queryUpdate).some((value) => {
      if (Array.isArray(value)) {
        return value.length !== 0;
      }
      return value !== '';
    });
    this.setState({ query: queryUpdate, searchEnabled: enableSearch });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (Object.keys(this.state.query).length > 0) {
      SearchActions.search(this.state.query);
    }
  }

  render() {
    const { results, nextURL, previousURL, error, isSearching, searchCount } = this.state;
    const errorView = error ?
      (<ErrorView errorMessage="Sorry, the application encountered an error." />) : null;
    return (
      <div className="searchView">
        <header>
          <h2>Search for Projects</h2>
        </header>
        <div className="inner">
          <div className="searchWidget">
            <form onSubmit={this.handleSubmit}>
              <div className="searchBar" id="primarySearch">
                <input
                  type="text"
                  value={this.state.query.name__icontains}
                  onChange={this.handleChange}
                  name="name__icontains"
                  placeholder="Project Title"
                />
                <button
                  type="submit"
                  title="Search"
                  disabled={!this.state.searchEnabled}
                >Search
                </button>
              </div>
              <Panel
                title="Projects"
                ref={(el) => { this.projectsPanel = el; }}
              >
                <div className="sectionRow">
                  <Select
                    value={this.state.query.infrastructure_type}
                    name="infrastructure_type"
                    placeholder="Infrastructure Type"
                    options={this.state.infrastructure_type.options}
                    onChange={selections => this.handleQueryUpdate(
                      { infrastructure_type: selections.map(s => s.value) },
                    )
                  }
                    isLoading={this.state.infrastructure_type.options.length === 0}
                    multi
                    backspaceToRemoveMessage=""
                  />
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
                    lowerBoundLabel="Year"
                    upperBoundLabel="Year"
                    onSelect={this.handleQueryUpdate}
                  />
                </div>
              </Panel>
              <Panel
                title="Initiatives"
                ref={(el) => { this.initiativesPanel = el; }}
              >
                <div className="sectionRow">
                  <div className="searchBar">
                    <input
                      type="text"
                      value={this.state.query.initiatives__name__icontains}
                      onChange={this.handleChange}
                      name="initiatives__name__icontains"
                      placeholder="Initiative Title"
                    />
                  </div>
                </div>
                <div className="sectionRow">
                  <PrincipalAgentSelectContainer onSelect={this.handleQueryUpdate} />
                </div>
              </Panel>
              <Panel
                title="Funders"
                ref={(el) => { this.fundersPanel = el; }}
              >
                <div className="sectionRow">
                  <div className="searchBar">
                    <input
                      type="text"
                      value={this.state.query.funding__sources__name__icontains}
                      onChange={this.handleChange}
                      name="funding__sources__name__icontains"
                      placeholder="Funder Name"
                    />
                  </div>
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
                  <p>Sorry, we didn&rsquo;t find any matches.</p>
                </div>
              );
            }
            return '';
          })()}
          <div className="resultsViewWrapper">
            <ResultsView
              results={results}
              onNextClick={SearchView.handleResultsNavClick}
              nextURL={nextURL}
              onPreviousClick={SearchView.handleResultsNavClick}
              previousURL={previousURL}
            />
          </div>

          {errorView}
        </div>
        <footer>
          <p>
            <a
              href="/map/help/"
              target="_blank"
              rel="noreferrer noopener"
              className="button help"
              title="Help"
            >
              Help
            </a>
          </p>
          <p>
            <button
              className="reset"
              type="reset"
              onClick={this.resetQueryState}
            >
              Reset
            </button>
          </p>
        </footer>
      </div>
    );
  }
}
