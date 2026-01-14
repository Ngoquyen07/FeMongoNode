<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useAuthActions } from '@/composables/useAuthActions'
import { adminApi } from '@/api/admin/adminApi'

const userStore = useUserStore()
const { logout } = useAuthActions()

const managers = ref<any[]>([])
const orphanEmployees = ref<any[]>([])
const isLoading = ref(false)

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'employee'
})

const regErrors = ref<Record<string, string[]>>({})
const successMsg = ref('')

const fetchData = async () => {
  isLoading.value = true
  try {
    const [mgrRes, orphanRes] = await Promise.all([
      adminApi.getManagers(),
      adminApi.getOrphanEmployees()
    ])
    managers.value = mgrRes.data.data
    orphanEmployees.value = orphanRes.data.data
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  regErrors.value = {}
  try {
    await adminApi.register(registerForm)
    successMsg.value = 'New staff member has been successfully registered.'
    Object.assign(registerForm, {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'employee'
    })
    await fetchData()
    setTimeout(() => (successMsg.value = ''), 3000)
  } catch (err: any) {
    if (err.response?.data?.errors) {
      regErrors.value = err.response.data.errors
    }
  }
}

onMounted(fetchData)
</script>
<template>
  <div class="container-fluid px-4 mt-4">
    <!-- Header -->
    <header class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
      <div>
        <h1 class="h3 fw-bold mb-1">Admin Dashboard</h1>
        <p class="text-muted small mb-0">
          Welcome back, <strong>{{ userStore.user?.username }}</strong>
        </p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#registerModal">
          <i class="bi bi-person-plus me-2"></i>Add New Staff
        </button>
        <button @click="logout" class="btn btn-outline-danger">
          <i class="bi bi-box-arrow-right me-2"></i>Logout
        </button>
      </div>
    </header>

    <!-- Content -->
    <div class="row g-4">
      <!-- Managers -->
      <div class="col-lg-8">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-header bg-white">
            <h5 class="fw-bold mb-0">Managers & Assigned Employees</h5>
          </div>
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
              <tr>
                <th style="width: 35%">Manager</th>
                <th>Employees</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="mgr in managers" :key="mgr._id">
                <td>
                  <div class="fw-bold">{{ mgr.username }}</div>
                  <div class="text-muted small">{{ mgr.email }}</div>
                </td>
                <td>
                    <span
                        v-for="emp in mgr.employees"
                        :key="emp._id"
                        class="badge bg-light text-dark border me-2 mb-1"
                    >
                      {{ emp.username }}
                    </span>
                  <span v-if="!mgr.employees?.length" class="text-muted small">
                      No employees assigned
                    </span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Orphans -->
      <div class="col-lg-4">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-header bg-warning">
            <h5 class="fw-bold mb-0">Unassigned Employees</h5>
          </div>
          <ul class="list-group list-group-flush">
            <li
                v-for="orphan in orphanEmployees"
                :key="orphan._id"
                class="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <div class="fw-bold">{{ orphan.username }}</div>
                <div class="small text-muted">{{ orphan.email }}</div>
              </div>
              <span class="badge bg-secondary">Unassigned</span>
            </li>
            <li v-if="!orphanEmployees.length" class="text-center py-4 text-muted">
              No unassigned employees
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- REGISTER MODAL -->
    <div class="modal fade" id="registerModal" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title fw-bold">Register New Staff</h5>
            <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body p-4">
            <div v-if="successMsg" class="alert alert-success">
              {{ successMsg }}
            </div>

            <form @submit.prevent="handleRegister" class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Username</label>
                <input
                    v-model="registerForm.username"
                    class="form-control"
                    :class="{ 'is-invalid': regErrors.username }"
                />
                <div class="invalid-feedback">{{ regErrors.username?.[0] }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Email</label>
                <input
                    v-model="registerForm.email"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': regErrors.email }"
                />
                <div class="invalid-feedback">{{ regErrors.email?.[0] }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Password</label>
                <input
                    v-model="registerForm.password"
                    type="password"
                    class="form-control"
                    :class="{ 'is-invalid': regErrors.password }"
                />
                <div class="invalid-feedback">{{ regErrors.password?.[0] }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Confirm Password</label>
                <input
                    v-model="registerForm.confirmPassword"
                    type="password"
                    class="form-control"
                    :class="{ 'is-invalid': regErrors.confirmPassword }"
                />
                <div class="invalid-feedback">
                  {{ regErrors.confirmPassword?.[0] }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Role</label>
                <select v-model="registerForm.role" class="form-select">
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              <div class="col-12 mt-4">
                <button class="btn btn-primary w-100 fw-bold py-2">
                  Register Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
