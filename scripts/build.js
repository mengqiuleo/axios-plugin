import fs from 'fs'
import execa from 'execa'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
console.log('__dirname', __dirname)

const resolveUrl = (p) => {
  return path.resolve(`${__dirname}/../packages/`, p)
}

const pkgs = fs.readdirSync('packages').filter(p => {
  return fs.statSync(`packages/${p}`).isDirectory()
})

console.log(pkgs) // [ 'cachePlugin', 'core', 'retryPlugin' ]

const runParallel = (targets, buildFn) => {
  const res = []
  for (const target of targets) {
    res.push(buildFn(target))
  }
  return Promise.all(res)
}

const build = async (pkg) => {
  const url = resolveUrl(`${pkg}/dist`)
  await execa('rimraf', [url])

  await execa('rollup', ['-c', '--environment', `TARGET:${pkg}`], { stdio: 'inherit' })
}

runParallel(pkgs, build)