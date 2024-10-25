const path = require('path')
const modulePathMap = {
  '@axios-plugin/core': 'packages/core/src/index.ts',
  // 其他模块
};

module.exports = {
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleNameMapper: Object.fromEntries(
    Object.entries(modulePathMap).map(([moduleName, modulePath]) => {
      return [
        `^${moduleName}$`,
        path.resolve(__dirname, modulePath),
      ]
    })
  )
}