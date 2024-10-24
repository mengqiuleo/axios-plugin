import typescript from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts'
export default [{
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs"
    },
    {
      file: "dist/index.esm.js",
      format: "esm"
    }
  ],
  plugins: [
    typescript()
  ]
},
{
  //汇总.d.ts 类型声明文件
  input: './src/index.ts',
  output: {
    file: 'dist/index.d.ts',
  },
  plugins: [
    dts()
  ],
}
]

