import React, { useState, useEffect } from "react";
import "./App.css";
import StarRating from "./components/StarRating";
import StaffList from "./components/StaffList";
import RemarksForm from "./components/RemarksForm";
import ThankYouMessage from "./components/ThankYouMessage";

// The key for storing the staff list in local storage
const STAFF_STORAGE_KEY = "mck_staffList";

// Default staff list to populate if local storage is empty
const DEFAULT_STAFF = ["Usman", "Deepak", "Rashid", "Raza", "Danish"];

function App() {
  const [page, setPage] = useState("rating"); // 'rating', 'staff', 'remarks', 'thankyou'
  const [staffList, setStaffList] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedStaff, setSelectedStaff] = useState("");

  // On initial load, check for the staff list in local storage.
  // If it's not there, create and save a default list.
  useEffect(() => {
    const storedStaff = localStorage.getItem(STAFF_STORAGE_KEY);
    if (storedStaff) {
      setStaffList(JSON.parse(storedStaff));
    } else {
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(DEFAULT_STAFF));
      setStaffList(DEFAULT_STAFF);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleRatingSelect = (rating) => {
    setSelectedRating(rating);
    setPage("staff");
  };

  const handleStaffSelect = (staffName) => {
    setSelectedStaff(staffName);
    setPage("remarks");
  };

  const handleFeedbackSubmit = async (remarks) => {
  const feedbackData = {
    date: new Date().toISOString(), // ISO string format
    rating: selectedRating,
    staff: selectedStaff,
    remarks: remarks,
  };

  console.log({ feedbackData });

  try {
    const response = await fetch('/.netlify/functions/hello', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [
          feedbackData.date,
          feedbackData.rating,
          feedbackData.staff,
          feedbackData.remarks
        ]
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Error submitting feedback:', result.message);
      alert('Submission failed. Please try again.');
      return;
    }

    console.log('Success:', result.message);
    setPage("thankyou");

  } catch (error) {
    console.error('Network error:', error);
    alert('Network error. Please try again.');
  }
};


  const renderPage = () => {
    switch (page) {
      case "rating":
        return <StarRating onSelectRating={handleRatingSelect} />;
      case "staff":
        return (
          <StaffList
            rating={selectedRating}
            staffList={staffList}
            onSelectStaff={handleStaffSelect}
          />
        );
      case "remarks":
        return (
          <RemarksForm
            rating={selectedRating}
            staff={selectedStaff}
            onSubmit={handleFeedbackSubmit}
          />
        );
      case "thankyou":
        return <ThankYouMessage />;
      default:
        return <StarRating onSelectRating={handleRatingSelect} />;
    }
  };

  return <div className="container">{renderPage()}</div>;
}

export default App;
