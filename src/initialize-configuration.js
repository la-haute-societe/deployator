import fs from 'fs';
import process from 'process';
import path from 'path';

export default function (newConfigurationFilePath) {

    if (!newConfigurationFilePath) {
        newConfigurationFilePath = 'deployment-config.js';
    }

    const templateFilePath = path.resolve(__dirname, 'templates/deployator-config.js');

    fs.createReadStream(templateFilePath).pipe(fs.createWriteStream(newConfigurationFilePath));
    console.info('✨  Created a boilerplate configuration file at ' + newConfigurationFilePath);
}
