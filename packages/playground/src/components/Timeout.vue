<script setup lang="ts">
import { pluginify } from '@axios-plugin/core'
import { TimeoutPlugin } from '@axios-plugin/timeout'
import axios, { AxiosStatic } from 'axios'

// 模拟请求超时：将超时时间设置为 50 毫秒，以便在服务器响应之前触发超时响应拦截器。
const axiosInstance = pluginify(axios.create() as AxiosStatic).use(new TimeoutPlugin({ timeout: 50 })).generate()
function simulateTimeout() {
  const request = axiosInstance.get('http://localhost:3000/posts');
  const timeout = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Request timed out'));
    }, 4000); // 模拟1秒超时
  });

  return Promise.race([request, timeout]);
}

simulateTimeout()
  .then(result => console.log(result))
  .catch(error => console.error(error));

</script>

<template>
  <div>
    <h2>timeout: </h2>
    <p>模拟请求超时：将超时时间设置为 50 毫秒，以便在服务器响应之前触发超时响应拦截器。</p>
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
