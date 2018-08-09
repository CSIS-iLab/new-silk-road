import React, { Component } from 'react'

export default class InfrastructureIcon extends Component {

	handleClick(){
		this.props.icon(this.props.id)
	}

  render() {
    return (
      <div>
				<img onClick={this.handleClick.bind(this)} src='http://localhost:8000/static/img/redesign/reconasia_logo.svg' alt="Image representing visual display of a railroad on a map" />
      </div>
    )
  }
}
