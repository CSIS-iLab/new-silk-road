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
      <div className="btn-group">
        <a href="#" onClick={this.handleRoad.bind(this)}><i className="fas fa-road"></i></a>
        <a href="#" onClick={this.handleRail.bind(this)}><i className="fas fa-train"></i></a> 
        <a href="#" onClick={this.handleSeaport.bind(this)}><i className="fas fa-anchor"></i></a> 
        <a href="#" onClick={this.handleDryport.bind(this)}><i className="fas fa-industry"></i></a>
        <a href="#" onClick={this.handlePowerPlant.bind(this)}><i className="fas fa-plane"></i></a> 
      </div>
    )
  }
}
