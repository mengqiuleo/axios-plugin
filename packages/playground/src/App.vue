<script setup lang="ts">
// import Timeout from './components/Timeout.vue'
// import Interceptor from './components/Interceptor.vue'
// import Cache from './components/Cache.vue'
import Retry from './components/Retry.vue'
</script>

<template>
  <div>
    <!-- <timeout/> -->
    <!-- <Interceptor /> -->
    <!-- <Suspense>
      <Cache />
    </Suspense> -->
    <Retry/>
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
