<script setup lang="ts">
import { auth } from "@/api/auth/auth"
import {useUserStore} from "@/stores/userStore.ts";
import {useAuthActions} from "@/composables/useAuthActions.ts";
const userStore = useUserStore()
const {logout} = useAuthActions();
const handleLogout = async () => {
  try {
    const res = await logout()
  } catch (error) {
    console.error("Error", error)
  }
}
</script>

<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center">
      <h1>Employee Home Page</h1>

      <button @click="logout" class="btn btn-danger">
        <i class="bi bi-box-arrow-right me-2"></i> Đăng xuất
      </button>
    </div>

    <hr />

    <div class="card mt-3">
      <div class="card-body">
        Chào mừng, <strong>{{ userStore.user?.username || 'Employee' }}</strong>!
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Bạn có thể thêm style riêng ở đây nếu cần */
</style>