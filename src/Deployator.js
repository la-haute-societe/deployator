import extend from 'extend';
import process from 'process';
import path from 'path';
import fs from 'fs';


/**
 * @param argv {config, debug, synchronize, environment}
 * @param Deployer
 */
export default function (argv, Deployer) {
    // Load config file
    const rawConfiguration = readConfigurationFile(argv.config, argv);
    const configuration    = mergeConfiguration(rawConfiguration, argv.environment);
    console.log(configuration);

    if (argv.synchronize) {
        configuration.mode = 'synchronize';
    }

    // Show debug
    if (argv.debug) {
        configuration.debug = true;
    }

    // Deploy
    const deployer = new Deployer(configuration);

    // Return public API
    return {
        deploy: () => deployer.deployRelease(),
        remove: () => deployer.removeRelease(),
    }
}

/**
 * Read configuration file
 * @param filePath
 * @param argv
 * @return {*}
 */
function readConfigurationFile(filePath, argv) {

    const absoluteFilePath = path.join(process.cwd(), filePath);

    if (!fs.existsSync(absoluteFilePath)) {
        throw 'Configuration file not found "' + absoluteFilePath + '"';
    }

    const rawConfiguration = require(absoluteFilePath)({get: key => argv[key]});

    return extend(
        {
            common: {},
            environments: {}
        },
        rawConfiguration
    );
}

/**
 * Merge common and environment configuration
 * @param rawConfiguration
 * @param environment
 * @return {}
 */
function mergeConfiguration(rawConfiguration, environment) {

    if (!rawConfiguration.environments[environment]) {
        throw 'Environment "' + environment + '" not found in configuration';
    }

    return extend({}, rawConfiguration.common, rawConfiguration.environments[environment]);
}