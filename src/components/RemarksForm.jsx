import React, { useState, useEffect, useRef } from "react";
import "../../src/RemarksForm.css"; // Import the CSS file

const RemarksForm = ({ rating, staff, onSubmit }) => {
  const [remarks, setRemarks] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const textAreaRef = useRef(null);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    setIsDisabled(true);
    try {
      await onSubmit(remarks);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <>
      <h2>Any additional remarks?</h2>
      <p>
        You rated{" "}
        <span className="highlight-gold">
          {rating} star{rating > 1 ? "s" : ""}
        </span>{" "}
        for <span className="highlight-gold">{staff}</span>.
      </p>
      <div id="remarksSection">
        <textarea
          ref={textAreaRef}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Optional: Tell us more about your experience..."
        ></textarea>
      </div>
      <button onClick={handleSubmit} disabled={isDisabled}>
        {isDisabled ? (
          <>
            <div className="loader"></div>
            Submitting...
          </>
        ) : (
          "Submit Feedback"
        )}
      </button>
    </>
  );
};

export default RemarksForm;