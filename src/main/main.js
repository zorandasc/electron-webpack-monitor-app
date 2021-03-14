const { app, BrowserWindow, ipcMain } = require("electron");
import * as path from "path";
import { format as formatUrl } from 'url'

var net = require("net");

//for storing user connection credencialon pc
const settings = require("electron-settings");
// Create an encryptor for encrypt enterd user credencial
var encryptor = require("simple-encryptor")(process.env.ELECTRON_WEBPACK_APP_KEY);

const isDevelopment = process.env.NODE_ENV !== "production";

var win;

//default telnets parameters
var defIp = "192.168.100.1";
var defProt = "23";
var defUser = process.env.ELECTRON_WEBPACK_APP_USER;
var defPass = process.env.ELECTRON_WEBPACK_APP_PASS;

// isConnected koristimo kod citanja client.on("data",
//na pocetku je false pa ocitaj tok konektovanja
//ako je succes onad je true , i onda
//samo preskoci logika citanje stastusa
var isConnected = false;

//return from setInterval()
var dataInterval;

//disable/eneable direction up down
var downDirection = true;
var upDirection = true;

var oldBajtDown = 0;
var oldBajtUp = 0;
var newBajtDown;
var newBajtUp;

var resultBRDown;
var resultBRUp;

//string paterns for exstracting resulting bajts
var transmitString;
var receiveString;

var timeInterval = 3;

var wifiSelected;

var firstReadDown = true;
var firstReadUp = true;

