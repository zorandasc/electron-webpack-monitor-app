import React, {useState} from 'react';

const Krug=({value, onClick, colorBor})=>{
    return (
        <div className="svg-wrapper"  onClick={onClick} data-tooltip="CLEAR">
            <svg height="80" width="80" stroke={colorBor} xmlns="http://www.w3.org/2000/svg">
                <circle cx="38" cy="38" r="25" className="shape"  height="166" width="166"></circle>
            </svg>
             <div className="textCircleDown"  id="downMax">{value}</div>
        </div>
    )
}

const Krugovi = (resultDown,resultUp) => {
    const [downMax, setDownMax]=useState(0)
    const [upMax, setUpMax]=useState(0)

    if(resultDown > downMax){
        setDownMax(resultDown)
    }
    if (resultUp > upMax) {
        setUpMax(resultUp)
    }

    function clearMax(direction){
        direction === "down"?
            setDownMax(0):
            setUpMax(0)
    }

    return (
        <div className="krugovi">
            <p className="mjerna">[Mbit/s]</p>
            <p className="max">Max Values.</p>
            <Krug 
                value={downMax.toFixed(2)} 
                onClick={()=>clearMax('down')} 
                colorBor="lightgreen">
            </Krug>
            <Krug 
                value={upMax.toFixed(2)} 
                onClick={()=>clearMax('up')} 
                colorBor="rgb(255, 0, 255)">
            </Krug>    
        </div>
    );
};

export default Krugovi;