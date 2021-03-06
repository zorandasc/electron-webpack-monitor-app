import React, { useState } from 'react';

const ConBtn = ({connect, disConnect}) => {
    //toggle betwen two button not regarding
    //connect state
    //odnosn kakvo god da je stanje poslije start connect
    //prebaci u diconect for cleanning mess
    const [toggleBtn, setToggleBtn]=useState(false)
    return (
        <>
            {toggleBtn?
            <button 
                className="btn btn-positive" 
                //toggluj btn bez obzira na connection status
                //omogucuje cleaning up
                onClick={()=>{setToggleBtn(!toggleBtn); disConnect()}} 
                id="discntBtn">
                Close
            </button>:
            <button 
                className="btn btn-positive" 
                onClick={()=>{setToggleBtn(!toggleBtn); connect()}} 
                id="cntBtn">
                Open
            </button>}
        </>
    );
};

export default ConBtn;