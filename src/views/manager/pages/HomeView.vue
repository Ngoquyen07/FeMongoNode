<script setup lang="ts">
import { useAuthActions } from "@/composables/useAuthActions.ts";
import { managerApi } from "@/api/manager/managerApi.ts";
import { onMounted, ref } from "vue";
import type { User } from "@/interfaces/user.interface.ts";

const { logout } = useAuthActions();
const manager = ref<User | null>(null);

const loadInfo = async () => {
  try {
    const res = await managerApi.getManagerData()
    manager.value = res.data.data
  } catch (err) {

  }
}
onMounted(() => {
  loadInfo()
})
</script>

<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold text-primary">Manager Dashboard</h2>
        <p class="text-muted">Manage your team </p>
      </div>
      <div class="d-flex gap-2">
        <button @click="logout" class="btn btn-outline-danger">
          <i class="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col-md-4">
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-white fw-bold">Manager Profile</div>
          <div class="card-body">
            <div class="text-center mb-3">
              <div class="avatar-placeholder mx-auto mb-2">{{ manager?.username?.charAt(0) || 'M' }}</div>
              <h5 class="mb-0">{{ manager?.username || 'Loading...' }}</h5>

              <span class="badge bg-info text-dark">{{ manager?.role?.name }}</span>
            </div>
            <hr>
            <p class="small mb-1 text-muted">Email Address</p>
            <p class="fw-medium">{{ manager?.email }}</p>
            <p class="small mb-1 text-muted">Account Created</p>
            <p class="fw-medium">{{ new Date(manager?.createdAt || '').toLocaleDateString() }}</p>

          </div>
        </div>
      </div>

      <div class="col-md-8">
        <div class="card shadow-sm">
          <div class="card-header bg-white d-flex justify-content-between align-items-center">
            <span class="fw-bold">Managed Employees ({{ manager?.employees?.length || 0 }})</span>

          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="emp in manager?.employees" :key="emp._id">
                  <td>
                    <div class="fw-bold">{{ emp.username }}</div>

                  </td>
                  <td>{{ emp.email }}</td>

                </tr>
                <tr v-if="!manager?.employees?.length">
                  <td colspan="3" class="text-center py-4 text-muted">No employees found.</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar-placeholder {
  width: 60px;
  height: 60px;
  background-color: #e9ecef;
  color: #0d6efd;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1.5rem;
  font-weight: bold;
}

.card {
  border-radius: 12px;
  border: none;
}
.table thead th {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

</style>