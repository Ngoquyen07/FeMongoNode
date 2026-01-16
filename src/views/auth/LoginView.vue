<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthActions } from '@/composables/useAuthActions'

const form = reactive({ email: '', password: '' })
const fieldErrors = ref<any>({})
const { login } = useAuthActions()
const handleSubmit = async () => {
  fieldErrors.value = {}
  const result = await login(form)
  if (!result.success) {
    if (typeof result.errors === 'object') {
      fieldErrors.value = result.errors
    }
  }
}
</script>

<template>
    <div class="row justify-content-center">
      <div class="col-md-4">
        <form @submit.prevent="handleSubmit" class="card card-body shadow-sm border-0">
          <h3 class="text-center mb-4 fw-bold">Login</h3>

          <div class="mb-3">
            <label class="form-label">Email</label>
            <input
                v-model="form.email"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': fieldErrors.email }"
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
</template>

<style scoped>
.form-control:focus {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
}
</style>