import React, { Component } from 'react'
import SearchActions from '../actions/SearchActions';
import InfrastructureIcon from './InfrastructureIcon';

export default class InfrastructureResult extends Component {
  constructor(props){
    super(props);
    this.handleClickIcon = this.handleClickIcon.bind(this);
    this.state = {
      infrastructure_type: [1,2,3,4,6],
    }
  }

  handleClickIcon(e){
    if (e in this.state.infrastructure_type){
      var options = this.state.infrastructure_type
      var index = options.indexOf(e)
      options.splice(index, 1)
    } else {
      var options = this.state.infrastructure_type
      options.push(e)
    }
    this.setState({
      infrastructure_type: options
    }, () => {
      this.props.infrastructureOnClick(this.state),
      SearchActions.search(this.state)
    });
  }

  render() {
    return (
      <div>
        <InfrastructureIcon options={this.props.options} icon={this.handleClickIcon} id={1} />
        <InfrastructureIcon options={this.props.options} icon={this.handleClickIcon} id={2} />
        <InfrastructureIcon options={this.props.options} icon={this.handleClickIcon} id={3} />
        <InfrastructureIcon options={this.props.options} icon={this.handleClickIcon} id={4} />
        <InfrastructureIcon options={this.props.options} icon={this.handleClickIcon} id={6} />
      </div>
    )
  }
}
