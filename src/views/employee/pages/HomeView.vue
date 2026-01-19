<script setup lang="ts">
import { useAuthActions } from "@/composables/useAuthActions.ts";
import { onMounted, ref } from "vue";
import type { User } from "@/interfaces/user.interface.ts";
import { employeeApi } from "@/api/employee/employeeApi.ts";
const { logout } = useAuthActions();
const employee = ref<User | null>(null);

async function loadEmployee() {
  try {
    const res = await employeeApi.getEmployeeData();
    employee.value = res.data.data;
  } catch (error) {

  }
}

onMounted(() => {
  loadEmployee();
})
</script>

<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold text-success">Employee Portal</h2>
        <p class="text-muted">Welcome back to your workspace</p>
      </div>
      <button @click="logout" class="btn btn-outline-danger shadow-sm">
        <i class="bi bi-box-arrow-right me-2"></i> Logout
      </button>
    </div>

    <div class="row">
      <div class="col-md-4">
        <div class="card shadow-sm mb-4 border-0">
          <div class="card-header bg-white fw-bold border-0 pt-3">My Profile</div>
          <div class="card-body text-center">
            <div class="avatar-placeholder mx-auto mb-3">
              {{ employee?.username?.charAt(0) || 'E' }}
            </div>
            <h5 class="fw-bold mb-1">{{ employee?.username || 'Loading...' }}</h5>
            <span class="badge bg-success mb-3">{{ employee?.role?.name || 'Employee' }}</span>

            <div class="text-start mt-3">
              <div class="mb-3">
                <label class="small text-muted d-block">Email Address</label>
                <span class="fw-medium">{{ employee?.email }}</span>
              </div>
              <div class="mb-0">
                <label class="small text-muted d-block">Joined Date</label>
                <span class="fw-medium">
                  {{ employee?.createdAt ? new Date(employee.createdAt).toLocaleDateString('vi-VN') : '...' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body d-flex align-items-center">
            <div class="icon-box bg-light-primary text-primary me-3">
              <i class="bi bi-person-badge fs-4"></i>
            </div>
            <div>
              <h6 class="text-muted mb-1">Direct Manager</h6>
              <h5 class="mb-0 fw-bold text-dark">
                {{ employee?.manager?.username || 'Not assigned' }}
              </h5>
              <small class="text-primary">{{ employee?.manager?.email }}</small>
            </div>
          </div>
        </div>

        <div class="card shadow-sm border-0">
          <div class="card-header bg-white fw-bold border-0 pt-3">
            Your Activities
          </div>
          <div class="card-body py-5 text-center">
            <img src="https://cdn-icons-png.flaticon.com/512/5057/5057113.png" alt="empty" style="width: 80px; opacity: 0.5">
            <p class="text-muted mt-3">No recent activities to display.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar-placeholder {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 2rem;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(40, 167, 69, 0.2);
}

.icon-box {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.bg-light-primary {
  background-color: #e7f1ff;
}

.card {
  border-radius: 15px;
  transition: transform 0.2s;
}

.badge {
  padding: 0.5em 1em;
  border-radius: 8px;
  font-weight: 500;
}
</style>