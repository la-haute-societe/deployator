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