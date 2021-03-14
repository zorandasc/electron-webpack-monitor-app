import React, { useState, useEffect } from "react";
const settings = require("electron-settings");

var key = process.env.ELECTRON_WEBPACK_APP_KEY;
var encryptor = require("simple-encryptor")(key);

//gdije se cuvajua seting podaci na korisnikoj opremi
//console.log("File used for Persisting Data - " + settings.file());

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

const Settings = ({ onClick }) => {
  const [ip, setIp] = useState("");
  const [prot, setProt] = useState(23);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    //za dobijenja settings podataka nakon
    //pojavljivanja html setting windowa
    settings
      .get("xxx")
      .then((data) => {
        setIp(data.strIp ? data.strIp : "");
        setProt(data.strProt);
        setUser(data.strUser ? encryptor.decrypt(data.strUser) : "");
        setPass(data.strPass ? encryptor.decrypt(data.strPass) : "");
      })
      .catch(() => {
        //ako nema setting.json objekta
        // postavi sve na default
        clearFields();
      });
  }, []);

  //funkcija koja se poziva tokom sejviranja
  function handleSubmit(e) {
    //e.preventDefault();

    //AKO postoji i ako JE VALIDNOST FALSE SHOW DIALOG
    if (ip && !validateIPaddress(ip)) {
      setShowDialog(true);
      return;
    }
    //ako je passwor epmty field, do nothing
    //a ako postoji encrytpuj

    //izabran je setSYnc tako da se prvo to
    //izvrsi prije dole closing windowa
    settings.setSync("xxx", {
      strIp: ip,
      strProt: prot,
      strUser: user ? encryptor.encrypt(user) : "",
      strPass: pass ? encryptor.encrypt(pass) : "",
    });
    //validation passed go back, onclik from parrent
    onClick();
  }

  //set everything to default
  function clearFields() {
    setIp("");
    setProt(23);
    setUser("");
    setPass("");
    setShowDialog(false);
  }

  return (
    <div className="container">
      <form id="form">
        {showDialog && (
          <div className="dialog" id="dialog">
            <h3>You have entered an invalid IP address!</h3>
            <button
              type="button"
              onClick={() => setShowDialog(false)}
              id="dialogBtn"
            >
              X
            </button>
          </div>
        )}

        <div className="credencel">
          <div className="form-group">
            <label htmlFor="ip">IP Addresss</label>
            <input
              type="text"
              id="ip"
              name="ip"
              autoFocus
              value={ip}
              onChange={(e) => setIp(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="protocol">Protocol</label>
            <select
              type="number"
              id="protocol"
              name="protocol"
              value={prot}
              onChange={(e) => setProt(e.target.value)}
            >
              <option value="23">Telnet</option>
              <option value="22" disabled>
                SSH
              </option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="password"
              id="username"
              name="username"
              maxLength="20"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              maxLength="20"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
        </div>
        <button type="button" onClick={clearFields} className="btn save clear">
          Clear
        </button>

        <a
          //ako postoji dialog ne idi nigdje
          //href={showDialog ? null : "/?route=default"}
          onClick={handleSubmit}
          type="submit"
          className="btn save"
        >
          Save
        </a>
        <p>*If the field is blank, the default will be used.</p>
      </form>
    </div>
  );
};

export default Settings;
