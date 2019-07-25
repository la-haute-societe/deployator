import { describe, it } from 'mocha';
import { assert } from 'chai';
import fs from 'fs';
import tmp from 'tmp';
import rimraf from 'rimraf';

import initializeConfiguration from '../src/initialize-configuration';
import * as sinon from 'sinon';

describe('Initialize configuration', function () {
    afterEach(function () {
        // Un-stub console.info, if needed
        if (console.info.restore) {
            console.info.restore();
        }
        if (console.warn.restore) {
            console.warn.restore();
        }
    });

    it ('should create the configuration file when given a relative file path', function () {
        const relativeFilePath = '__test__deployator-configuration.js';

        // Create a stub to monitor calls to console.info. Using a stub instead of a spy ensures nothing is written to stdout.
        const consoleInfoStub = sinon.stub(console, 'info');

        // Do the job
        initializeConfiguration(relativeFilePath);

        // Check if the job was done correctly
        assert.isTrue(
            fs.existsSync(relativeFilePath),
            `A new deployator configuration file should have been written to "${relativeFilePath}"`
        );
        assert.isTrue(consoleInfoStub.called, 'console.info() should have been called');
        assert.isTrue(
            consoleInfoStub.calledWith(`✨  Created a boilerplate configuration file at ${relativeFilePath}`),
            `console.info should have been called with "✨  Created a boilerplate configuration file at ${relativeFilePath}"`
        );

        // Clean up
        fs.unlinkSync(relativeFilePath);
    });


    it ('should create the configuration file when given an absolute file path', function () {
        const absoluteFilePath = tmp.tmpNameSync();

        // Do the job
        initializeConfiguration(absoluteFilePath);

        // Check if the job was done correctly
        assert.isTrue(
            fs.existsSync(absoluteFilePath),
            `A new deployator configuration file should have been written to "${absoluteFilePath}"`
        );

        // Clean up
        fs.unlinkSync(absoluteFilePath);
    });


    it ('should create non-existing configuration file parent directories', function () {
        const baseDirectory = tmp.tmpNameSync({ unsafeCleanup: true });
        const absoluteFilePath = `${baseDirectory}/long/path/that/is/unlikely/to/exist/__test__deployator-configuration.js`;

        // Do the job
        initializeConfiguration(absoluteFilePath);

        // Check if the job was done correctly
        assert.isTrue(
            fs.existsSync(absoluteFilePath),
            `A new deployator configuration file should have been written to "${absoluteFilePath}"`
        );

        // Clean up
        rimraf.sync(baseDirectory);
    });


    it ('should not overwrite an existing configuration file', function () {
        const relativeFilePath = '__test__deployator-configuration.js';

        // Create a stub to monitor calls to console.info. Using a stub instead of a spy ensures nothing is written to stdout.
        const consoleWarnStub = sinon.stub(console, 'warn');

        // Create a dummy configuration file to ensure next step fails
        fs.writeFileSync(relativeFilePath, 'module.exports = {};');

        // Do the job
        initializeConfiguration(relativeFilePath);

        // Check if the job was done correctly
        assert.isTrue(consoleWarnStub.calledWith(`File "${relativeFilePath}" exists. Aborting.`),);

        // Clean up
        fs.unlinkSync(relativeFilePath);
    });
});
