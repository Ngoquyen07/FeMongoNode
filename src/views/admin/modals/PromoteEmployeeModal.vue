<script setup lang="ts">
import { ref } from 'vue'
import { adminApi } from '@/api/admin/adminApi'
import SuccessToast from "@/components/toasts/SuccessToast.vue";
import type {User} from "@/interfaces/user.interface.ts";

const props = defineProps<{
  employee: User
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updated'): void
}>()

const toastRef = ref<any>(null)
const loading = ref(false)
const currentView = ref<'settings' | 'confirm-promote' | 'confirm-delete'>('settings')

const finishAction = (message: string) => {
  toastRef.value?.show(message, "success")
  setTimeout(() => {
    emit('updated')
    emit('close')
  }, 800)
}

const handlePromote = async () => {
  loading.value = true
  try {
    await adminApi.updateUserRole(props.employee._id, 'manager')
    finishAction("Employee promoted to Manager successfully")
  } catch (error) {
    toastRef.value?.show("Failed to promote employee", "danger")
    currentView.value = 'settings'
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  loading.value = true
  try {
    await adminApi.deleteStaff(props.employee._id)
    finishAction("Employee account deleted")
  } catch (error) {
    toastRef.value?.show("Failed to delete employee", "danger")
    currentView.value = 'settings'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <SuccessToast ref="toastRef" />

  <div class="modal-overlay" @click.self="emit('close')">

    <div v-if="currentView === 'settings'" class="modal-card shadow-lg animate-pop">
      <div class="modal-header-custom">
        <h5 class="fw-bold mb-0 text-dark">Employee Settings</h5>
        <button class="btn-close-custom" @click="emit('close')">&times;</button>
      </div>

      <div class="modal-body-custom">
        <div class="user-preview mb-4">
          <div class="avatar-circle">
            {{ employee.username.charAt(0).toUpperCase() }}
          </div>
          <div class="ms-3">
            <div class="fw-bold text-dark h6 mb-0">{{ employee.username }}</div>
            <div class="small text-muted">{{ employee.email }}</div>
          </div>
        </div>

        <div class="info-group p-3 mb-4">
          <label class="label-title">Current Hierarchy</label>
          <div class="d-flex align-items-center mt-2">
            <div class="manager-badge" v-if="employee.manager">
              <span class="small text-muted me-1">Managed by:</span>
              <span class="fw-600">{{ employee.manager.username }}</span>
            </div>
            <div class="text-muted small fst-italic" v-else>
              No manager assigned
            </div>
          </div>
        </div>

        <div class="alert alert-soft-success d-flex align-items-start gap-3">
          <span class="fs-5">💡</span>
          <div class="small">
            Promoting this user will grant them access to manage their own team and administrative dashboards.
          </div>
        </div>
      </div>

      <div class="modal-footer-custom">
        <button class="btn-footer-delete" @click="currentView = 'confirm-delete'">
          Delete Employee
        </button>

        <div class="d-flex gap-2">
          <button class="btn-link-custom" @click="emit('close')">Cancel</button>
          <button class="btn-promote-main" @click="currentView = 'confirm-promote'">
            Promote to Manager
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="currentView === 'confirm-promote'" class="confirm-card shadow-lg animate-pop">
      <div class="p-4 text-center">
        <div class="icon-box success">🚀</div>
        <h5 class="fw-bold mt-3">Confirm Promotion?</h5>
        <p class="text-muted small px-3">
          You are upgrading <b>{{ employee.username }}</b> to a Manager.
          They will receive elevated system permissions immediately.
        </p>
        <div class="d-flex gap-2 mt-4">
          <button class="btn-cancel-flat w-100" @click="currentView = 'settings'">Go Back</button>
          <button class="btn-confirm-action bg-success text-white w-100" @click="handlePromote" :disabled="loading">
            {{ loading ? 'Processing...' : 'Yes, Promote' }}
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="currentView === 'confirm-delete'" class="confirm-card shadow-lg animate-pop">
      <div class="p-4 text-center">
        <div class="icon-box danger">🗑️</div>
        <h5 class="fw-bold mt-3">Delete Employee?</h5>
        <p class="text-muted small px-3">
          Are you sure you want to permanently delete <b>{{ employee.username }}</b>?
          This action cannot be undone.
        </p>
        <div class="d-flex gap-2 mt-4">
          <button class="btn-cancel-flat w-100" @click="currentView = 'settings'">Cancel</button>
          <button class="btn-confirm-action bg-danger text-white w-100" @click="handleDelete" :disabled="loading">
            {{ loading ? 'Deleting...' : 'Confirm Delete' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; z-index: 2000;
}

.modal-card, .confirm-card {
  background: white; border-radius: 24px; overflow: hidden; width: 100%; max-width: 450px;
}

.modal-header-custom {
  padding: 20px 24px; display: flex; justify-content: space-between; align-items: center;
  border-bottom: 1px solid #f1f5f9;
}

.modal-body-custom { padding: 24px; }

/* User Preview */
.user-preview {
  display: flex; align-items: center; background: #f8fafc; padding: 16px; border-radius: 20px;
}
.avatar-circle {
  width: 50px; height: 50px; background: linear-gradient(135deg, #10b981, #059669);
  color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 1.2rem;
}

/* Hierarchy Info */
.info-group { background: #f1f5f9; border-radius: 12px; }
.label-title {
  font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.05em;
  color: #64748b; font-weight: 800;
}
.manager-badge {
  background: white; padding: 4px 12px; border-radius: 8px; font-size: 0.9rem;
  border: 1px solid #e2e8f0;
}

.alert-soft-success {
  background: #f0fdf4; border: 1px solid #dcfce7; color: #166534; border-radius: 12px;
}

/* FOOTER */
.modal-footer-custom {
  padding: 16px 24px; background: #f8fafc; border-top: 1px solid #f1f5f9;
  display: flex; justify-content: space-between; align-items: center;
}

.btn-footer-delete {
  background: transparent; border: none; color: #ef4444; font-weight: 600;
  font-size: 0.85rem; padding: 8px; border-radius: 8px; transition: 0.2s;
}
.btn-footer-delete:hover { background: #fee2e2; }

.btn-promote-main {
  background: #10b981; color: white; border: none; padding: 10px 20px;
  border-radius: 12px; font-weight: 600; transition: 0.2s;
}
.btn-promote-main:hover { background: #059669; transform: translateY(-1px); }

/* Confirmation View Styles */
.icon-box {
  width: 70px; height: 70px; border-radius: 50%; margin: 0 auto;
  display: flex; align-items: center; justify-content: center; font-size: 2.2rem;
}
.icon-box.success { background: #dcfce7; }
.icon-box.danger { background: #fee2e2; }

.btn-confirm-action { border: none; padding: 12px; border-radius: 12px; font-weight: 600; }
.btn-cancel-flat { background: #f1f5f9; border: none; padding: 12px; border-radius: 12px; color: #475569; }
.btn-link-custom { background: transparent; border: none; color: #64748b; font-weight: 500; }
.btn-close-custom { background: none; border: none; font-size: 1.5rem; color: #cbd5e1; }

/* Animation */
.animate-pop { animation: pop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes pop {
  from { transform: scale(0.9) translateY(10px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}
.fw-600 { font-weight: 600; }
</style>