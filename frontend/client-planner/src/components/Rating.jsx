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
        starRatedColor="rgb(255, 133, 222)"
        starEmptyColor="rgb(255, 235, 254)"
      />
    );
  }
}
export default Rating;
