import { Project } from "ts-morph"
import * as path from "path"
import * as fs from "fs"

const internalProject = new Project({
  tsConfigFilePath: path.resolve(process.cwd(), "tsconfig.json"),
})

const sourceFiles = internalProject.getSourceFiles("**/*/interface.ts")

const getDefinedData = (sourceFile) => {
  // 创建表头
  const header = `| Signature | Description | Type | Default |\n|-----------|-------------|------|---------|`

  const interfaces = sourceFile.getInterfaces()

  const interfaceList = interfaces.map(intf => {
    const doc = intf.getJsDocs()[0]?.getDescription().trim() || ""
    
    // 获取属性信息
    const propertyList = intf.getProperties().map((property) => {
      const signature = property.getName() // 使用属性名作为签名
    
      // 获取 JSDoc 文档
      const jsDocs = property.getJsDocs()
    
      // 解析 @description
      const description = jsDocs[0]?.getDescription().trim() || ""
    
      // 解析 @default 注解
      const defaultTag = jsDocs[0]?.getTags().find(tag => tag.getTagName() === 'default')
      const defaultValue = defaultTag ? defaultTag.getComment() : "" // 直接获取默认值的内容
    
      // 获取属性类型
      const type = property.getTypeNode() ? property.getTypeNode().getText() : "" // 直接获取类型文本
    
      // 合并成表格行
      return `| ${signature} | ${description} | ${type} | ${defaultValue} |`
    })

    const memberList = [header, ...propertyList].join("\n")

    return [`### ${intf.getName()} \n${doc}`, memberList].join("\n")
  })

  return [...interfaceList].join("\n\n")
}

const writeDefinedDataToReadme = (definedData, readmePath) => {
  let fileContent = fs.readFileSync(readmePath, 'utf-8')

  // 查找插入位置
  const insertPosition = fileContent.indexOf('## 参数')

  // 检查是否找到了位置
  if (insertPosition !== -1) {
    // 找到段落的结束位置（即下一段的开始位置）
    const nextSectionPosition = fileContent.indexOf('##', insertPosition + 1)
    const insertionPoint = nextSectionPosition === -1 ? fileContent.length : nextSectionPosition

    // 在 `## 参数` 段落下插入数据
    const updatedContent = `${fileContent.slice(0, insertionPoint)}\n${definedData}\n`

    // 写回文件
    fs.writeFileSync(readmePath, updatedContent, 'utf-8')
  }
}

sourceFiles.forEach(sourceFile => {
  // 获取 interface.ts 的父目录
  const dirPath = path.dirname(sourceFile.getFilePath())
  const readmePath = path.join(path.dirname(dirPath), 'README.md')

  const definedData = getDefinedData(sourceFile)

  writeDefinedDataToReadme(definedData, readmePath)
})

console.log('generate api doc success🚀')