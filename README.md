# Deployator

> The [ssh-deploy-release](https://github.com/la-haute-societe/ssh-deploy-release) command line interface.

## Install

```
npm install deployator
```

## Usage



### Initialize configuration file
```
deployator init --config path/to/config.js
```

### Deploy release
```
deployator deploy --config path/to/config.js --environment review
```

### Remove release
```
deployator remove --config path/to/config.js --environment review
```


## Contributing

```
# Build (with Babel)
npm run build

# Build + watch (with Babel)
npm run build -- --watch

# Launch tests (Mocha + SinonJS)
npm test

# Launch tests + watch (Mocha + SinonJS)
npm test -- --watch
```