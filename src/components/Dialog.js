import React, { useEffect} from 'react';

const Dialog = ({show, onClose}) => {
    useEffect(() => {
        const timer = setTimeout(()=>{
            //nakon 3s pokreni onClose()
            //sto ce setovati prazan string na show, sto je false value
           onClose()
        }, 3000)
        return () => clearTimeout(timer);
    }, [show]);
    
    const style=show?"translateX(1rem)":"translateX(-12rem)"
    return (
        <div 
            className="dialog" 
            style={{transform:`${style}`}} 
            id="dialog">
            <p>{show}</p>
        </div>
    )
    
};

export default Dialog;