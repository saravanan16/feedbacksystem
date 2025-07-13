import React from 'react';

const StaffList = ({ rating, staffList, onSelectStaff }) => {
    return (
        <>
            <h2>Who helped you today?</h2>
            <p>
                You selected <span className="highlight-gold">{rating} star{rating > 1 ? 's' : ''}</span>.
            </p>
            <ul className="staff-list">
                {staffList.map((staffName) => (
                    <li
                        key={staffName}
                        className="staff-item"
                        onClick={() => onSelectStaff(staffName)}
                    >
                        {staffName}
                    </li>
                ))}
            </ul>
        </>
    );
};

export default StaffList;