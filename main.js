const { NFC } = require('nfc-pcsc');
const nfc = new NFC(); // optionally you can pass logger
const StringDecoder = require('string_decoder').StringDecoder;  
const decoder = new StringDecoder('utf8');

// Modules to control application life and create native browser window

const {app, BrowserWindow} = require('electron')

const path = require('path')

// Keep a global reference of the window object, if you don't, the window will

// be closed automatically when the JavaScript object is garbage collected.

let mainWindow

function createWindow () {

  // Create the browser window.

  mainWindow = new BrowserWindow({

    width: 800,

    height: 600,

    webPreferences: {

      preload: path.join(__dirname, 'preload.js')

    }

  })



  // and load the index.html of the app.

  mainWindow.loadFile('index.html')



  // Open the DevTools.

  // mainWindow.webContents.openDevTools()



  // Emitted when the window is closed.

  mainWindow.on('closed', function () {

    // Dereference the window object, usually you would store windows

    // in an array if your app supports multi windows, this is the time

    // when you should delete the corresponding element.

    mainWindow = null

  })

}



// This method will be called when Electron has finished

// initialization and is ready to create browser windows.

// Some APIs can only be used after this event occurs.

app.on('ready', createWindow)



// Quit when all windows are closed.

app.on('window-all-closed', function () {

  // On macOS it is common for applications and their menu bar

  // to stay active until the user quits explicitly with Cmd + Q

  if (process.platform !== 'darwin') app.quit()

})



app.on('activate', function () {

  // On macOS it's common to re-create a window in the app when the

  // dock icon is clicked and there are no other windows open.

  if (mainWindow === null) createWindow()

})



// In this file you can include the rest of your app's specific main process

// code. You can also put them in separate files and require them here.

console.log('ready to write')

nfc.on('reader', reader => {

    reader.on('card', async card => {

        reader.autoProcessing = false
        var payload = 0;

        // read protocol
        // example reading 12 bytes assuming containing text in utf8

        try {
        // reader.read(blockNumber, length, blockSize = 4, packetSize = 16)

            const data = await reader.read(4, 12); // starts reading in block 4, continues to 5 and 6 in order to read 12 bytes

            console.log(`data read`, data);

            payload = data.toString(); // utf8 is default encoding

            // console.log(`data converted`, payload);

            console.log(`data current`, parseInt(payload, 10));

        } catch (err) {

            console.error(`error when reading data`, err);

        }

        // write protocol
            
        try {

            const data = Buffer.allocUnsafe(12);

            data.fill(0);

            var text = parseInt(payload, 10) + 1;

            if (text < 10) {

                data.write(text.toString()); // if text is longer than 12 bytes, it will be cut off
                // reader.write(blockNumber, data, blockSize = 4)

            } else {

                data.write("0");

            }

            await reader.write(4, data); // starts writing in block 4, continues to 5 and 6 in order to write 12 bytes
                
            console.log(`data written`);
         
        } catch (err) {

            console.error(`error when writing data`, err);

        }

        // read protocol to check what was written
        // example reading 12 bytes assuming containing text in utf8

        try {
        // reader.read(blockNumber, length, blockSize = 4, packetSize = 16)

            const data = await reader.read(4, 12); // starts reading in block 4, continues to 5 and 6 in order to read 12 bytes

            payload = data.toString(); // utf8 is default encoding

            // console.log(`data converted`, payload);

            console.log(`data updated`, parseInt(payload, 10));

        } catch (err) {

            console.error(`error when reading data`, err);

        }

    })

})