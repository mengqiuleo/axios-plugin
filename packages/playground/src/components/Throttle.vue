<script setup lang="ts">
import { pluginify } from '@axios-plugin/core'
import { ThrottlePlugin } from '@axios-plugin/throttle'
import axios from 'axios'

const axiosInstance = pluginify( axios).use(new ThrottlePlugin({ maxTime: 1000 })).generate()
await axiosInstance.get('http://localhost:3000/posts')

await axiosInstance.get('http://localhost:3000/posts')


</script>

<template>
  <div>
    <h2>throttle: </h2>
    <p>限制axios发送请求的频率，避免过多的请求对服务器造成负担或浪费带宽资源。</p>
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
