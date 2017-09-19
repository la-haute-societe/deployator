#!/usr/bin/env node

import deployator from './deployator';
import Deployer from 'ssh-deploy-release';

const argv = require('yargs')
    .option('config', {
        alias: 'c',
        describe: 'path of configuration file',
        demandOption: true,
        requiresArg: true
    })
    .option('environment', {
        alias: 'e',
        describe: 'environment name (example: review, preproduction)',
        demandOption: true,
        requiresArg: true
    })
    .option('debug', {
        alias: 'd',
        describe: 'Enable debug mode',
        boolean: true,
    })
    .option('synchronize', {
        alias: 's',
        describe: 'Enable synchronize mode',
        boolean: true,
    })
    .option('remove', {
        describe: 'remove the release instead of deploying it ("allowRemove" option must be enable in configuration file)',
        boolean: true,
    })
    .help()
    .showHelpOnFail()
    .argv;

deployator(argv, Deployer);


// // Check arguments
// if (!argv.environment) {
//     throw new Error('Provide --environment argument');
// }
// if (argv.environment === 'review' && !argv.branch) {
//     throw new Error('Provide --branch argument');
// }
//
//
// // Configuration
// const commonConfig = {
//     localPath: 'www',
//     share: {
//         'endpoint-assets': 'endpoint/assets'
//     },
// };
//
// // Reset opcache on lamp.lahautesociete.int
// const preprodLahautesocieteOnAfterDeployExecute = (context) => {
//     context.logger.subhead('Reset opcache');
//     return [
//         'cd /var/cachetool && php cachetool.phar opcache:reset --fcgi=/opt/bitnami/php/var/run/www.sock',
//     ];
// };
//
// const environmentConfig = {
//     review: {
//         host: 'lamp.lahautesociete.int',
//         username: 'bitnami',
//         password: 'QSD1234qsd',
//         deployPath: '/opt/bitnami/apache2/htdocs/lhs/poc-whisky/' + argv.branch,
//         allowRemove: true,
//         onAfterDeployExecute: preprodLahautesocieteOnAfterDeployExecute,
//     },
//     preproduction: {
//         host: 'lamp.lahautesociete.int',
//         username: 'bitnami',
//         password: 'QSD1234qsd',
//         deployPath: '/opt/bitnami/apache2/htdocs/lhs/poc-whisky/preproduction',
//         onAfterDeployExecute: preprodLahautesocieteOnAfterDeployExecute,
//     },
//     // production: {
//     //     host: '62.73.4.217',
//     //     username: 'modular',
//     //     password: 'v7a8p8cJzWbtejaAKfSy',
//     //     deployPath: '/var/www/vhosts/modular.salomon.com/httpdocs',
//     // }
// };
//
// const options = extend({}, commonConfig, environmentConfig[argv.environment]);
//
//
// // Use synchronize mode ?
// if (argv.synchronize) {
//     options.mode = 'synchronize';
// }
//
// // Show debug
// if (argv.debug) {
//     options.debug = true;
// }
//
//
// // Deploy
// const deployer = new Deployer(options);
//
// if (argv.remove) {
//     deployer.removeRelease();
// }
// else {
//     deployer.deployRelease();
// }
