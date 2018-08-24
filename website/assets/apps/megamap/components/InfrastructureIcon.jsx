import React, { Component } from 'react'

export default class InfrastructureIcon extends Component {

  handleClick(){
    /* Return the element's id value. */
    this.props.returnIdOnClick(this.props.properties.value);
  }

  getIconSource(iconLabel) {
    /* Return the icon source URL for an icon label */
    if (iconLabel === "Road") {
      return "/static/img/database-icons/Road.svg";
    } else if (iconLabel === "Seaport") {
      return "/static/img/database-icons/Seaport.svg";
    } else if (iconLabel === "Rail") {
      return "/static/img/database-icons/Rail.svg";
    } else if (iconLabel === "Intermodal") {
      return "/static/img/database-icons/Dryport.svg";
    } else if (iconLabel === "Power Plant") {
      return "/static/img/database-icons/Powerplant.svg";
    }
  }

  getAltText(iconLabel) {
    return "Image representing visual display of a " + iconLabel.toLowerCase() + " on a map";
  }

  render() {
    var iconSource = this.getIconSource(this.props.properties.label);
    var altText = this.getAltText(this.props.properties.label);
    return (
      <span>
        <img width={40} height={40} onClick={this.handleClick.bind(this)} src={iconSource} alt={altText} />
      </span>
    )
  }
}
