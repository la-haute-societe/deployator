# Deployator

> Deploy releases over SSH with rsync, archive ZIP / TAR, symlinks, SCP ...

> The [ssh-deploy-release](https://github.com/la-haute-societe/ssh-deploy-release) command line interface.


## Install

### Locally
``` sh
npm install -D deployator
```

You have to specify the path of the ``deployator`` binary inside the ``node_modules`` folder, example:
``` sh
node_modules/.bin/deployator init ....
```
or add ``deployator`` in the ``scripts`` section of your ``package.json``: 
``` sh
scripts: {
    "deployator": "deployator"
},
```

Use the ``deployator`` like this:
``` sh
npm run deployator -- init --config ...
```

### Globally
``` sh
npm install -g deployator
```

Use the ``deployator`` like this:
``` sh
deployator init --config ...
```



## Usage

### Initialize configuration file
``` sh
deployator init --config path/to/config.js
```

### Deploy release
``` sh
deployator deploy --config path/to/config.js --environment review
```

### Remove release

To use this command, the [``allowRemove`` option](https://github.com/la-haute-societe/ssh-deploy-release#optionsallowremove) must be enabled.

``` sh
deployator remove --config path/to/config.js --environment review
```

### Custom options

All options passed to `deployator` can be read with `options.get('optionName')`.

Example: Deploy to different folder following the git branch 

``` sh
deployator deploy --config path/to/config.js --environment review --branch master
```

In the configuration file:
``` js
{
    environments: {
        review: {
            ...
            deployPath: '/path/to/review/' + options.get('branch'),
            ...
        },
    }
}
```


## Configuration file

> See all the available options on the [ssh-deploy-release documentation](https://github.com/la-haute-societe/ssh-deploy-release).

Example:
``` js
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
```



## Contributing

### Build
``` sh
# Build (with Babel)
npm run build

# Build + watch (with Babel)
npm run build -- --watch
```

### Unit tests
``` sh
# Launch tests (Mocha + SinonJS)
npm test

# Launch tests + watch (Mocha + SinonJS)
npm test -- --watch
```