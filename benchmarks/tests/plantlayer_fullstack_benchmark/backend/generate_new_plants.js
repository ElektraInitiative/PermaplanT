const fs = require('fs');

function generateRandomHexString(length) {
   return Math.floor(Math.random() * Math.pow(16, length)).toString(16);
}

const fileName = './new_plants.csv';
let fileContent = 'plants\n';

const layerId = 8;

for (let i = 0; i < 5000; i++) {
    const UUIDv4 = [
        generateRandomHexString(8),
        generateRandomHexString(4),
        generateRandomHexString(4),
        generateRandomHexString(4),
        generateRandomHexString(12)
    ].join('-');

    const x = Math.floor(Math.random() * 1000);
    const y = Math.floor(Math.random() * 1000);

    fileContent += `'{"id": "${UUIDv4}","plantId": 5557,"layerId": ${layerId},"x": ${x},"y": ${y},"height": 100,"width": 100,"rotation": 0,"scaleX": 1,"scaleY": 1,"addDate": "2023-07-24"}'\n`;
}

fs.writeFileSync(fileName, fileContent);