import extend         from 'extend';
import process        from 'process';
import path           from 'path';
import fs             from 'fs';
import chalk          from 'chalk';
import columnify      from 'columnify';


/**
 * @param argv {config, debug, synchronize, environment}
 * @param Deployer
 */
export default function (argv, Deployer) {
    if (!argv.config) {
        argv.config = 'deployment-config.js';
    }

    // Load config file
    const rawConfiguration = readConfigurationFile(argv.config, argv);
    const configuration    = mergeConfiguration(rawConfiguration, argv.environment);

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
        deploy:   () => deployer.deployRelease(),
        remove:   () => deployer.removeRelease(),
        rollback: () => deployer.rollbackToPreviousRelease(),
    }
}

/**
 * Return absolute filePath
 * if filePath is not an absolute path, will prepend with process.cwd
 * @param filePath
 * @return {string|*}
 */
function getAbsoluteFilePath(filePath) {
    if (path.isAbsolute(filePath)) {
        return filePath;
    }

    return path.join(process.cwd(), filePath);
}

/**
 * Read configuration file
 * @param filePath
 * @param argv
 * @return {*}
 */
function readConfigurationFile(filePath, argv) {

    const absoluteFilePath = getAbsoluteFilePath(filePath);

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

export function listEnvironments(argv) {
    if (!argv.config) {
        argv.config = 'deployment-config.js';
    }

    const rawConfiguration = readConfigurationFile(argv.config, argv);
    const environmentDescriptions = {};

    for (const environmentName of Object.keys(rawConfiguration.environments)) {
        const configuration = mergeConfiguration(rawConfiguration, environmentName);
        const username = chalk.green(configuration.username);
        const host = chalk.yellow(configuration.host);
        const path = chalk.red(configuration.deployPath);

        environmentDescriptions[environmentName] = `${username}@${host}:${path}`;
    }

    if (Object.keys(environmentDescriptions).length === 0) {
        const configurationFilename = argv.config;
        console.log('There are no environments defined in the configuration file.');
        console.log(chalk`You can add some by editing the {yellow ${configurationFilename}} file.`);

        return;
    }

    console.log('Available environments:');
    console.log(columnify(environmentDescriptions, {
        showHeaders: false,
    }));
}
