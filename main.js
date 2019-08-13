// without Babel in ES2015
const { NFC } = require('nfc-pcsc');
const nfc = new NFC(); // optionally you can pass logger
const StringDecoder = require('string_decoder').StringDecoder;  
const decoder = new StringDecoder('utf8');

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