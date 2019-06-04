import { describe, it } from 'mocha';
import { assert } from 'chai';
import extend from 'extend';
import path from 'path';

import Deployator, { listEnvironments } from '../src/Deployator';
import * as sinon from 'sinon';


describe('Index', function () {

    function createRequiredOptions() {
        return {

            config: 'tests/config.js',
            environment: 'review',
        };
    }

    function createFakeDeployer(stubs) {

        if (!stubs) {
            stubs = {
                deployRelease: () => {
                },
                removeRelease: () => {
                },
                rollbackToPreviousRelease: () => {
                }
            };
        }

        return function (configuration) {
            return stubs;
        };
    }


    it('should not throw exception when configuration file exists', function () {
        assert.doesNotThrow(
            () => {
                new Deployator(
                    createRequiredOptions(),
                    createFakeDeployer()
                )
            }
        );
    });

    it('should throw exception when configuration file not exists', function () {
        assert.throw(
            () => {
                new Deployator(
                    extend(createRequiredOptions(), {
                        config: 'file/that/does/not/exist/at/all.js',
                    }),
                    createFakeDeployer()
                )
            }
        );
    });

    it('should not throw exception when configuration file path is absolute and exists', function () {
        assert.doesNotThrow(
            () => {
                new Deployator(
                    extend(createRequiredOptions(), {
                        config: path.join(path.dirname(__filename), 'config.js'),
                    }),
                    createFakeDeployer()
                )
            }
        );
    });

    it('should throw exception when configuration file path is absolute and not exists', function () {
        assert.throw(
            () => {
                new Deployator(
                    extend(createRequiredOptions(), {
                        config: path.join(path.dirname(__filename), 'file/that/does/not/exist/at/all.js'),
                    }),
                    createFakeDeployer()
                )
            }
        );
    });

    it('should throw exception when environment not exists', function () {
        assert.throw(
            () => {
                new Deployator(
                    extend(createRequiredOptions(), {
                        environment: 'weirdoEnvironmentName',
                    }),
                    createFakeDeployer()
                );
            }
        );
    });

    it('should call deployRelease', function () {

        let stubs               = {
            deployRelease: () => {
            },
            removeRelease: () => {
            },
            rollbackToPreviousRelease: () => {
            }
        };
        let fakeDeployer        = createFakeDeployer(stubs);
        const stubDeployRelease = sinon.spy(stubs, 'deployRelease');

        const deployator = new Deployator(
            createRequiredOptions(),
            fakeDeployer
        );
        deployator.deploy();

        assert(stubDeployRelease.called);
    });

    it('should call removeRelease', function () {

        let stubs               = {
            deployRelease: () => {
            },
            removeRelease: () => {
            },
            rollbackToPreviousRelease: () => {
            }
        };
        let fakeDeployer        = createFakeDeployer(stubs);
        const stubRemoveRelease = sinon.spy(stubs, 'removeRelease');

        const deployator = new Deployator(
            extend(createRequiredOptions(), {
                remove: true
            }),
            fakeDeployer
        );
        deployator.remove();

        assert(stubRemoveRelease.called);
    });

    it('should call rollbackToPreviousRelease', function () {

        let stubs               = {
            deployRelease: () => {
            },
            removeRelease: () => {
            },
            rollbackToPreviousRelease: () => {
            }
        };
        let fakeDeployer        = createFakeDeployer(stubs);
        const stubRollbackToPreviousRelease = sinon.spy(stubs, 'rollbackToPreviousRelease');

        const deployator = new Deployator(
            extend(createRequiredOptions(), {
                remove: true
            }),
            fakeDeployer
        );
        deployator.rollback();

        assert(stubRollbackToPreviousRelease.called);
    });


    it('should enable debug option', function () {

        let fakeDeployer = createFakeDeployer();
        const spy        = sinon.spy(fakeDeployer);

        new Deployator(
            extend(createRequiredOptions(), {
                debug: true
            }),
            spy
        );

        assert(spy.getCall(0).args[0].debug);
    });

    it('should enable synchronize mode', function () {

        let fakeDeployer = createFakeDeployer();
        const spy        = sinon.spy(fakeDeployer);

        new Deployator(
            extend(createRequiredOptions(), {
                synchronize: true
            }),
            spy
        );

        assert.equal(spy.getCall(0).args[0].mode, 'synchronize');
    });

    it('should merge common and environment configuration', function () {

        let fakeDeployer = createFakeDeployer();
        const spy        = sinon.spy(fakeDeployer);

        new Deployator(
            extend(createRequiredOptions(), {
                environment: 'preproduction'
            }),
            spy
        );

        let expectedConfiguration = {
            localPath: 'www',
            share: {},
            deployPath: '/opt/bitnami/apache2/htdocs/maxime/deployator/',
            host: 'preprod.example.com',
            username: 'user',
        };
        assert.deepEqual(spy.getCall(0).args[0], expectedConfiguration);
    });

    it('should display a list of environments defined in the configuration file', function () {

        const argv = { config: path.join(path.dirname(__filename), 'config.js') };
        const spy = sinon.spy(console, 'log');

        listEnvironments(argv);

        assert.equal(spy.getCall(0).args[0], 'Available environments:');
        assert.equal(spy.getCall(1).args[0], 'review        \u001b[32mroot\u001b[39m@\u001b[33mexample.test\u001b[39m:\u001b[31m/opt/bitnami/apache2/htdocs/maxime/deployator/undefined\u001b[39m\npreproduction \u001b[32muser\u001b[39m@\u001b[33mpreprod.example.com\u001b[39m:\u001b[31m/opt/bitnami/apache2/htdocs/maxime/deployator/\u001b[39m  ');
    });
})
;




