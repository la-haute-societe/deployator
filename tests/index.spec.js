import { describe, it } from 'mocha';
import { assert } from 'chai';
import extend from 'extend';

import deployator from '../src/deployator';
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
                }
            };
        }

        return configuration => {
            return stubs;
        };
    }


    it('should not throw exception when configuration file exists', function () {
        assert.doesNotThrow(
            () => {
                deployator(
                    createRequiredOptions(),
                    createFakeDeployer()
                )
            }
        );
    });

    it('should throw exception when configuration file not exists', function () {
        assert.throw(
            () => {
                deployator(
                    extend(createRequiredOptions(), {
                        config: 'file/that/does/not/exist/at/all.js',
                    }),
                    createFakeDeployer()
                )
            }
        );
    });

    it('should throw exception when environment not exists', function () {
        assert.throw(
            () => {
                deployator(
                    extend(createRequiredOptions(), {
                        environment: 'weirdoEnvironmentName',
                    }),
                    createFakeDeployer()
                );
            }
        );
    });

    it('should call deployRelease and not removeRelease ', function () {

        let stubs               = {
            deployRelease: () => {
            },
            removeRelease: () => {
            }
        };
        let fakeDeployer        = createFakeDeployer(stubs);
        const stubDeployRelease = sinon.spy(stubs, 'deployRelease');
        const stubRemoveRelease = sinon.spy(stubs, 'removeRelease');

        deployator(
            createRequiredOptions(),
            fakeDeployer
        );

        assert(stubDeployRelease.called);
        assert(stubRemoveRelease.notCalled);
    });

    it('should call removeRelease and not deployRelease', function () {

        let stubs               = {
            deployRelease: () => {
            },
            removeRelease: () => {
            }
        };
        let fakeDeployer        = createFakeDeployer(stubs);
        const stubDeployRelease = sinon.spy(stubs, 'deployRelease');
        const stubRemoveRelease = sinon.spy(stubs, 'removeRelease');

        deployator(
            extend(createRequiredOptions(), {
                remove: true
            }),
            fakeDeployer
        );

        assert(stubDeployRelease.notCalled);
        assert(stubRemoveRelease.called);
    });


    it('should enable debug option', function () {

        let fakeDeployer = createFakeDeployer();
        const spy        = sinon.spy(fakeDeployer);

        deployator(
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

        deployator(
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

        deployator(
            extend(createRequiredOptions(), {
                environment: 'preproduction'
            }),
            spy
        );

        let expectedConfiguration = {
            localPath: 'www',
            share: {},
            deployPath: '/opt/bitnami/apache2/htdocs/maxime/deployator/'
        };
        assert.deepEqual(spy.getCall(0).args[0], expectedConfiguration);
    });

})
;




