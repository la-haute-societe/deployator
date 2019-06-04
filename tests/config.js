module.exports = function (options) {

    return {

        common: {
            username: 'root',
            localPath: 'www',
            share: {
                'endpoint-assets': 'endpoint/assets'
            },
        },


        environments: {
            review: {
                host: 'example.test',
                deployPath: '/opt/bitnami/apache2/htdocs/maxime/deployator/' + options.get('branch'),
                allowRemove: true,
                onAfterDeployExecute: (context) => {
                    context.logger.subhead('Reset opcache');
                    return [
                        'cd /var/cachetool && php cachetool.phar opcache:reset --fcgi=/opt/bitnami/php/var/run/www.sock',
                    ];
                }
            },

            preproduction: {
                host: 'preprod.example.com',
                username: 'user',
                deployPath: '/opt/bitnami/apache2/htdocs/maxime/deployator/',
                share: {},
            }

        }
    }
};
