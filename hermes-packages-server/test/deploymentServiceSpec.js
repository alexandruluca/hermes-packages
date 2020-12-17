const db = require('../src/api/lib/db');
const {deploymentService, ErrorCode} = require('../src/api/services/deployment');
const {Deployment} = require('./fixtures/deployments');
const {denormalizeVersion} = require('../src/api/util');
const semver = require('semver');

beforeAll(done => {
	db.initializeDatabase().then(done).catch(err => done(err.message));
});

describe('Deployment service test spec', () => {
	it('test env', () => {
		expect(process.env.NODE_ENV).toBe('test');
	});

	it('create same deployment with pr meta', () => {
		let deployment = Deployment.RegularPullRequestDeployment();

		deploymentService.createDeployment(deployment);
		expect(deploymentService.getDeployments().length).toBe(1);
		deploymentService.createDeployment(deployment);
		expect(deploymentService.getDeployments().length).toBe(1);

		deploymentService.deleteDeployments(deployment.name);

		expect(deploymentService.getDeployments().length).toBe(0);

	});

	it('create regular deployment', () => {
		let deployment = Deployment.RegularDeployment();

		deploymentService.createDeployment(deployment);

		try {
			deploymentService.createDeployment(deployment);
			throw new Error('should have thrown error');
		} catch(err) {
			expect(err.code).toBe(ErrorCode.DEPLOYMENT_EXISTS);
		}

		let foundDeployment = deploymentService.getDeployment(deployment);

		expect(foundDeployment).toBeDefined();

		let seedValues = {
			version: deployment.version
		};

		let nextSequence = deploymentService.getNextDeploymentSequences({deploymentName: deployment.name, band: deployment.band, seedValues});

		assertCorrectVersionBump(deployment.version, nextSequence.version);

		seedValues = {
			version: deployment.version
		}

		nextSequence = deploymentService.getNextDeploymentSequences({deploymentName: deployment.name, band: deployment.band, seedValues});

		deployment.version = nextSequence.version;
		deployment.iosCfBundleId = '22';
		deployment.androidVersionCode = '22';

		try {
			deploymentService.createDeployment(deployment);
			throw new Error('should have thrown error');
		} catch(err) {
			expect(err.code).toBe(ErrorCode.DEPLOYMENT_ILLEGAL_STATE);
		}
	})

	it('create regular pull request deployment', () => {
		let deployment = Deployment.RegularPullRequestDeployment();

		deploymentService.createDeployment(deployment);
		deploymentService.createDeployment(deployment); // should not throw error

		let foundDeployment = deploymentService.getDeployment(deployment);

		expect(foundDeployment).toBeDefined();

		let seedValues = {
			version: deployment.version
		};
		let nextSequence = deploymentService.getNextDeploymentSequences({deploymentName: deployment.name, band: deployment.band, seedValues});

		assertCorrectVersionBump(deployment.version, nextSequence.version);

		deployment.version = nextSequence.version;
		deployment.iosCfBundleId = '22';
		deployment.androidVersionCode = '22';

		try {
			deploymentService.createDeployment(deployment);
			throw new Error('should have thrown error');
		} catch(err) {
			expect(err.code).toBe(ErrorCode.DEPLOYMENT_ILLEGAL_STATE);
		}
	})

	it('create mobile-app deployment', () => {
		let deployment = Deployment.MobileAppDeployment();

		deploymentService.createDeployment(deployment);

		try {
			deploymentService.createDeployment(deployment);
			throw new Error('should have thrown error');
		} catch(err) {
			expect(err.code).toBe(ErrorCode.DEPLOYMENT_EXISTS);
		}

		let foundDeployment = deploymentService.getDeployment(deployment);

		expect(foundDeployment).toBeDefined();

		let seedValues = {
			version: deployment.version,
			iosCfBundleId: deployment.iosCfBundleId,
			androidVersionCode: deployment.androidVersionCode
		};

		let nextSequence = deploymentService.getNextDeploymentSequences({deploymentName: deployment.name, band: deployment.band, seedValues});

		[{
			prop: 'version',
			useMajor: false
		}, {
			prop: 'iosCfBundleId',
			useMajor: true
		}, {
			prop: 'androidVersionCode',
			useMajor: true
		}].forEach(({prop, useMajor}) => {
			assertCorrectVersionBump(deployment[prop], nextSequence[prop], useMajor);
		});

		deployment.version = nextSequence.version;
		delete deployment.iosCfBundleId;
		delete deployment.androidVersionCode;

		try {
			deploymentService.createDeployment(deployment);
			throw new Error('should have thrown error');
		} catch(err) {
			expect(err.code).toBe(ErrorCode.DEPLOYMENT_ILLEGAL_STATE);
		}
	})

	it('create pull request mobile-app deployment', () => {
		let deployment = Deployment.MobileAppPullRequestDeployment();

		deploymentService.createDeployment(deployment);

		let foundDeployment = deploymentService.getDeployment(deployment);

		expect(foundDeployment).toBeDefined();

		let seedValues = {
			version: deployment.version,
			iosCfBundleId: deployment.iosCfBundleId,
			androidVersionCode: deployment.androidVersionCode
		}

		let nextSequence = deploymentService.getNextDeploymentSequences({deploymentName: deployment.name, band: deployment.band, seedValues});

		[{
			prop: 'version',
			useMajor: false
		}, {
			prop: 'iosCfBundleId',
			useMajor: true
		}, {
			prop: 'androidVersionCode',
			useMajor: true
		}].forEach(({prop, useMajor}) => {
			assertCorrectVersionBump(deployment[prop], nextSequence[prop], useMajor);
		});

		deployment.version = nextSequence.version;
		delete deployment.iosCfBundleId;
		delete deployment.androidVersionCode;

		try {
			deploymentService.createDeployment(deployment);
			throw new Error('should have thrown error');
		} catch(err) {
			expect(err.code).toBe(ErrorCode.DEPLOYMENT_ILLEGAL_STATE);
		}
	})
});

function assertCorrectVersionBump(versionSeed, bumpedVersion, useMajor) {
	versionSeed = denormalizeVersion(versionSeed);

	if(useMajor) {
		versionSeed = semver.major(versionSeed) + '';
	}

	let patchVersion = parseInt(versionSeed.charAt(versionSeed.length - 1));
	let patchVersionBump = parseInt(bumpedVersion.charAt(bumpedVersion.length - 1));

	expect(patchVersion + 1).toBe(patchVersionBump);
}