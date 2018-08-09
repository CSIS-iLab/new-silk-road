import React, { Component } from 'react'
import SearchActions from '../actions/SearchActions';
import InfrastructureIcon from './InfrastructureIcon';

export default class InfrastructureResult extends Component {
  constructor(props){
    super(props);
    this.handleClickIcon = this.handleClickIcon.bind(this);
    this.state = {
      infrastructure_type: null,
    }
  }

  handleClickIcon(e){
    this.setState({
      infrastructure_type: e
    },() => {
      this.props.infrastructureOnClick(this.state.infrastructure_type),
      SearchActions.search(this.state.infrastructure_type)
    })
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
