# Deployator

[![NPM version](https://badge.fury.io/js/deployator.svg)](https://badge.fury.io/js/deployator)

> Deploy releases over SSH with rsync, archive ZIP / TAR, symlinks, SCP ...

> The [ssh-deploy-release](https://github.com/la-haute-societe/ssh-deploy-release) command line interface.


Example of directory tree after deployment on your server :

````
/deployPath
    |
    ├── www --> symlink to ./releases/<currentRelease>  -- It's the webroot
    |
    ├── releases
    |   ├── 2017-02-08-17-14-21-867-UTC
    |   ├── ...
    |   └── 2017-02-09-18-01-10-765-UTC
    |       ├── ...
    |       └── logs --> symlink to shared/logs
    |
    ├── synchronized --> folder synchronized with rsync 
    |
    └── shared
        └── logs                    
````


- [Installation](#installation)
- [Usage](#usage)
- [Configuration file](#configuration-file)
- [Custom parameters](#custom-parameters)
- [Contributing](#contributing)




## Installation

According to the installation method, __locally__ or __globally__, the path to the 
``deployator`` will be different:

### Locally

````sh
npm install -D deployator
````

You have to specify the path of the `deployator` binary inside the ``node_modules`` folder, example:
````sh
node_modules/.bin/deployator init ....
````
or add ``deployator`` in the ``scripts`` section of your ``package.json``: 
````sh
scripts: {
    "deployator": "deployator"
},
````

Use the ``deployator`` like this:
````sh
npm run deployator -- init --config ...
````

### Globally
````sh
npm install -g deployator
````

Use the ``deployator`` like this:
````sh
deployator init --config ...
````



## Usage

> In the following examples, let's assume that you installed deployator globally. If you installed it locally, you'll need to adjust the path. See [above](#locally)


### Initialize configuration file

````sh
  deployator init [--config]

Options:
  --config, -c       Path of configuration file
````

This command will create a new configuration file in the current folder.

By default, the file will be named ``deployment-config.js`` but it is possible to change it with the parameter ``config``

````sh
deployator init --config path/to/another-config-file-name.js
````

### Deploy release


````sh
  deployator deploy [--config] [--environment] [--debug] [--synchronize]
  
Options:
  --config, -c       Path of configuration file
  --environment, -e  Environment name (example: review, preproduction)
  --debug, -d        Enable debug mode
  --synchronize, -s  Enable synchronize mode
````

This command will deploy a new release using the configuration contained in  ``deployment-config.js`` file.
You must specify the parameter ``environment`` to indicate on which environment the release should be deployed.

````sh
deployator deploy --environment review
````

You could specify another confguration file with the ``config`` parameter.

````sh
deployator deploy --config path/to/config.js --environment review
````


### Remove release

````sh
  deployator remove [--config] [--environment] [--debug]

Options:
  --config, -c       Path of configuration file
  --environment, -e  Environment name (example: review, preproduction)
  --debug, -d        Enable debug mode
````

To use this command, the [``allowRemove`` option](https://github.com/la-haute-societe/ssh-deploy-release#optionsallowremove) must be enabled.

````sh
deployator remove --environment review
````

Again, you could specify another confguration file with the ``config`` parameter, like with the ``deploy`` command.


### Rollback to previous release

````sh
  deployator rollback [--config] [--environment] [--debug]

Options:
  --config, -c       Path of configuration file
  --environment, -e  Environment name (example: review, preproduction)
  --debug, -d        Enable debug mode
````

This command will rollback to the previous release on the specified environment.

The previous release will be renamed before updating the symlink of the current version, for example 2019-01-09-10-53-35-265-UTC will become 2019-01-09-13-46-45-457-UTC_rollback-to_2019-01-09-10-53-35-265-UTC.

If this command is called several times, the current version will switch between the last two releases. current date + "_rollbackTo_" will be prepended to the release name on each call of this command so be careful not to exceed the size limit of the folder name.

````sh
deployator rollback --environment review
````


### List available environments

````sh
  deployator list [--config]

Options:
  --config, -c       Path of configuration file
````

This command displays the list of environments available in the configuration file.


## Configuration file

> See all the available options on the [ssh-deploy-release documentation](https://github.com/la-haute-societe/ssh-deploy-release).

Example:
````js
module.exports = function (options) {

    // @see https://www.npmjs.com/package/ssh-deploy-release

    return {

        // Common configuration
        // These options will be merged with those specific to the environment
        common: {
            localPath: 'www',
            share: {},
            exclude: [],
            create: []
        },


        // Environment specific configuration
        environments: {

            review: {
                host: 'my.server.com',
                username: 'username',
                password: 'password',
                deployPath: '/path/to/review/' + options.get('branch'),
                allowRemove: true,
            },

            preproduction: {
                host: 'my.server.com',
                username: 'username',
                password: 'password',
                deployPath: '/path/to',
            },

            production: {
                host: 'my.server.com',
                username: 'username',
                password: 'password',
                deployPath: '/path/to',
            }

        }
    }
};
````


## Custom parameters

All parameters passed to `deployator` can be read with `options.get('optionName')`.

Example: Deploy to different folder following the git branch 

````sh
deployator deploy --config ... --branch master
````

In the configuration file:
````js
{
    environments: {
        review: {
            ...
            deployPath: '/path/to/review/' + options.get('branch'),
            ...
        },
    }
}
````




## Contributing

### Build
````sh
# Build (with Babel)
npm run build

# Build + watch (with Babel)
npm run build -- --watch
````

### Unit tests
````sh
# Launch tests (Mocha + SinonJS)
npm test

# Launch tests + watch (Mocha + SinonJS)
npm test -- --watch
````
