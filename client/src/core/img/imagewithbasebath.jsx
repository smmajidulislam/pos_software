import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { base_path } from "../../environment";
const ImageWithBasePath = (props) => {
  // Combine the base path and the provided src to create the full image source URL
  let fullSrc = "";
  if (props?.isBase) {
    fullSrc = `${props.src}`;
  } else {
    fullSrc = `${base_path}${props.src}`;
  }

  // const fullSrc = `${base_path}${props.src}`;
  return (
    <>
      <img
        className={props?.className}
        src={fullSrc}
        height={props?.height}
        alt={props?.alt || "image"}
        width={props?.width}
      />
    </>
  );
};

// Add PropTypes validation
ImageWithBasePath.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  id: PropTypes.string,
};

export default ImageWithBasePath;
