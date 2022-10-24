import React from "react";
import StarRatings from "react-star-ratings";
import "react-image-gallery/styles/css/image-gallery.css";

class Rating extends React.Component {
  render() {
    return (
      <StarRatings
        rating={this.props.ratings}
        starDimension="20px"
        starSpacing="3px"
        starRatedColor="rgb(255, 162, 0)"
        starEmptyColor="rgb(255, 231, 189)"
      />
    );
  }
}
export default Rating;
