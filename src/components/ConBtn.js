import React from 'react';

const ConBtn = ({connectionOpen, connect, disConnect}) => {
    return (
        <>
            {connectionOpen?
            <button 
                className="btn btn-positive" 
                onClick={disConnect} 
                id="discntBtn">
                Close
            </button>:
            <button 
                className="btn btn-positive" 
                onClick={connect} 
                id="cntBtn">
                Open
            </button>}
        </>
    );
};

export default ConBtn;