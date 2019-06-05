#!/usr/bin/env node

import Deployator, { listEnvironments } from './Deployator';
import Deployer from 'ssh-deploy-release';
import yargs from 'yargs';
import initializeConfiguration from './initialize-configuration';

const argv = yargs
    .command({
        command: 'list [--config]',
        desc: 'List available environments',
        handler: (argv) => {
          listEnvironments(argv);
        }
    })
    .command({
        command: 'deploy [--config] [--environment] [--debug] [--synchronize]',
        desc: 'Deploy release to the remote server',
        handler: (argv) => {
            const deployator = new Deployator(argv, Deployer);
            deployator.deploy();
        }
    })
    .command({
        command: 'remove [--config] [--environment] [--debug]',
        desc: 'Deploy release to the remote server',
        handler: (argv) => {
            const deployator = new Deployator(argv, Deployer);
            deployator.remove();
        }
    })
    .command({
        command: 'rollback [--config] [--environment] [--debug]',
        desc: 'Rollback to the previous release',
        handler: (argv) => {
          const deployator = new Deployator(argv, Deployer);
          deployator.rollback();
        }
    })
    .command({
        command: 'init [--config]',
        desc: 'Initialize configuration file',
        handler: (argv) => {
            initializeConfiguration(argv.config);
        }
    })
    .demandCommand()
    .option('config', {
        alias: 'c',
        describe: 'path of configuration file',
    })
    .option('environment', {
        alias: 'e',
        describe: 'environment name (example: review, preproduction)',
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
    .help()
    .showHelpOnFail()
    .argv;
