import React, { useState, useEffect, useRef } from "react";

const RemarksForm = ({ rating, staff, onSubmit }) => {
  const [remarks, setRemarks] = useState("");
  const textAreaRef = useRef(null);

  // Focus the textarea when the component mounts
  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    onSubmit(remarks);
  };


  

  // ... (the rest of your App.js code remains the same)

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
      <button onClick={handleSubmit}>Submit Feedback</button>
    </>
  );
};

export default RemarksForm;
