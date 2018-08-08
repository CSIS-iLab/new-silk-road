import React, { Component } from 'react'
import SearchActions from '../actions/SearchActions';

export default class InfrastructureResult extends Component {
  constructor(props){
    super(props);
    this.state = {
      infrastructure_type: []
    }
  }
  
  handleRoad(){
    this.setState({
      infrastructure_type: [1]
    }, () => {
      this.props.infrastructureOnClick(this.state),
      SearchActions.search(this.state)
    });
  }

  handleRail(){
    this.setState({
      infrastructure_type: [2]
    }, () => {
      this.props.infrastructureOnClick(this.state),
      SearchActions.search(this.state)
    })
  }

  handleSeaport(){
    this.setState({
      infrastructure_type: [3]
    }, () => {
      this.props.infrastructureOnClick(this.state),
      SearchActions.search(this.state)
    })
  }

  handleDryport(){
    this.setState({
      infrastructure_type: [4]
    }, () => {
      this.props.infrastructureOnClick(this.state),
      SearchActions.search(this.state)
    })
  }

  handlePowerPlant(){
    this.setState({
      infrastructure_type: [6]
    }, () => {
      this.props.infrastructureOnClick(this.state),
      SearchActions.search(this.state)
    })
  }

  render() {
    return (
      <div>
        <ul>
            <li>
                <a href="#" onClick={this.handleRoad.bind(this)}>Road</a>
            </li>
            <li>
                <a href="#" onClick={this.handleRail.bind(this)}>Railroad</a>
            </li>
            <li>
                <a href="#" onClick={this.handleSeaport.bind(this)}>Seaport</a>
            </li>
            <li>
                <a href="#" onClick={this.handleDryport.bind(this)}>Dryport</a>
            </li>
            <li>
              <a href="#" onClick={this.handlePowerPlant.bind(this)}>Powerplant</a>
            </li>
        </ul>
      </div>
    )
  }
}
