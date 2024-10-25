import path from "path"

const modulePathMap = {
  '@axios-plugin/core': 'packages/core/src/index.ts',
};

export default {
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleNameMapper: Object.fromEntries(
    Object.entries(modulePathMap).map(([moduleName, modulePath]) => {
      return [
        `^${moduleName}$`,
        path.resolve(process.cwd(), modulePath),
      ]
    })
  ),
  collectCoverage: true, // 统计覆盖率
  coverageDirectory: 'coverage', // 覆盖率结果输出的文件夹
  testMatch: ['<rootDir>/packages/**/__tests__/**/*.{js,jsx,ts,tsx}'],
  coverageThreshold: {
    // 所有文件总的覆盖率要求
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    }
  }
}