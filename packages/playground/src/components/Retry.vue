<script setup lang="ts">
import { pluginify } from '@axios-plugin/core'
import { RetryPlugin } from '@axios-plugin/retry'
import axios from 'axios'

const axiosInstance = pluginify( axios).use(new RetryPlugin()).generate()
await axiosInstance.get('http://localhost:3000/posts')


</script>

<template>
  <div>
    <h2>retry: </h2>
    <p>拦截失败的请求并在可能的情况下进行重试</p>
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
