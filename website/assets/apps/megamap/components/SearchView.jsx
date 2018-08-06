import React, { Component } from 'react';
import Select from 'react-select';
import Panel from './Panel';
import InfrastructureTypeStore from '../stores/InfrastructureTypeStore';
import InfrastructureTypeActions from '../actions/InfrastructureTypeActions';
import InfrastructureResult from './InfrastructureResult';
import StatusStore from '../stores/StatusStore';
import StatusActions from '../actions/StatusActions';
import RegionStore from '../stores/RegionStore';
import RegionActions from '../actions/RegionActions';
import CountryStore from '../stores/CountryStore';
import CountryActions from '../actions/CountryActions';
import PrincipalAgentStore from '../stores/PrincipalAgentStore';
import PrincipalAgentActions from '../actions/PrincipalAgentActions';
import CurrencyStore from '../stores/CurrencyStore';
import CurrencyActions from '../actions/CurrencyActions';
import DateRangeSelect from './DateRangeSelect';
import CurrencyRangeSelect from './CurrencyRangeSelect';
import ResultsView from './ResultsView';
import ErrorView from './ErrorView';
import SearchActions from '../actions/SearchActions';
import SearchStore from '../stores/SearchStore';
import {
  nameIdMapper,
  nameSlugMapper,
  generateRangeQuery,
  hasSearchableValue,
} from '../functions';

