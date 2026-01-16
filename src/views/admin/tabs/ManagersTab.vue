<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api/admin/adminApi'
import ManagerSettingsModal from '../modals/ManagerSettingsModal.vue'
import type { User } from '@/interfaces/user.interface'

// --- State ---
const managers = ref<User[]>([])
const expanded = ref<string | null>(null)
const selectedManager = ref<User | null>(null)
const isLoading = ref(false)

// --- Methods ---
const fetchManagers = async () => {
  isLoading.value = true
  try {
    const response = await adminApi.getManagers()
    managers.value = response.data.data
  } catch (error) {
    console.error("Error: ", error)
  } finally {
    isLoading.value = false
  }
}

const toggle = (id: string) => {
  expanded.value = expanded.value === id ? null : id
}

onMounted(fetchManagers)
</script>

<template>
  <div class="page-container">
    <div class="container-fluid px-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold text-dark mb-0">Manager</h4>
        <span class="badge bg-primary-soft text-primary">Total : {{ managers.length }}</span>
      </div>

      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <div class="mt-2 text-muted">Loading...</div>
      </div>

      <div v-else class="manager-list">
        <div
            v-for="mgr in managers"
            :key="mgr._id"
            class="manager-card"
            :class="{ 'is-expanded': expanded === mgr._id }"
        >
          <div class="card-header-custom" @click="toggle(mgr._id)">
            <div class="row align-items-center w-100 g-0">

              <div class="col-12 col-md-4 d-flex align-items-center">
                <div class="avatar-box me-3">
                  {{ mgr.username.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="fw-bold text-dark h6 mb-0">{{ mgr.username }}</div>
                  <div class="small text-muted d-md-none">{{ mgr.email }}</div>
                </div>
              </div>

              <div class="col-md-4 d-none d-md-block text-muted small">
                <i class="bi bi-envelope me-1"></i> {{ mgr.email }}
              </div>

              <div class="col-md-4 d-flex align-items-center justify-content-end gap-3">
                <span class="badge-count d-none d-sm-inline-block">
                  {{ mgr.employees?.length || 0 }} employee
                </span>

                <button
                    class="btn-settings"
                    title="Setting"
                    @click.stop="selectedManager = mgr"
                >
                  <span class="icon">⚙</span>
                </button>

                <div class="chevron-wrapper" :class="{ 'rotated': expanded === mgr._id }">
                  <span class="chevron-icon">▼</span>
                </div>
              </div>
            </div>
          </div>

          <Transition name="slide-fade">
            <div v-if="expanded === mgr._id" class="expandable-content">
              <div class="content-inner">
                <div class="label-title">Employee list</div>
                <div v-if="mgr.employees && mgr.employees.length > 0" class="employee-tags-container">
                  <div v-for="emp in mgr.employees" :key="emp._id" class="employee-chip">
                    <div class="chip-dot"></div>
                    <span class="chip-name">{{ emp.username }}</span>
                  </div>
                </div>
                <div v-else class="empty-state">
                  <small>There are no employees for this manager</small>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>

  <ManagerSettingsModal
      v-if="selectedManager"
      :manager="selectedManager"
      @close="selectedManager = null"
      @updated="fetchManagers"
  />
</template>

<style scoped>
/* Tổng thể trang */
.page-container {
  padding-top: 1.5rem;
  padding-bottom: 3rem;
  background-color: #f8f9fa; /* Màu nền nhẹ giúp card nổi bật */
  min-height: 100vh;
}

/* List container dãn rộng */
.manager-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Card Style */
.manager-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  transition: all 0.25s ease;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.manager-card:hover {
  border-color: #dee2e6;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.manager-card.is-expanded {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
}

/* Header bên trong card */
.card-header-custom {
  padding: 1.25rem 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
}

/* Avatar */
.avatar-box {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-weight: 700;
  flex-shrink: 0;
}

/* Badge count */
.badge-count {
  background-color: #f1f5f9;
  color: #475569;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

.bg-primary-soft {
  background-color: rgba(59, 130, 246, 0.1);
}

/* Button Settings */
.btn-settings {
  border: none;
  background: #f8fafc;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: #64748b;
}

.btn-settings:hover {
  background-color: #e2e8f0;
  color: #1e293b;
  transform: rotate(30deg);
}

/* Chevron Icon */
.chevron-wrapper {
  color: #cbd5e1;
  transition: transform 0.3s ease;
  font-size: 0.7rem;
}

.chevron-wrapper.rotated {
  transform: rotate(180deg);
  color: #3b82f6;
}

/* Phần nội dung mở rộng */
.expandable-content {
  background-color: #fafbfc;
  border-top: 1px solid #f1f5f9;
}

.content-inner {
  padding: 1.5rem;
}

.label-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 1rem;
  letter-spacing: 0.05em;
}

/* Employee Tags */
.employee-tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.employee-chip {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 6px 14px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.employee-chip:hover {
  border-color: #cbd5e1;
  background-color: #f8fafc;
}

.chip-dot {
  width: 7px;
  height: 7px;
  background-color: #10b981;
  border-radius: 50%;
  margin-right: 10px;
}

.chip-name {
  font-size: 0.875rem;
  color: #334155;
  font-weight: 500;
}

.empty-state {
  color: #94a3b8;
  font-style: italic;
}
</style>