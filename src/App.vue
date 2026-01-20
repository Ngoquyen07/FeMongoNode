<script setup lang="ts">
import {  RouterView } from 'vue-router'
import {onMounted} from "vue";
import {useAuthStore} from "@/stores/authStore.ts";
const authStore = useAuthStore();
onMounted(() => {
  authStore.refreshTokenFromInit()
})
</script>
<template>
  <RouterView />
</template>
<style scoped>
</style>