const emptyQueryState = () => Object.assign({}, {
  name__icontains: '',
  initiatives__name__icontains: '',
  funding__sources__name__icontains: '',
  initiatives__principal_agent__slug: '',
  cost: '',
  infrastructure_type: [],
  status: [],
  dateRange: {},
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
      options: {
        infrastructure_type: [],
        status: [],
        region: [],
        countries: [],
        cost: [],
        funding__sources__countries: [],
        initiatives__principal_agent__slug: [],
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
      store => this.setState((prevState) => {
        const options = Object.assign(
          {},
          prevState.options,
          { infrastructure_type: nameIdMapper(store.results) },
        );
        return { options };
      }),
    );
    InfrastructureTypeActions.fetch();

    StatusStore.listen(
      store => this.setState((prevState) => {
        const options = Object.assign(
          {},
          prevState.options,
          { status: nameIdMapper(store.results) },
        );
        return { options };
      }),
    );
    StatusActions.fetch();

    RegionStore.listen(
      store => this.setState((prevState) => {
        const options = Object.assign(
          {},
          prevState.options,
          { region: nameIdMapper(store.results) },
        );
        return { options };
      }),
    );
    RegionActions.fetch();

    CountryStore.listen(
      store => this.setState((prevState) => {
        const countryOpts = nameIdMapper(store.results);
        const options = Object.assign(
          {},
          prevState.options,
          { countries: countryOpts, funding__sources__countries: countryOpts },
        );
        return { options };
      }),
    );
    CountryActions.fetch();

    PrincipalAgentStore.listen(
      store => this.setState((prevState) => {
        const options = Object.assign(
          {},
          prevState.options,
          { initiatives__principal_agent__slug: nameSlugMapper(store.results) },
        );
        return { options };
      }),
    );
    PrincipalAgentActions.fetch({ principal_initiatives__isnull: 'False' });

    CurrencyStore.listen(
      store => this.setState((prevState) => {
        const lookups = Object.entries(store.lookups)
                              .map(([key, value]) => ({ label: key, value }));
        const options = Object.assign(
          {},
          prevState.options,
          { cost: lookups },
        );
        return { options };
      }),
    );
    CurrencyActions.fetch();
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
    this.setState({
      query: emptyQueryState(),
      searchEnabled: false,
      error: null,
      searchCount: 0,
      results: [],
    });
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.handleQueryUpdate({ [`${name}`]: value });
  }

  handleQueryUpdate(q) {
    // TODO: Migrate this logic to a Store that manages the state of the search query.
    const queryUpdate = Object.assign({}, this.state.query, q);
    const enableSearch = hasSearchableValue(queryUpdate);
    this.setState({ query: queryUpdate, searchEnabled: enableSearch });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (Object.keys(this.state.query).length > 0) {
      let searchParams = Object.assign({}, this.state.query);
      if ({}.hasOwnProperty.call(searchParams, 'cost')) {
        searchParams = Object.assign(searchParams, searchParams.cost);
        delete searchParams.cost;
      }
      if ({}.hasOwnProperty.call(searchParams, 'dateRange')) {
        if (Object.keys(searchParams.dateRange).length > 0) {
          const {
            dateLookupType: lookupName,
            lowerValue,
            upperValue,
          } = searchParams.dateRange;
          searchParams = Object.assign(
            searchParams,
            generateRangeQuery(lookupName, lowerValue, upperValue),
          );
        }
        delete searchParams.dateRange;
      }
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value === '' || value === null) {
          delete searchParams[key];
        }
      });
      SearchActions.search(searchParams);
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
            <InfrastructureResult
                infrastructureOnClick={this.handleQueryUpdate}
                onSubmit={this.handleSubmit}
            />
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
                <button
                  className="reset"
                  type="reset"
                  title="Clear"
                  disabled={!this.state.searchEnabled}
                  onClick={this.resetQueryState}
                >
                  Clear
                </button>
              </div>
              <Panel
                title="Projects"
                ref={(el) => { this.projectsPanel = el; }}
              >
                <div className="sectionRow">
                  <Select
                    value={this.state.query.status}
                    name="status"
                    placeholder="Status"
                    options={this.state.options.status}
                    onChange={selections => this.handleQueryUpdate(
                        { status: selections.map(s => s.value) },
                      )
                    }
                    isLoading={this.state.options.status.length === 0}
                    multi
                    backspaceToRemoveMessage=""
                  />
                </div>
                <div className="sectionRow">
                  <Select
                    value={this.state.query.region}
                    name="region"
                    placeholder="Region"
                    options={this.state.options.region}
                    onChange={selections => this.handleQueryUpdate(
                        { region: selections.map(s => s.value) },
                      )
                    }
                    isLoading={this.state.options.region.length === 0}
                    multi
                    backspaceToRemoveMessage=""
                  />
                </div>
                <div className="sectionRow">
                  <Select
                    value={this.state.query.countries}
                    name="countries"
                    placeholder="Country"
                    options={this.state.options.countries}
                    onChange={selections => this.handleQueryUpdate(
                        { countries: selections.map(s => s.value) },
                      )
                    }
                    isLoading={this.state.options.countries.length === 0}
                    multi
                    backspaceToRemoveMessage=""
                  />
                </div>
                <div className="sectionRow">
                  <DateRangeSelect
                    labelName="Filter by Year..."
                    dateLookupOptions={yearLookupOptions}
                    lowerBoundLabel="Year"
                    upperBoundLabel="Year"
                    onChange={value => this.handleQueryUpdate(
                        { dateRange: Object.assign({}, this.state.query.dateRange, value) },
                      )
                    }
                    value={this.state.query.dateRange}
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
                  <Select
                    value={this.state.query.initiatives__principal_agent__slug}
                    name="initiatives__principal_agent__slug"
                    placeholder="Principal Agent"
                    options={this.state.options.initiatives__principal_agent__slug}
                    onChange={option => this.handleQueryUpdate(
                        { initiatives__principal_agent__slug: option ? option.value : '' },
                      )
                    }
                    isLoading={this.state.options.initiatives__principal_agent__slug.length === 0}
                    backspaceToRemoveMessage=""
                  />
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
                  <CurrencyRangeSelect
                    name="cost"
                    placeholder="Cost"
                    clear={Object.keys(this.state.query.cost).length === 0}
                    onChange={value =>
                      this.handleQueryUpdate(
                        { cost: value },
                      )
                    }
                  />
                </div>
                <div className="sectionRow">
                  <Select
                    value={this.state.query.funding__sources__countries}
                    name="funding__sources__countries"
                    placeholder="Country"
                    options={this.state.options.funding__sources__countries}
                    onChange={selections => this.handleQueryUpdate(
                        { funding__sources__countries: selections.map(s => s.value) },
                      )
                    }
                    isLoading={this.state.options.funding__sources__countries.length === 0}
                    multi
                    backspaceToRemoveMessage=""
                  />
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
          <div className={`resultsViewWrapper ${results.length === 0 ? 'no-results' : 'results'}`}>
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
        </footer>
      </div>
    );
  }
}
