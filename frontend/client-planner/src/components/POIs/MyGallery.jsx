import ImageGallery from "react-image-gallery";
import React from "react";
class MyGallery extends React.Component {
  render() {
    return <ImageGallery items={this.props.images} />;
  }
}
export default MyGallery;
