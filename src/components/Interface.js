import React from 'react';

const Interface = ({id,label, img, onClick, isActive}) => {
    return (
        <div className={isActive?"tab-item active":"tab-item"}   id={id} onClick={onClick}>
            <img className="img-circle media-object" src={img} width="32" height="32"></img>
            <p>{label}</p>
         </div>
    );
};

export default Interface;