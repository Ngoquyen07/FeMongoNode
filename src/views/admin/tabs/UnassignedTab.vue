<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import AssignEmployeeModal from '../modals/AssignEmployeeModal.vue'
import { adminApi } from '@/api/admin/adminApi'
import type { User } from "@/interfaces/user.interface"

const employees = ref<User[]>([])
const selected = ref<User | null>(null)
const isLoading = ref(false)
const searchQuery = ref('')

async function loadEmployees() {
  isLoading.value = true
  try {
    const res = await adminApi.getOrphanEmployees()
    employees.value = res.data.data
  } catch (err) {
    console.error("Failed to load unassigned employees:", err)
  } finally {
    isLoading.value = false
  }
}

// Filter employees based on search input
const filteredEmployees = computed(() => {
  return employees.value.filter(emp =>
      emp.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

onMounted(loadEmployees)
</script>

<template>
  <div class="assignment-page">
    <div class="page-header mb-4">
      <div class="d-flex justify-content-between align-items-end flex-wrap gap-3">
        <div>
          <h4 class="fw-bold text-dark mb-1">Unassigned Employees</h4>
          <p class="text-muted small mb-0">These employees currently have no manager. Click to assign them to a supervisor.</p>
        </div>

        <div class="search-container">
          <input
              v-model="searchQuery"
              type="text"
              class="form-control-custom"
              placeholder="Search by name or email..."
          >
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted">Scanning for unassigned staff...</p>
    </div>

    <div v-else class="employee-list">
      <div
          v-for="emp in filteredEmployees"
          :key="emp._id"
          class="employee-row-card shadow-sm"
          @click="selected = emp"
      >
        <div class="row align-items-center g-0">

          <div class="col-md-5 d-flex align-items-center">
            <div class="avatar-box">
              {{ emp.username.charAt(0).toUpperCase() }}
            </div>
            <div class="ms-3">
              <div class="fw-bold text-dark mb-0">{{ emp.username }}</div>
              <div class="text-muted extra-small">{{ emp.email }}</div>
            </div>
          </div>

          <div class="col-md-4 mt-2 mt-md-0">
            <span class="status-tag">
              <span class="dot pulse"></span>
              Awaiting Assignment
            </span>
          </div>

          <div class="col-md-3 text-end d-none d-md-block">
            <div class="assign-hint">
              <span>Assign Manager</span>
              <span class="arrow">→</span>
            </div>
          </div>

        </div>
      </div>

      <div v-if="filteredEmployees.length === 0" class="empty-state text-center py-5">
        <div class="empty-icon">🎉</div>
        <h5 class="fw-bold text-dark">All Caught Up!</h5>
        <p class="text-muted">No unassigned employees were found.</p>
      </div>
    </div>

    <AssignEmployeeModal
        v-if="selected"
        :employee="selected"
        @close="selected = null"
        @updated="loadEmployees"
    />
  </div>
</template>

<style scoped>
.assignment-page {
  padding: 2rem;
  width: 100%;
  max-width: 1800px; /* Full width logic */
  margin: 0 auto;
}

/* Search Input */
.form-control-custom {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 16px;
  width: 300px;
  transition: all 0.2s;
}
.form-control-custom:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

/* Row Card */
.employee-list { display: flex; flex-direction: column; gap: 12px; }

.employee-row-card {
  background: white;
  border: 1px solid #edf2f7;
  border-radius: 16px;
  padding: 1.25rem 2rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.employee-row-card:hover {
  border-color: #3b82f6;
  background-color: #f8faff;
  transform: translateX(8px);
}

/* Avatar */
.avatar-box {
  width: 48px; height: 48px;
  background: #eff6ff; color: #3b82f6;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 1.2rem;
}

/* Status Tags */
.status-tag {
  display: inline-flex;
  align-items: center;
  background: #fff7ed;
  color: #c2410c;
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 600;
}

.dot {
  width: 8px; height: 8px;
  background: #f97316;
  border-radius: 50%;
  margin-right: 10px;
}

.pulse {
  animation: pulse-orange 2s infinite;
}

@keyframes pulse-orange {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(249, 115, 22, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
}

/* Hint */
.assign-hint {
  font-weight: 700; color: #3b82f6; opacity: 0;
  transition: 0.3s; display: flex; align-items: center; justify-content: flex-end; gap: 8px;
}

.employee-row-card:hover .assign-hint { opacity: 1; }

.empty-state {
  background: white; border: 2px dashed #e2e8f0; border-radius: 20px;
}
.empty-icon { font-size: 3rem; margin-bottom: 1rem; }
.extra-small { font-size: 0.75rem; }
</style>