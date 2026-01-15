<script setup lang="ts">
import { reactive, ref } from 'vue'
import { adminApi } from '@/api/admin/adminApi'
import type { User } from '@/interfaces/user.interface'
import SuccessToast from "@/components/toasts/SuccessToast.vue";

const props = defineProps<{
  manager: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updated'): void
}>()

const toastRef = ref<any>(null)
const originalRole = ref(props.manager.role.name)
const form = reactive({ role: props.manager.role.name })

// --- UI States ---
const loading = ref(false)
const currentView = ref<'settings' | 'confirm-demote' | 'confirm-delete'>('settings')

// --- Actions ---
const requestSave = () => {
  if (form.role === 'employee' && originalRole.value === 'manager') {
    currentView.value = 'confirm-demote'
  } else {
    handleSave()
  }
}

const handleSave = async () => {
  loading.value = true
  try {
    await adminApi.updateUserRole(props.manager._id, form.role)
    toastRef.value?.show("Demoted successfully", "success")
    finishAction()
  } catch (error) {
    toastRef.value?.show("Failed to demote", "danger")
    currentView.value = 'settings'
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  loading.value = true
  try {
    // Assuming adminApi has a deleteUser method
    await adminApi.deleteStaff(props.manager._id)
    toastRef.value?.show("Manager deleted successfully", "success")
    finishAction()
  } catch (error) {
    toastRef.value?.show("Failed to delete manager", "danger")
    currentView.value = 'settings'
  } finally {
    loading.value = false
  }
}

const finishAction = () => {
  setTimeout(() => {
    emit('updated')
    emit('close')
  }, 800)
}
</script>

<template>
  <SuccessToast ref="toastRef" />

  <div class="modal-overlay" @click.self="emit('close')">

    <div v-if="currentView === 'settings'" class="modal-card shadow-lg animate-pop">
      <div class="modal-header-custom">
        <h5 class="fw-bold mb-0">Manager Settings</h5>
        <button class="btn-close-custom" @click="emit('close')">X</button>
      </div>

      <div class="modal-body-custom">
        <div class="user-preview mb-4">
          <div class="avatar-sm">{{ manager.username.charAt(0).toUpperCase() }}</div>
          <div class="ms-3">
            <div class="fw-bold text-dark">{{ manager.username }}</div>
            <div class="small text-muted">{{ manager.email }}</div>
          </div>
        </div>

        <div class="form-group mb-4">
          <label class="form-label fw-bold small text-uppercase text-muted">System Role</label>
          <select v-model="form.role" class="form-select-custom">
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
        </div>

      </div>

      <div class="modal-footer-custom">
        <button class="btn-delete-trigger" @click="currentView = 'confirm-delete'">
          Delete User
        </button>
        <button class="btn-link-custom" @click="emit('close')">Cancel</button>

        <button
            class="btn-save"
            :disabled="form.role === originalRole || loading"
            @click="requestSave"
        >
          {{ loading ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>

    <div v-else-if="currentView === 'confirm-demote'" class="confirm-card shadow-lg animate-pop">
      <div class="p-4 text-center">
        <div class="icon-box warning">⚠️</div>
        <h5 class="fw-bold mt-3">Confirm Demotion?</h5>
        <p class="text-muted small px-2">
          Changing <b>{{ manager.username }}</b> to an Employee will remove their management privileges.
          Current subordinates will need reassignment.
        </p>
        <div class="d-flex gap-2 mt-4">
          <button class="btn-cancel-flat w-100" @click="currentView = 'settings'">Go Back</button>
          <button class="btn-confirm-action bg-warning text-dark w-100" @click="handleSave" :disabled="loading">
            Confirm Demote
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="currentView === 'confirm-delete'" class="confirm-card shadow-lg animate-pop">
      <div class="p-4 text-center">
        <div class="icon-box danger">🗑️</div>
        <h5 class="fw-bold mt-3">Delete Manager?</h5>
        <p class="text-muted small px-2">
          Are you sure you want to delete <b>{{ manager.username }}</b>?
          All associated data will be permanently removed. This action is irreversible.
        </p>
        <div class="d-flex gap-2 mt-4">
          <button class="btn-cancel-flat w-100" @click="currentView = 'settings'">Cancel</button>
          <button class="btn-confirm-action bg-danger text-white w-100" @click="handleDelete" :disabled="loading">
            {{ loading ? 'Deleting...' : 'Yes, Delete' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(5px);
  display: flex; align-items: center; justify-content: center; z-index: 2000;
}

.modal-card, .confirm-card {
  background: white; border-radius: 24px; overflow: hidden; width: 100%; max-width: 440px;
}

.modal-header-custom {
  padding: 20px 24px; display: flex; justify-content: space-between; align-items: center;
  border-bottom: 1px solid #f1f5f9;
}

.modal-body-custom { padding: 24px; }

/* User Info */
.user-preview {
  display: flex; align-items: center; background: #f8fafc; padding: 12px; border-radius: 16px;
}
.avatar-sm {
  width: 44px; height: 44px; background: #6366f1; color: white; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; font-weight: bold;
}

/* Form */
.form-select-custom {
  width: 100%; padding: 10px; border-radius: 12px; border: 1px solid #e2e8f0; outline: none;
}

/* Danger Zone */
.danger-zone {
  background: #fff1f2; border-radius: 16px; border: 1px dashed #fecdd3;
}
.btn-delete-trigger {
  background: white; color: #e11d48; border: 1px solid #fecdd3; padding: 6px 12px;
  border-radius: 8px; font-size: 0.8rem; font-weight: 600; transition: 0.2s;
}
.btn-delete-trigger:hover { background: #e11d48; color: white; }

/* Popups */
.icon-box {
  width: 64px; height: 64px; border-radius: 50%; margin: 0 auto;
  display: flex; align-items: center; justify-content: center; font-size: 2rem;
}
.icon-box.warning { background: #fef3c7; }
.icon-box.danger { background: #fee2e2; }

/* Buttons */
.modal-footer-custom {
  padding: 16px 24px; background: #f8fafc; display: flex; gap: 12px; justify-content: flex-end;
}
.btn-save {
  background: #3b82f6; color: white; border: none; padding: 10px 24px; border-radius: 12px; font-weight: 600;
}
.btn-save:disabled { opacity: 0.5; }

.btn-confirm-action { border: none; padding: 12px; border-radius: 12px; font-weight: 600; }
.btn-cancel-flat { background: #f1f5f9; border: none; padding: 12px; border-radius: 12px; color: #475569; }
.btn-link-custom { background: transparent; border: none; color: #64748b; font-weight: 500; }

/* Animations */
.animate-pop { animation: pop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes pop {
  from { transform: scale(0.9) translateY(10px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}
.extra-small { font-size: 0.7rem; }
.separator { height: 1px; background: #f1f5f9; }
.modal-header-custom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid #e9ecef;
}

/* Button close */
.btn-close-custom {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #6c757d;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: all 0.2s ease;
}

/* Hover */
.btn-close-custom:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #212529;
}

/* Click */
.btn-close-custom:active {
  transform: scale(0.92);
}

/* Focus (accessibility) */
.btn-close-custom:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25);
}

</style>