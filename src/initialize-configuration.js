import fs from 'fs';
import process from 'process';
import path from 'path';

export default function (filePath) {

    if (!filePath) {
        filePath = 'deployment-config.js';
    }

    const absoluteFilePath = path.join(process.cwd(), filePath);
    const templateFilePath = path.resolve(__dirname, 'templates/deployator-config.js');

    fs.createReadStream(templateFilePath).pipe(fs.createWriteStream(absoluteFilePath));
}