import React, { Component } from 'react'

export default class InfrastructureIcon extends Component {
	constructor(props){
		super(props);
		this.state = {
			ids: [1,2,3,4,6],
		}
	}

	handleClick(){
		var values = this.state.ids
		var index = values.indexOf(this.props.id);
		var newValues = values.splice(index, 1);
		this.props.icon(newValues)
	}

  render() {
    return (
      <div>
				<img onClick={this.handleClick.bind(this)} src='http://localhost:8000/static/img/redesign/reconasia_logo.svg' alt="Image representing visual display of a railroad on a map" />
      </div>
    )
  }
}
