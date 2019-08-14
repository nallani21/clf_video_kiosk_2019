const { app, BrowserWindow } = require('electron')
const { NFC } = require('nfc-pcsc');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

const nfc = new NFC();

nfc.on('reader', reader => {

  // disable auto processing
  reader.autoProcessing = false;

  console.log(`${reader.reader.name}  device attached`);

  reader.on('card', card => {

    // card is object containing following data
    // String standard: TAG_ISO_14443_3 (standard nfc tags like MIFARE Ultralight) or TAG_ISO_14443_4 (Android HCE and others)
    // String type: same as standard
    // Buffer atr

    console.log(`${reader.reader.name}  card inserted`, card);

    win.webContents.send('card-data', `${reader.reader.name}  card inserted`);

    // you can use reader.transmit to send commands and retrieve data
    // see https://github.com/pokusew/nfc-pcsc/blob/master/src/Reader.js#L291

  });
  
  reader.on('card.off', card => { 
    console.log(`${reader.reader.name}  card removed`, card);
  });

  reader.on('error', err => {
    console.log(`${reader.reader.name}  an error occurred`, err);
  });

  reader.on('end', () => {
    console.log(`${reader.reader.name}  device removed`);
  });

});

nfc.on('error', err => {
  console.log('an error occurred', err);
});
