<script setup lang="ts">
import { pluginify } from '@axios-plugin/core'
import { CachePlugin, StorageType } from '@axios-plugin/cache'
import axios, { AxiosStatic } from 'axios'

const axiosInstance = pluginify( axios.create() as AxiosStatic).use(new CachePlugin(StorageType.SessionStorage)).generate()
await axiosInstance.get('http://localhost:3000/posts')

await axiosInstance.get('http://localhost:3000/posts')

</script>

<template>
  <div>
    <h2>cache: </h2>
    <p>做缓存，在缓存时间内不再发送新的请求</p>
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
