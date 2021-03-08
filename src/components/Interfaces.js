import React from 'react';
import Interface from "./Interface"

const Interfaces = ({data, selected, setPort}) => {
    
    return (
        <div className="tab-group">
            {data.map((item,i)=>{
                return <Interface 
                    key={i}
                    id={item.id} 
                    label={item.label}
                    img={item.img}
                    isActive={selected==item.id}
                    onClick={()=>setPort(item.id)}
                    ></Interface>
            })}
        </div>
    );
};

export default Interfaces;