<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthActions } from '@/composables/useAuthActions'

const form = reactive({ email: '', password: '' })
const fieldErrors = ref<any>({}) // Thần dùng biến này để lưu lỗi từng ô input
const { login } = useAuthActions()

// State quản lý Toast (Chỉ dùng cho thông báo thành công hoặc lỗi hệ thống lớn)
const toast = reactive({
  show: false,
  message: '',
  type: 'success'
})

const showToast = (msg: string, type = 'success') => {
  toast.message = msg
  toast.type = type
  toast.show = true
  setTimeout(() => { toast.show = false }, 3000)
}

const handleSubmit = async () => {
  fieldErrors.value = {}

  const result = await login(form)

  if (result.success) {
    showToast('Login successfully..', 'success')
  } else {
    if (typeof result.errors === 'object') {
      fieldErrors.value = result.errors
    } else {
      showToast(result.errors, 'danger')
    }
  }
}
</script>

<template>
  <div class="container mt-5">
    <Transition name="fade">
      <div v-if="toast.show" class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1055">
        <div class="toast show align-items-center text-white border-0" :class="'bg-' + toast.type" role="alert">
          <div class="d-flex">
            <div class="toast-body">
              <i class="bi" :class="toast.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'"></i>
              <span class="ms-2">{{ toast.message }}</span>
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="toast.show = false"></button>
          </div>
        </div>
      </div>
    </Transition>

    <div class="row justify-content-center">
      <div class="col-md-4">
        <form @submit.prevent="handleSubmit" class="card card-body shadow-sm border-0">
          <h3 class="text-center mb-4 fw-bold">Login</h3>

          <div class="mb-3">
            <label class="form-label">Email</label>
            <input
                v-model="form.email"
                type="email"
                class="form-control"
                :class="{ 'is-invalid': fieldErrors.email || fieldErrors.message }"
            />
            <div v-if="fieldErrors.email" class="invalid-feedback">
              {{ fieldErrors.email[0] }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Password</label>
            <input
                v-model="form.password"
                type="password"
                class="form-control"
                :class="{ 'is-invalid': fieldErrors.password || fieldErrors.message }"
            />
            <div v-if="fieldErrors.password" class="invalid-feedback">
              {{ fieldErrors.password[0] }}
            </div>
            <div v-if="fieldErrors.message" class="invalid-feedback">
              {{ fieldErrors._form[0] }}
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-100 py-2 fw-bold">
            Login
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.toast-container { margin-top: 20px; }
/* Làm cho các ô input trông hoàng gia hơn một chút */
.form-control:focus {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
}
</style>