import React, { Component } from 'react';
import Select from 'react-select';
import Panel from './Panel';
import InfrastructureTypeStore from '../stores/InfrastructureTypeStore';
import InfrastructureTypeActions from '../actions/InfrastructureTypeActions';
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
import ResultsView from './ResultsView';
import ErrorView from './ErrorView';
import SearchActions from '../actions/SearchActions';
import SearchStore from '../stores/SearchStore';

const nameIdMapper = data => data.results.map(
  obj => Object.create({ label: obj.name, value: obj.id }),
);

const nameSlugMapper = data => data.results.map(
  obj => Object.create({ label: obj.name, value: obj.slug }),
);

const emptyQueryState = () => Object.assign({}, {
  name__icontains: '',
  initiatives__name__icontains: '',
  funding__sources__name__icontains: '',
  initiatives__principal_agent__slug: '',
  cost: '',
  infrastructure_type: [],
  status: [],
  date_range: {
    dateLookupType: '',
  },
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
          { infrastructure_type: nameIdMapper(store) },
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
          { status: nameIdMapper(store) },
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
          { region: nameIdMapper(store) },
        );
        return { options };
      }),
    );
    RegionActions.fetch();

    CountryStore.listen(
      store => this.setState((prevState) => {
        const countryOpts = nameIdMapper(store);
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
          { initiatives__principal_agent__slug: nameIdMapper(store) },
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
                <button
                  className="reset"
                  type="reset"
                  onClick={this.resetQueryState}
                >
                  Reset
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
                    options={this.state.options.infrastructure_type}
                    onChange={selections => this.handleQueryUpdate(
                        { infrastructure_type: selections.map(s => s.value) },
                      )
                    }
                    isLoading={this.state.options.infrastructure_type.length === 0}
                    multi
                    backspaceToRemoveMessage=""
                  />
                </div>
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
                        { date_range: Object.assign({}, value) },
                      )
                    }
                    value={this.state.query.date_range}
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
                    onChange={selection => this.handleQueryUpdate(
                        { initiatives__principal_agent__slug: selection.value },
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
                  <Select
                    value={this.state.query.cost}
                    name="cost"
                    placeholder="Cost"
                    options={this.state.options.cost}
                    onChange={option => this.handleQueryUpdate(
                        { cost: option.value },
                      )
                    }
                    isLoading={this.state.options.cost.length === 0}
                    backspaceToRemoveMessage=""
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
        </footer>
      </div>
    );
  }
}
