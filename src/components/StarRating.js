import React from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({ rating, onRatingChange }) => {
  const renderStar = (index) => {
    const filled = index <= rating ? "rgb(240, 210, 41)" : "gray";
    return (
      <span
        key={index}
        style={{ color: filled, cursor: "pointer" }}
        onClick={() => onRatingChange(index)}
      >
        <FaStar />
      </span>
    );
  };

  return (
    <div>
      {[...Array(5)].map((_, index) => renderStar(index + 1))}
    </div>
  );
};

export default StarRating;