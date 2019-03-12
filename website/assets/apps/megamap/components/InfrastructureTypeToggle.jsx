import React, { Component, PropTypes } from 'react';
import SearchActions from '../actions/SearchActions';
import InfrastructureIcon from './InfrastructureIcon';

export default class InfrastructureTypeToggle extends Component {
  constructor(props) {
    super(props);

    this.handleClickIcon = this.handleClickIcon.bind(this);
    // Initally, set the state to have null infrastructure_type. When the component
    // receives the props later, we update the state to store the initial value
    // of the props' infrastructureTypes.
    this.state = {
      infrastructure_type: null,
      hidden: true,
    };
  }

  componentDidUpdate() {
    // If this is the first time that the component is receiving props, then
    // update the state from the props.
    if (this.state.infrastructure_type === null && this.props.infrastructureTypes.length > 0) {
      this.setState({
        infrastructure_type: this.props.infrastructureTypes.map(x => x.__proto__.value),
      });
    }
  }

  handleClickIcon(infrastructureTypeId) {
    /* Take the infrastructureTypeId and either add it to, or subtract it from,
     * the state. Then, query the backend with the new query parameters.
     */

    // A copy of the current state
    const selectedInfrastructureTypes = [...this.state.infrastructure_type];

    // If the infrastructureTypeId is already in the selectedInfrastructureTypes,
    // then remove it from selectedInfrastructureTypes.
    const indexI = selectedInfrastructureTypes.indexOf(infrastructureTypeId);
    if (indexI !== -1) {
      selectedInfrastructureTypes.splice(indexI, 1);

      // If the array is empty add a dummy value of 0 to filter on
      // to return empty results
      if (selectedInfrastructureTypes.length === 0) {
        selectedInfrastructureTypes.push(0);
      }
    } else {
      // The infrastructureTypeId is not in the selectedInfrastructureTypes,
      // so add it to selectedInfrastructureTypes.
      selectedInfrastructureTypes.push(infrastructureTypeId);

      //
      const indexJ = selectedInfrastructureTypes.indexOf(0);
      if (indexJ !== -1) {
        selectedInfrastructureTypes.splice(indexJ, 1);
      }
    }

    // Get the currect query parameters
    const storeObj = this.props.theState.query;
    const queryParams = {};
    if (storeObj) {
      Object.keys(storeObj).map((key) => {
        if (key !== 'infrastructure_type' && storeObj[key] && storeObj[key].length !== 0 && Object.keys(storeObj[key]).length) {
          queryParams[key] = storeObj[key];
        }
      });
    }
    const options = Object.assign(
          {},
          queryParams,
          { infrastructure_type: selectedInfrastructureTypes },
        );
    // Set the state, and query the backend with the query parameters we just constructed
    this.setState(options);
    this.props.infrastructureOnClick(options);
    SearchActions.search(options);
  }

  render() {
    return (
      <div
        id="infrastructureToggleContainer"
        onMouseLeave={() => this.setState({ hidden: true })}
        onMouseOut={() => this.setState({ hidden: true })}
        onMouseEnter={() => this.setState({ hidden: false })}
        onMouseOver={() => this.setState({ hidden: false })}
      >
        <div id="infrastructureToggle">
          {
            this.state.infrastructure_type ?
            this.props.infrastructureTypes.map(type => (
              <InfrastructureIcon
                hidden={this.state.hidden}
                returnIdOnClick={this.handleClickIcon}
                properties={type}
                key={type.value}
              />
            )) : null
          }
        </div>
      </div>
    );
  }
}

InfrastructureTypeToggle.propTypes = {
  infrastructureOnClick: PropTypes.func,
  infrastructureTypes: PropTypes.arrayOf(PropTypes.shape({})),
  theState: PropTypes.shape({}),
};
