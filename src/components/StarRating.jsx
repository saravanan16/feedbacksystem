import React, { useState } from 'react';

const StarRating = ({ onSelectRating }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const handleStarClick = (value) => {
        setRating(value);
    };

    const handleNextClick = () => {
        if (rating > 0) {
            onSelectRating(rating);
        } else {
            alert('Please select a star rating before proceeding.');
        }
    }

    return (
        <>
            <h2>How would you rate your experience?</h2>
            <div className="stars">
                {[1, 2, 3, 4, 5].map((starValue) => (
                    <span
                        key={starValue}
                        className={`star ${starValue <= (hoverRating || rating) ? 'selected' : ''}`}
                        data-value={starValue}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => handleStarClick(starValue)}
                    >
                        &#9733;
                    </span>
                ))}
            </div>
            {rating > 0 && <button onClick={handleNextClick}>Next</button>}
        </>
    );
};

export default StarRating;