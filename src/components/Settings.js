import React from "react";

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
          <label for="ip">IP Addresss</label>
          <input type="text" id="ip" name="ip" autofocus />
        </div>
        <div className="form-group">
          <label for="protocol">Protocol</label>
          <select type="number" id="protocol" name="protocol">
            <option value="23">Telnet</option>
            <option value="22">SSH</option>
          </select>
        </div>
        <div className="form-group">
          <label for="username">Username</label>
          <input type="password" id="username" name="username" maxlength="20" />
        </div>
        <div className="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" maxlength="20" />
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
        style={{ backgroundColor: "tomato" }}
        className="btn save"
      >
        Back
      </a>
      <p>*If the field is blank, the default will be used.</p>
    </form>
  );
};

export default Settings;
