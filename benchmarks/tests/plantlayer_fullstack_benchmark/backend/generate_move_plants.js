const fs = require('fs');

const fileName = './move_plants.csv';
let fileContent = 'moves\n';

for (let i = 0; i < 5000; i++) {
    const x = Math.floor(Math.random() * 1000);
    const y = Math.floor(Math.random() * 1000);

    fileContent += `'{"Move", content: {x: ${x}, y: ${y}}'\n`;
}

fs.writeFileSync(fileName, fileContent);