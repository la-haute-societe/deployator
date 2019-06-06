import fs from 'fs';
import path from 'path';

export default function (newConfigurationFilePath) {
    if (!newConfigurationFilePath) {
        newConfigurationFilePath = 'deployment-config.js';
    }

    if (fs.existsSync(newConfigurationFilePath)) {
        console.warn(`File "${newConfigurationFilePath}" exists. Aborting.`);
        return;
    }

    ensureDirectoryExists(path.dirname(newConfigurationFilePath));

    const templateFilePath = path.resolve(__dirname, 'templates/deployator-config.js');

    fs.createReadStream(templateFilePath).pipe(fs.createWriteStream(newConfigurationFilePath));
    console.info('✨  Created a boilerplate configuration file at ' + newConfigurationFilePath);
}

function ensureDirectoryExists (directory) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
}
