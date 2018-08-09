import React, { Component } from 'react'
import SearchActions from '../actions/SearchActions';
import InfrastructureIcon from './InfrastructureIcon';

export default class InfrastructureResult extends Component {
  constructor(props){
    super(props);
    this.handleClickIcon = this.handleClickIcon.bind(this);
    this.handleIconState = this.handleIconState.bind(this);
    this.state = {
      infrastructure_type: [1,2,3,4,6],
    }
  }

  handleClickIcon(e){
    var options = this.state.infrastructure_type
    if (options.indexOf(e) !== -1){
      var index = options.indexOf(e)
      if (index > -1) {
        options.splice(index, 1)
      }
    } else {
      options.push(e)
    }
    this.handleIconState(options)
  }

  handleIconState(opt){
    this.setState({
      infrastructure_type: opt
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
