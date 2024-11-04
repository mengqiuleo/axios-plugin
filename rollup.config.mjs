import typescript from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import cleanup from 'rollup-plugin-cleanup'

import path from 'path'
import { fileURLToPath } from 'url'

const pkg = process.env.TARGET

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const resolve = (p) => {
  return path.resolve(`${__dirname}/packages/${pkg}`, p)
}

export default [
  {
    input: resolve('src/index.ts'),
    output:[
      {
        file: resolve(`dist/index.esm.js`),
        format: 'esm'
      },
      {
        file: resolve(`dist/index.cjs.js`),
        format: 'cjs'
      }
    ],
    plugins: [
      nodeResolve(),
      terser(),
      cleanup(),
      typescript()
    ]
  },
  {
    //汇总.d.ts 类型声明文件
    input: resolve('src/index.ts'),
    output: {
      file: resolve(`dist/index.d.ts`),
    },
    plugins: [
      dts()
    ],
  }
]

