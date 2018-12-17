import React, { Component } from 'react';
import Select from 'react-select';
import classNames from 'classnames';
import Panel from './Panel';
import InfrastructureTypeStore from '../stores/InfrastructureTypeStore';
import InfrastructureTypeActions from '../actions/InfrastructureTypeActions';
import InfrastructureTypeToggle from './InfrastructureTypeToggle';
import StatusStore from '../stores/StatusStore';
import StatusActions from '../actions/StatusActions';
import RegionStore from '../stores/RegionStore';
import CuratedProjectCollectionStore from '../stores/CuratedProjectCollectionStore';
import RegionActions from '../actions/RegionActions';
import CountryStore from '../stores/CountryStore';
import CountryActions from '../actions/CountryActions';
import CuratedProjectCollectionActions from '../actions/CuratedProjectCollectionActions';
import PrincipalAgentStore from '../stores/PrincipalAgentStore';
import PrincipalAgentActions from '../actions/PrincipalAgentActions';
import CurrencyStore from '../stores/CurrencyStore';
import CurrencyActions from '../actions/CurrencyActions';
import DateRangeSelect from './DateRangeSelect';
import CurrencyRangeSelect from './CurrencyRangeSelect';
import ResultsView from './ResultsView';
import ErrorView from './ErrorView';
import SearchActions from '../actions/SearchActions';
import {CuratedProjectCollectionSource} from '../sources/apisources';
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
      total: null,
      results: [],
      nextURL: null,
      previousURL: null,
      error: null,
      searchEnabled: false,
      expanded: false,
      isSearching: false,
      searchCount: 0,
      showFilters: '',
      showHelp: '',
    };
    this.resetQueryState = this.resetQueryState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleQueryUpdate = this.handleQueryUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSearchResults = this.onSearchResults.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
    this.toggleHelp = this.toggleHelp.bind(this);
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

    CuratedProjectCollectionStore.listen(
      store => this.setState((prevState) => {
        const options = Object.assign(
          {},
          prevState.options,
          { curated_project_collections: nameIdMapper(store.results) },
        );
        return { options };
      }),
    );
    CuratedProjectCollectionActions.fetch();

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

  toggleFilters(e){
    if (e) {
      e.preventDefault();
    }
    const filtersState = this.state.showFilters ? '' : 'showFilters';
    this.setState({
      showFilters: filtersState,
    });
  }

  toggleHelp(e){
    e.preventDefault();
    const helpState = this.state.showHelp ? '' : 'showHelp';
    this.setState({
      showHelp: helpState,
    });
  }

  onSearchResults(data) {
    const { total, results, next, previous, error, isSearching, searchCount } = data;
    this.setState({
      total,
      results,
      nextURL: next,
      previousURL: previous,
      error,
      isSearching,
      searchCount,
    });
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
      this.toggleFilters();
      SearchActions.search(searchParams);
    }
  }

  render() {
    const { results, nextURL, previousURL, error, isSearching, searchCount } = this.state;
    const errorView = error ?
      (<ErrorView errorMessage="Sorry, the application encountered an error." />) : null;
    const curatedProjectCollections = this.state.options.curated_project_collections;

    return (
      <div className="searchView">
        <InfrastructureTypeToggle
          infrastructureOnClick={this.handleQueryUpdate}
          onSubmit={this.handleSubmit}
          infrastructureTypes={this.state.options.infrastructure_type}
          theState={this.state}
        />
        <div className={`inner ${this.state.showFilters} ${this.state.showHelp}`}>
          <div className="searchWidget">
            <header className="searchView__header">
              <button
                className="searchView__header-toggle"
                onClick={this.toggleFilters}
              >
                <span>Close</span>
              </button>
              <button
                className="searchView__header-reset-filter"
                onClick={this.resetQueryState}
              >
                <span>Reset form</span>
              </button>
            </header>
            <form onSubmit={this.handleSubmit}>
              <div className="filterScroll searchWidget__main">
                <Panel
                  title="Projects"
                  ref={(el) => { this.projectsPanel = el; }}
                >
                  <div className="filter-input-group">
                    <label className="filter-input-group__label">Project Title</label>
                    <input
                      type="text"
                      className="filter-input-group__input-text"
                      value={this.state.query.name__icontains}
                      onChange={this.handleChange}
                      name="name__icontains"
                      placeholder="Project Title"
                    />
                  </div>
                  <div className="filter-input-group">
                    <label className="filter-input-group__label filter-input-group__label--with-plus">Status</label>
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
                  <div className="filter-input-group">
                    <label className="filter-input-group__label filter-input-group__label--with-plus">Region</label>
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
                  <div className="filter-input-group">
                    <label className="filter-input-group__label filter-input-group__label--with-plus">Country</label>
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
                  <div className="filter-input-group">
                    <label className="filter-input-group__label filter-input-group__label--with-plus">Milestone</label>
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
                <hr className="searchWidget__separator" />
                <Panel
                  title="Initiatives"
                  ref={(el) => { this.initiativesPanel = el; }}
                >
                  <div className="filter-input-group">
                    <label className="filter-input-group__label">Initiative Title</label>
                    <input
                      type="text"
                      className="filter-input-group__input-text"
                      value={this.state.query.initiatives__name__icontains}
                      onChange={this.handleChange}
                      name="initiatives__name__icontains"
                      placeholder="Initiative Title"
                    />
                  </div>
                  <div className="filter-input-group">
                    <label className="filter-input-group__label filter-input-group__label--with-plus">Principal Agent</label>
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
                <hr className="filter-panel-separator" />
                <Panel
                  title="Funders"
                  ref={(el) => { this.fundersPanel = el; }}
                >
                  <div className="filter-input-group">
                    <label className="filter-input-group__label">Funder Name</label>
                    <input
                      type="text"
                      className="filter-input-group__input-text"
                      value={this.state.query.funding__sources__name__icontains}
                      onChange={this.handleChange}
                      name="funding__sources__name__icontains"
                      placeholder="Funder Name"
                    />
                  </div>
                  <div className="filter-input-group">
                    <label className="filter-input-group__label filter-input-group__label--with-plus">Cost</label>
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
                  <div className="filter-input-group">
                    <label className="filter-input-group__label filter-input-group__label--with-plus">Country</label>
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
              </div>
              <header
                className={classNames(
                  'searchView__header',
                  'searchView__header--interactive',
                  { 'searchView__header--disabled': !this.state.searchEnabled },
                )}
              >
                <button
                  type="submit"
                  title="Search"
                  className="searchView__update-results"
                  disabled={!this.state.searchEnabled}
                >
                  <span>
                    Update Results
                  </span>
                </button>
                <span></span>
              </header>
            </form>
          </div>
          {(() => {
            if (searchCount > 0 &&
            !isSearching &&
            !errorView &&
            results.length === 0) {
              return (
                <div className="filter-input-group">
                  <p>Sorry, we didn&rsquo;t find any matches.</p>
                </div>
              );
            }
            return '';
          })()}
          <div className="resultsViewWrapper">
            <header className="searchView__header searchView__header--light">
              <button
                className="resultsView__header-toggle"
                onClick={this.toggleFilters}
              >
                <span>Filter</span>
              </button>
              <button
                className="resultsView__header-toggle--help"
                onClick={this.toggleHelp}
              />
            </header>
            <ResultsView
              results={results}
              onNextClick={SearchView.handleResultsNavClick}
              nextURL={nextURL}
              onPreviousClick={SearchView.handleResultsNavClick}
              previousURL={previousURL}
              totalCount={this.state.total}
              updateParentQuery={this.handleQueryUpdate}
              curatedProjectCollections={curatedProjectCollections}
            />
          </div>
          <div className="helpView">
            <header className="searchView__header searchView__header--light">
              <button className="searchView__header-toggle" onClick={this.toggleHelp}>
                <span>Close</span>
              </button>
            </header>
            <div className="helpView__main">
              <section>
                <h2 className="helpView__section-heading">How to search the map</h2>
                <p className="helpView__body-text">For more information about data collection and definitions, see our <a href="/methodology/">methodology.</a></p>
              </section>
              <hr className="helpView__separator" />
              <section>
                <h3 className="helpView__section-subheading">Project Filters</h3>
                <p className="helpView__body-text">
                  <b>Project Title:</b> Searches project titles, which do not include all attributes of a given project. For example, there may be projects in the city of Karachi without “Karachi” in their title.
                </p>
                <p className="helpView__body-text">
                  <b>Infrastructure Type:</b> Limits search to a specific infrastructure type (ex. “rail”).
                </p>
                <p className="helpView__body-text">
                  <b>Status:</b> Limits search to projects in a specific stage of implementation (ex. “announced or under negotiation”).
                </p>
                <p className="helpView__body-text">
                  <b>Region:</b> Limits search to projects within a certain geographic area (ex. “Gulf and Mediterranean”).
                </p>
                <p className="helpView__body-text">
                  <b>Country:</b> Limits search to projects within a designated country (ex. “China”).
                </p>
                <p className="helpView__body-text">
                  <b>Filter by Year:</b> Limits search to projects that fall within a specific timeframe, as defined by selecting either completion year, commencement year, or start year
                </p>
              </section>
            </div>
          </div>
          {errorView}
        </div>
        <footer />
      </div>
    );
  }
}
