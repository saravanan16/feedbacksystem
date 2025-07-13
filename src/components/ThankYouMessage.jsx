
import React, { useEffect } from 'react';

const ThankYouMessage = () => {

    useEffect(()=>{
        setTimeout(()=>{
            window.location.reload();
        },1500)
    },[]);

    return (
        <div id="finalMessage">
            Thank you for your valuable feedback!
        </div>
    );
};

export default ThankYouMessage;