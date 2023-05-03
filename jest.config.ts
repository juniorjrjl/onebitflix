import type {Config} from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
    verbose: true,
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    setupFiles: ['<rootDir>/test/setup.ts'],
    testEnvironment: 'node',
    maxWorkers: 1,
    preset: 'ts-jest',
    collectCoverage: true,
    coverageReporters: ['json', 'html']
};
export default config;