import React from 'react';

const TextArea = ({value}) => {
    const {msg, color}=value
    return (
       <textarea 
        className="form-control" 
        id="ta" name="ta" rows="3" cols="10"
        placeholder="Conection Closed."
        style={{color:color}}
        value={msg}
        readOnly >
    </textarea>
    );
};

export default TextArea;