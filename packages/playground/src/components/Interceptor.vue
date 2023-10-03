<script setup lang="ts">
import { pluginify } from '@axios-plugin/core'
import { InterceptorPlugin } from '@axios-plugin/interceptor'
import axios from 'axios'

const axiosInstance = pluginify(axios).use(new InterceptorPlugin()).generate()
await axiosInstance.get('http://localhost:3000/users').catch(res => {
  console.log('interceptor error', res.message)
})
// console.log(res)

</script>

<template>
  <div>
    <h2>interceptor: </h2>
    <p>错误状态码拦截：直接请求一个不存在的文件(注意，还是需要启动json-server)</p>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
