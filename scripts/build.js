import { execa } from 'execa'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
console.log('__dirname', __dirname)

const resolveUrl = (p) => {
  return path.resolve(`${__dirname}/../packages/`, p)
}

const pkgs = fs.readdirSync('packages').filter(p => {
  return fs.statSync(`packages/${p}`).isDirectory() // 同步获取该路径是否为目录
})

console.log(pkgs) // [ 'core', 'retry', 'throttle' ]

const runParallel = (targets, buildFn) => {
  const res = []
  for (const target of targets) {
    res.push(buildFn(target))
  }
  return Promise.all(res)
}

const build = async (pkg) => {
  const url = resolveUrl(`${pkg}/dist`)

  if (fs.existsSync(url)) {
    await execa('rimraf', [url]);
  }

  // -c：表示使用 rollup.config.js 文件（默认的配置文件）。
  // --environment TARGET:${pkg}：用于在 Rollup 构建过程中设置一个环境变量 TARGET，其值是 pkg（例如 core、utils 等 package 名）
  // { stdio: 'inherit' }：这表示继承父进程的标准输入输出，意味着 Rollup 的输出会直接显示在当前终端中
  await execa('rollup', ['-c', '--environment', `TARGET:${pkg}`], { stdio: 'inherit' })
}

runParallel(pkgs, build)