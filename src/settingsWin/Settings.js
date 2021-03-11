import React, {useState} from "react";
import { ipcRenderer } from "electron";

import "../static/css/photon.min.css";
import "./settins.css";


 function validateIPaddress(ipaddress) {
    if (
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        ipaddress
      )
    ) {
      return true;
    }
    return false;
  }


const Settings = () => {

  const[ipAdd, setIpAdd]=useState("")
  const [userName, setUserName]=useState("")
  const [passWord, setPassWord]=useState("")
  const [showDialog, setShowDialog]=useState(false)

  function saveFields(ipAdd, userName, passWord){
    console.log(ipAdd, userName, passWord)

    //AKO JE VALIDNOST FALSE SHOW DIALOG
    if(ipAdd && !validateIPaddress(ip.value)){
      console.log("BAD IP")
      setShowDialog(true)
      return
    }
     console.log("GOD IP")
    //setShowDialog(false)
    ipcRenderer.invoke("settings",ipAdd, userName, passWord);
}

  //set everything to default
  function clearFields(){
    setIpAdd("")
    setUserName("")
    setPassWord("")
    setShowDialog(false)
  }

  return (
    <form id="form">
      {showDialog && 
      <div className="dialog" id="dialog">
        <h3>You have entered an invalid IP address!</h3>
        <button 
          type="button" 
          onClick={()=>setShowDialog(false)} 
          id="dialogBtn">
          X
        </button>
      </div>
      }
      
      <div className="container">
        <div className="form-group">
          <label htmlFor="ip">IP Addresss</label>
          <input 
            type="text" 
            id="ip" 
            name="ip" 
            autoFocus 
            value={ipAdd}
            onChange={(e)=>setIpAdd(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="protocol">Protocol</label>
          <select type="number" id="protocol" name="protocol">
            <option value="23">Telnet</option>
            <option value="22">SSH</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input 
            type="password" 
            id="username" 
            name="username" 
            maxLength="20"
            value={userName}
            onChange={(e)=>setUserName(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            maxLength="20"
            value={passWord}
            onChange={(e)=>setPassWord(e.target.value)}
             />
        </div>
      </div>
      <button 
        type="button" 
        onClick={clearFields} 
        className="btn save clear">
        Clear
      </button>
      <a
        href="/?route=default"
        onClick={()=>saveFields(ipAdd, userName, passWord)}
        type="submit"
        className="btn save"
      >
        Save
      </a>
      <p>*If the field is blank, the default will be used.</p>
    </form>
  );
};

export default Settings;
