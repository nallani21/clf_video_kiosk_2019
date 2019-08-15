const { NFC } = require('nfc-pcsc');
const nfc = new NFC(); // optionally you can pass logger
const StringDecoder = require('string_decoder').StringDecoder;  
const decoder = new StringDecoder('utf8');
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
console.log('ready to write')
//document.querySelector(".nfc-data").innerText = "waiting to be read"

var videoElement = document.getElementsByTagName("video")[0];
var videoSource = document.createElement('source');

videoSource.setAttribute('src', 'clf-default.mp4');
        
videoElement.appendChild(videoSource);
videoElement.load();
videoElement.play();

nfc.on('reader', reader => {

    reader.on('card', async card => {

        // random video player logic 

        var videoNames = ["Station-1/Station-1-1.mp4", "Station-1/Station-1-2.mp4", "Station-1/Station-1-3.mp4", "Station-2/Station-2-1.mp4", "Station-2/Station-2-2.mp4", "Station-2/Station-2-3.mp4"];
        var temp = videoNames[Math.floor(Math.random() * videoNames.length)];
        console.log(temp);
        var videoSourceURL = './videos/' + temp;
        console.log(videoSourceURL);
        videoSource.setAttribute('src', videoSourceURL);
        
        videoElement.appendChild(videoSource);
        videoElement.load();
        videoElement.play();

        reader.autoProcessing = false
        var payload = 0;

        // read protocol
        // example reading 12 bytes assuming containing text in utf8

        // try {
        // // reader.read(blockNumber, length, blockSize = 4, packetSize = 16)

        //     const data = await reader.read(4, 12); // starts reading in block 4, continues to 5 and 6 in order to read 12 bytes

        //     console.log(`data read`, data);

        //     payload = data.toString(); // utf8 is default encoding

        //     // console.log(`data converted`, payload);
        //     console.log(`data current`, parseInt(payload, 10));

        // } catch (err) {

        //     console.error(`error when reading data`, err);

        // }

        // // write protocol
            
        // try {

        //     const data = Buffer.allocUnsafe(12);

        //     data.fill(0);

        //     var text = parseInt(payload, 10) + 1;

        //     if (text < 10) {

        //         data.write(text.toString()); // if text is longer than 12 bytes, it will be cut off
        //         // reader.write(blockNumber, data, blockSize = 4)

        //     } else {

        //         data.write("0");

        //     }

        //     await reader.write(4, data); // starts writing in block 4, continues to 5 and 6 in order to write 12 bytes
                
        //     console.log(`data written`);
         
        // } catch (err) {

        //     console.error(`error when writing data`, err);

        // }

        // // read protocol to check what was written
        // // example reading 12 bytes assuming containing text in utf8

        // try {
        // // reader.read(blockNumber, length, blockSize = 4, packetSize = 16)

        //     const data = await reader.read(4, 12); // starts reading in block 4, continues to 5 and 6 in order to read 12 bytes

        //     payload = data.toString(); // utf8 is default encoding

        //     // console.log(`data converted`, payload);

        //     console.log(`data updated`, parseInt(payload, 10));

        // } catch (err) {

        //     console.error(`error when reading data`, err);

        // }

    })

})