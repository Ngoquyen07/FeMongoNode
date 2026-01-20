<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api/admin/adminApi'
import CreateEmployeeModal from '../modals/CreateEmployeeModal.vue'
const isLoading = ref(true)
const overview = ref({
  totalStaff: 0,
  totalManagers: 0,
  totalEmployees: 0,
  totalOrphans: 0
})
const emit = defineEmits<{
  (e: 'change-tab', tab: 'managers' | 'employees' | 'unassigned'): void
}>()
const showCreateModal = ref(false)
const fetchOverview = async () => {
  isLoading.value = true
  try {
    const res = await adminApi.getOverViewInfo()
    overview.value = res.data.data
  } catch (error) {

  } finally {
    isLoading.value = false
  }
}
onMounted(fetchOverview)
</script>

<template>
  <div class="mb-4 d-flex justify-content-between align-items-center">
    <div>
      <h4 class="fw-bold mb-1">System Overview</h4>
      <p class="text-muted mb-0 small">Real-time statistics of your organization personnel.</p>
    </div>

    <button
        class="btn btn-primary btn-lg shadow-sm"
        @click="showCreateModal = true"
    >
      <i class="bi bi-person-plus-fill me-2"></i>
      Create Employee
    </button>
  </div>

  <div class="row g-4 mb-4">
    <div class="col-md-3">
      <div class="card shadow overview-card bg-gradient-purple text-white h-100">
        <div class="card-body p-4 position-relative overflow-hidden d-flex flex-column justify-content-between">
          <div class="position-relative z-2">
            <div class="text-white-50 small text-uppercase fw-semibold ls-1 mb-2">Total Staff</div>
            <h2 class="display-5 fw-bold mb-0">
              <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"></span>
              <span v-else>{{ overview.totalStaff }}</span>
            </h2>
          </div>
          <i class="bi bi-people-fill overlay-icon text-white"></i>
        </div>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card shadow overview-card bg-gradient-blue text-white h-100 clickable"
           @click="emit('change-tab', 'managers')">
        <div class="card-body p-4 position-relative overflow-hidden d-flex flex-column justify-content-between">
          <div class="position-relative z-2">
            <div class="text-white-50 small text-uppercase fw-semibold ls-1 mb-2">Managers</div>
            <h2 class="display-5 fw-bold mb-0">
              <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"></span>
              <span v-else>{{ overview.totalManagers }}</span>
            </h2>
          </div>
          <div class="mt-3 small text-white-50 position-relative z-2">Click to manage details <i class="bi bi-arrow-right ms-1"></i></div>
          <i class="bi bi-person-badge-fill overlay-icon text-white"></i>
        </div>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card shadow overview-card bg-gradient-teal text-white h-100 clickable"
           @click="emit('change-tab', 'employees')">
        <div class="card-body p-4 position-relative overflow-hidden d-flex flex-column justify-content-between">
          <div class="position-relative z-2">
            <div class="text-white-50 small text-uppercase fw-semibold ls-1 mb-2">Employees</div>
            <h2 class="display-5 fw-bold mb-0">
              <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"></span>
              <span v-else>{{ overview.totalEmployees }}</span>
            </h2>
          </div>
          <div class="mt-3 small text-white-50 position-relative z-2">View employee list <i class="bi bi-arrow-right ms-1"></i></div>
          <i class="bi bi-person-video2 overlay-icon text-white"></i>
        </div>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card shadow overview-card bg-gradient-orange text-white h-100 clickable"
           @click="emit('change-tab', 'unassigned')">
        <div class="card-body p-4 position-relative overflow-hidden d-flex flex-column justify-content-between">
          <div class="position-relative z-2">
            <div class="text-white-50 small text-uppercase fw-semibold ls-1 mb-2">Unassigned</div>
            <h2 class="display-5 fw-bold mb-0">
              <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"></span>
              <span v-else>{{ overview.totalOrphans }}</span>
            </h2>
          </div>
          <div class="mt-3 small text-white-50 position-relative z-2 text-warning-light">Requires attention <i class="bi bi-exclamation-circle ms-1"></i></div>
          <i class="bi bi-person-x-fill overlay-icon text-white"></i>
        </div>
      </div>
    </div>
  </div>

  <CreateEmployeeModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="() => { showCreateModal = false; fetchOverview() }"
  />
</template>

<style scoped>
/* --- Cấu trúc Card cơ bản --- */
.overview-card {
  border: none;
  border-radius: 16px; /* Bo góc mềm mại hơn */
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  /* Đổ bóng nhẹ mặc định */
  box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
}

/* Typography phụ */
.ls-1 { letter-spacing: 1px; }
.text-warning-light { color: #fff3cd !important; } /* Màu vàng nhạt cho text phụ */

/* --- Định nghĩa các dải màu Gradient --- */
.bg-gradient-purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.bg-gradient-blue {
  background: linear-gradient(135deg, #0061f2 0%, rgba(105, 168, 255, 0.85) 100%);
}
.bg-gradient-teal {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}
.bg-gradient-orange {
  background: linear-gradient(135deg, #f09819 0%, #edde5d 100%);
}


/* --- Icon nền trang trí (Overlay Icon) --- */
.overlay-icon {
  position: absolute;
  right: -25px;
  bottom: -35px;
  font-size: 8rem; /* Kích thước rất lớn */
  opacity: 0.15; /* Làm mờ để không che chữ */
  transform: rotate(-15deg); /* Xoay nhẹ tạo động lực */
  transition: all 0.4s ease-out;
  pointer-events: none; /* Không chặn click */
  z-index: 1;
}

/* --- Hiệu ứng Hover cho các thẻ Clickable --- */
.clickable {
  cursor: pointer;
}

.clickable:hover {
  transform: translateY(-8px) scale(1.01);
  /* Đổ bóng màu tương ứng khi hover */
}
.clickable.bg-gradient-blue:hover { box-shadow: 0 12px 24px -6px rgba(0, 97, 242, 0.5) !important; }
.clickable.bg-gradient-teal:hover { box-shadow: 0 12px 24px -6px rgba(17, 153, 142, 0.5) !important; }
.clickable.bg-gradient-orange:hover { box-shadow: 0 12px 24px -6px rgba(240, 152, 25, 0.5) !important; }


/* Hiệu ứng động cho Icon khi hover vào thẻ cha */
.clickable:hover .overlay-icon {
  transform: rotate(0deg) scale(1.1) translateX(10px);
  opacity: 0.25;
}
</style>