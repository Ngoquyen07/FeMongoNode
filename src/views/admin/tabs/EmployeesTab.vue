<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PromoteEmployeeModal from '../modals/PromoteEmployeeModal.vue'
import { adminApi } from '@/api/admin/adminApi'
import type { User } from '@/interfaces/user.interface'

const employees = ref<any[]>([])
const selected = ref<User | null>(null)
const isLoading = ref(false)

const loadEmployees = async () => {
  isLoading.value = true
  try {
    const res = await adminApi.getEmployees()
    employees.value = res.data.data
    console.log(res.data.data)
  } catch (err) {
    console.error("Error loading employees:", err)
  } finally {
    isLoading.value = false
  }
}

onMounted(loadEmployees)
</script>

<template>
  <div class="promotion-page px-4">
    <div class="header-section mb-4">
      <h4 class="fw-bold text-dark">Promote Employees</h4>
      <p class="text-muted small">Click on any employee card to upgrade their role to Manager.</p>
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-success" role="status"></div>
    </div>

    <div v-else class="employee-list-wrapper">
      <div
          v-for="emp in employees"
          :key="emp._id"
          class="employee-row-card"
          @click="selected = emp"
      >
        <div class="row align-items-center g-0 w-100">

          <div class="col-md-4 d-flex align-items-center">
            <div class="avatar-box">
              {{ emp.username.charAt(0).toUpperCase() }}
            </div>
            <div class="ms-3">
              <div class="fw-bold text-dark">{{ emp.username }}</div>
              <div class="text-muted extra-small">{{ emp.email }}</div>
            </div>
          </div>

          <div class="col-md-5 mt-3 mt-md-0">
            <div class="manager-info">
              <span class="label">Managed by:</span>
              <span class="manager-name" v-if="emp.manager">
                <i class="bi bi-person-badge me-1"></i>
                {{ emp.manager.username }}
              </span>
              <span class="text-muted fst-italic" v-else>No direct manager</span>
            </div>
          </div>

          <div class="col-md-3 text-end d-none d-md-block">
            <div class="promote-hint">
              <span>Click to promote</span>
              <span class="arrow">→</span>
            </div>
          </div>

        </div>
      </div>

      <div v-if="employees.length === 0" class="empty-state-card text-center py-5">
        <p class="text-muted">No employees found in the system.</p>
      </div>
    </div>

    <PromoteEmployeeModal
        v-if="selected"
        :employee="selected"
        @close="selected = null"
        @updated="loadEmployees"
    />
  </div>
</template>

<style scoped>
.promotion-page {
  padding-top: 2rem;
  /* Change: Use a percentage or very large max-width to fill the screen */
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  /* Ensure consistent spacing on the edges */
  padding-left: 2rem;
  padding-right: 2rem;
}
.employee-list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Row Card Styling */
.employee-row-card {
  background: white;
  border: 1px solid #edf2f7;
  border-radius: 16px;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.employee-row-card:hover {
  border-color: #10b981;
  background-color: #f0fdf4;
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
}

/* Avatar Styling */
.avatar-box {
  width: 45px;
  height: 45px;
  background: #f1f5f9;
  color: #64748b;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
  transition: 0.2s;
}

.employee-row-card:hover .avatar-box {
  background: #10b981;
  color: white;
}

/* Manager Info Label */
.manager-info {
  display: flex;
  flex-direction: column;
}

.manager-info .label {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: #94a3b8;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.manager-info .manager-name {
  font-size: 0.95rem;
  color: #334155;
  font-weight: 500;
}

/* Promotion Hint (Right side) */
.promote-hint {
  font-size: 0.85rem;
  font-weight: 600;
  color: #10b981;
  opacity: 0;
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.employee-row-card:hover .promote-hint {
  opacity: 1;
}

.promote-hint .arrow {
  transition: transform 0.2s;
}

.employee-row-card:hover .promote-hint .arrow {
  transform: translateX(4px);
}

/* Utilities */
.extra-small {
  font-size: 0.75rem;
}

.empty-state-card {
  border: 2px dashed #e2e8f0;
  border-radius: 16px;
}
</style>