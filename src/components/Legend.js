import React from 'react';

const Legend = ({setDirection, down,up}) => {
    return (
        <div className="legend">
            <p onClick={()=>setDirection('down')}  id="down">
                Downstream 
                <span className={down?"icon icon-down":"icon icon-down off"} ></span>
            </p>
            <p onClick={()=>setDirection('up')}  id="up">
                Upstream 
                <span className={up?"icon icon-up":"icon icon-up off"}></span>
            </p>
        </div>
    );
};

export default Legend;