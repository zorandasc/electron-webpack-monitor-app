import React from "react";

import "../static/css/photon.min.css";
import "./settins.css";

function closeDialog() {}
function clearFields() {}

const Settings = () => {

  return (
    <form id="form">
      <div className="dialog" id="dialog">
        <h3>You have entered an invalid IP address!</h3>
        <button type="button" onClick={closeDialog} id="dialogBtn">
          X
        </button>
      </div>
      <div className="container">
        <div className="form-group">
          <label htmlFor="ip">IP Addresss</label>
          <input type="text" id="ip" name="ip" autoFocus />
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
          <input type="password" id="username" name="username" maxLength="20" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" maxLength="20" />
        </div>
      </div>
      <button type="button" onClick={clearFields} className="btn  save clear">
        Clear
      </button>
      <button type="submit" className="btn save">
        Save
      </button>
      <a
        href="/?route=default"
        type="button"
        className="btn save"
      >
        Back
      </a>
      <p>*If the field is blank, the default will be used.</p>
    </form>
  );
};

export default Settings;
