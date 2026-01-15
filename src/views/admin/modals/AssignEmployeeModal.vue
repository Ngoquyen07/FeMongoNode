<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api/admin/adminApi'
import type { User } from '@/interfaces/user.interface'

const props = defineProps<{
  employee: User
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updated'): void
}>()

const managers = ref<User[]>([])
const managerId = ref('')
const loading = ref(false)

onMounted(async () => {
  managers.value = (await adminApi.getManagers()).data.data
})

const handleAssign = async () => {
  if (!managerId.value) return

  loading.value = true
  try {
    await adminApi.assignEmployees(managerId.value, [props.employee._id])
    emit('updated')
    emit('close')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="modal fade show d-block">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title">Assign Employee</h5>
          <button class="btn-close" @click="emit('close')"></button>
        </div>

        <div class="modal-body">
          <div class="mb-3">
            <div class="fw-bold">{{ employee.username }}</div>
            <div class="small text-muted">{{ employee.email }}</div>
          </div>

          <div class="mb-3">
            <label class="form-label">Select Manager</label>
            <select v-model="managerId" class="form-select">
              <option value="">-- Choose manager --</option>
              <option
                  v-for="mgr in managers"
                  :key="mgr._id"
                  :value="mgr._id"
              >
                {{ mgr.username }}
              </option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="emit('close')">
            Cancel
          </button>

          <button
              class="btn btn-primary"
              :disabled="!managerId || loading"
              @click="handleAssign"
          >
            Assign
          </button>
        </div>

      </div>
    </div>
  </div>

  <div class="modal-backdrop fade show"></div>
</template>
