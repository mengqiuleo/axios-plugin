const path = require('path')
const modulePathMap = {
  '@axios-plugin/core': './node_modules/@axios-plugin/core/src/index.ts',
  '@axios-plugin/timeout': './node_modules/@axios-plugin/timeout/src/index.ts',
  // 其他模块
};

module.exports = {
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleNameMapper: Object.fromEntries(
    Object.entries(modulePathMap).map(([moduleName, modulePath]) => [
      `^${moduleName}$`,
      path.resolve(__dirname, modulePath),
    ])
  )
}