function createWindow() {
  win = new BrowserWindow({
    width: 750,
    height: 570,
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  if (isDevelopment) {
    win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    win.loadURL(
      formatUrl({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true,
      })
    );
  }
  //win.webContents.openDevTools();

  win.on("closed", function () {
    app.quit();
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  clearInterval(dataInterval);
  if (!client.destroyed) {
    client.destroy();
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

var client = new net.Socket();

client.setEncoding("utf8");

// ... do actions on behalf of the Renderer
ipcMain.handle("connect", (event, ...args) => {
  
  var newIp ;
  var newProt;
  var newUser;
  var newPass;
  //first get the stored setting if it has any
  var data=settings.getSync("xxx")
  if(data){
    //AKO POSTOJI SETTINGS.JSOON
    var { strIp, strProto, strUser, strPass } = data;
    //IF EMPTY STING USE DEFAULT
    newIp = strIp?strIp:defIp;
    newProt =strProto?strProto:defProt;
    newUser =strUser?encryptor.decrypt(data.strUser) :defUser;
    newPass =strPass?encryptor.decrypt(data.strPass):defPass;
  }else{
    //IF SETTINGS.JSOON DOESNOT EXIST USE DEFAULT
    newIp = defIp;
    newProt = defProt;
    newUser = defUser;
    newPass = defPass;
  }
 
  //and then try to connect to client
  client.connect(newProt, newIp, () => {
    client.write(`${newUser}\r\n`);
    setTimeout(() => {
      client.write(`${newPass}\r\n`);
      client.setTimeout(0);
    }, 2000);
  });

  //ovo je bitno ako je npr. pogrsna ip adrsesa
  if (client.connecting) {
    win.webContents.send("connect-result", "Conecting....");
    //setuj time out na 9 sekundi =>ovo  ce nas odvesti nakon 9s na ontimeuout listener
    client.setTimeout(9000);
  }
 
});

// ... do actions on behalf of the Renderer
ipcMain.handle("disconnect", (event, ...args) => {
  
  isConnected = false;
  firstReadDown = true;
  firstReadUp = true;

  clearInterval(dataInterval);

  if (!client.destroyed) {
    client.destroy();
  }

  win.webContents.send("connect-result", "Connection closed.");
  win.webContents.send("resultValDown", 0);
  win.webContents.send("resultValUp", 0);
});

// ... do actions on behalf of the Renderer
ipcMain.handle("startGraf", (event, selected, down, up) => {
  //set direction true or flase
  downDirection = down;
  upDirection = up;

  let portNum = Number(selected);

  wifiSelected = portNum;

  firstReadDown = true;
  firstReadUp = true;

  //start new interval reading with choosen portnum
  dataInterval = intervalPortStatistics(portNum);
});

ipcMain.handle("stopGraf", () => {
  //if firstreading true result=0
  firstReadDown = true;
  firstReadUp = true;

  //clear old loop interval
  clearInterval(dataInterval);
  
  win.webContents.send("resultValDown", 0);
  win.webContents.send("resultValUp", 0);
 
});

/*
ipcMain.handle("settings", (event, ip, prot, user, pass) => {
  console.log(ip, prot, user, pass);
});
*/

client.on("error", (arg) => {
  var message = arg.toString().match(/(?<=(:?^|\s)Error:\s).*$/g);
  win.webContents.send("connect-result", message);
  client.destroy();
});

//na svaki interval ocitaj podatke
client.on("data", function (data) {
  //on connecting, if isConnected true skip this if loop
  var data = data.toString();
  if (!isConnected) {
    isConnected = checkConnectStatus(data);
    return;
  }

  //for gettting ssid name, but only at begginig of wifi reading
  if ((firstReadDown || firstReadUp) && wifiSelected == 5) {
    //(:?^|\s)nothing in front, regexp-lookahead-lookbehind <=operater
    //uzmi sve alafnumerice [a-z0-9] iza (:?^|\s)SSID\s\s+:\s) paterna
    var ssidPatern = data.match(/(?<=(:?^|\s)SSID\s\s+:\s)[a-z0-9]+/g);
    if (ssidPatern) {
      win.webContents.send("ssid", ssidPatern[0]);
    }
  }

  //EVERY timeInterval CALCULATE DOWNSTREAM if downDirection false do nothing
  var transm = downDirection && data.match(transmitString);
  //result:  transm= null, null, [ '881213013905' ], null, null
  if (transm) {
    //[ '881213013905' ] Izvadi string i pretvoru u number
    newBajtDown = Number(transm[0]);

    resultBRDown = firstReadDown
      ? 0
      : calculateBitRate(newBajtDown, oldBajtDown);

    oldBajtDown = newBajtDown;

    firstReadDown = false;

    win.webContents.send("resultValDown", resultBRDown);
  }

  //EVERY timeInterval CALCULATE UPSTREAM, if upDirection flase do notihing
  var receiv = upDirection && data.match(receiveString);

  if (receiv) {
    newBajtUp = Number(receiv[0]);

    resultBRUp = firstReadUp ? 0 : calculateBitRate(newBajtUp, oldBajtUp);

    oldBajtUp = newBajtUp;

    firstReadUp = false;

    win.webContents.send("resultValUp", resultBRUp);
  }
});

//cliesnt timeout
client.on("timeout", () => {
  console.log("socket timeout");
  win.webContents.send("connect-result", "Time out. Check host IP address.");
  client.destroy();
});

//clien destroyed
client.on("close", function () {
  console.log("Connection closed");
});

function checkConnectStatus(data) {
  var status = "";
  var connected = false;
  if (data.match(/WAP>/g)) {
    connected = true;
    status = "Connection open.";
  } else if (data.match(/User name or password is wrong/g)) {
    status = "Username or password is wrong.";
  } else {
    status = data.trim();
  }
  win.webContents.send("connect-result", status);
  return connected;
}

function intervalPortStatistics(portNum) {
  //novi nacin ekstraktovanja :
  //https://javascript.info/regexp-lookahead-lookbehind <=operater
  if (portNum === 5) {
    //for wifi
    transmitString = /(?<=TotalBytesSent \s\s+:\s)\d+/g;
    receiveString = /(?<=TotalBytesReceived \s\s+:\s)\d+/g;
    var stringToWrite = `get wlan basic laninst 1 wlaninst 1\r\n`;
  } else {
    //for ethernet
    transmitString = /(?<=tx_byte_ok \s\s+:\s)\d+/g;
    receiveString = /(?<=rx_byte_ok \s\s+:\s)\d+/g;
    var stringToWrite = `display portstatistics portnum ${portNum}\r\n`;
  }
  return setInterval(() => {
    client.write(stringToWrite);
  }, timeInterval * 1000);
}

function calculateBitRate(newBajt, oldBajt) {
  let result = (newBajt - oldBajt) / timeInterval; //BAJTA/s
  result = result * 8; //bits/s
  result = result / 1000 / 1000; //Mbits/s
  return result;
}
