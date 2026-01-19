<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { adminApi } from '@/api/admin/adminApi'
import { staffValidationSchema } from '@/schemas/staff.schema'
import SuccessToast from "@/components/toasts/SuccessToast.vue";

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created'): void
}>()

const toastRef = ref<{
  show: (message: string, type?: "success" | "danger", duration?: number) => void
  hide: () => void
} | null>(null)
const loading = ref(false)

// Khởi tạo VeeValidate
const { handleSubmit, errors, setErrors, resetForm, defineField } = useForm({
  validationSchema: staffValidationSchema,
  initialValues: {
    role: 'employee'
  }
});

//  Liên kết các field (v-model & props)
const [username, usernameProps] = defineField('username',{
  validateOnModelUpdate: false,
  validateOnBlur: false,
  validateOnChange: false,
});
const [email, emailProps] = defineField('email',{
  validateOnModelUpdate: false,
  validateOnBlur: false,
  validateOnChange: false,
});
const [password, passwordProps] = defineField('password',{
  validateOnModelUpdate: false,
  validateOnBlur: false,
  validateOnChange: false,
});
const [confirmPassword, confirmPasswordProps] = defineField('confirmPassword');
const [role] = defineField('role' , {
  validateOnModelUpdate: false,
  validateOnBlur: false,
  validateOnChange: false,
});

const clearErrorsWithTimeout = (ms = 1000) => {
  setTimeout(() => {
    setErrors({
      username: undefined,
      email: undefined,
      password: undefined,
      confirmPassword: undefined,
    })
  }, ms)
}

// 3. Xử lý Submit
const handleCreate = handleSubmit(
    // TH1: Frontend Hợp lệ -> Gọi API
    async (values) => {
      loading.value = true
      try {
        await adminApi.register(values)
        toastRef.value?.show("Created staff successfully.", "success");
        setTimeout(() => {
          emit('created')
          emit('close')
        }, 1000)
      } catch (err: any) {
        // Bắt lỗi của BE
        const beErrors = err.response?.data?.errors;
        if (beErrors) {
          const formattedErrors: Record<string, string> = {};
          for (const key in beErrors) {
            formattedErrors[key] = Array.isArray(beErrors[key]) ? beErrors[key][0] : beErrors[key];
          }
          // Hiển thị lỗi từ BE
          setErrors(formattedErrors);
          // Clear lỗi
          clearErrorsWithTimeout(3000);
        }
      } finally {
        loading.value = false
      }
    },
    ({ errors }) => {

      clearErrorsWithTimeout(1000);
    }
)
</script>

<template>
  <SuccessToast ref="toastRef" />

  <div class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content border-0 shadow-2xl animate-fade-in">
        <div class="modal-header bg-white p-4 border-bottom shadow-sm">
          <div class="d-flex align-items-center">
            <div class="icon-box rounded-3 me-3" style="background-color: #e0f2fe;">
              <i class="bi bi-person-plus-fill fs-4" style="color: #0ea5e9;"></i>
            </div>
            <div>
              <h5 class="modal-title fw-bold mb-0" style="color: #0c4a6e;">Create New Staff</h5>
              <small class="text-muted">Fill in the information to register a new member</small>
            </div>
          </div>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>

        <div class="modal-body p-4 bg-light-subtle">
          <form @submit.prevent="handleCreate" class="row g-4">

            <div class="col-md-6">
              <label class="form-label fw-semibold required">Username</label>
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0"><i class="bi bi-person"></i></span>
                <input
                    v-model="username"
                    v-bind="usernameProps"
                    class="form-control border-start-0 ps-0"
                    :class="{ 'is-invalid': errors.username }"
                />
                <div class="invalid-feedback" v-if="errors.username">{{ errors.username }}</div>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-semibold required">Email Address</label>
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0"><i class="bi bi-envelope"></i></span>
                <input
                    v-model="email"
                    v-bind="emailProps"
                    class="form-control border-start-0 ps-0"
                    :class="{ 'is-invalid': errors.email }"
                />
                <div class="invalid-feedback" v-if="errors.email">{{ errors.email }}</div>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-semibold required">Password</label>
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0"><i class="bi bi-shield-lock"></i></span>
                <input
                    type="password"
                    v-model="password"
                    v-bind="passwordProps"
                    class="form-control border-start-0 ps-0"
                    :class="{ 'is-invalid': errors.password }"
                />
                <div class="invalid-feedback" v-if="errors.password">{{ errors.password }}</div>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-semibold required">Confirm Password</label>
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0"><i class="bi bi-shield-check"></i></span>
                <input
                    type="password"
                    v-model="confirmPassword"
                    v-bind="confirmPasswordProps"
                    class="form-control border-start-0 ps-0"
                    :class="{ 'is-invalid': errors.confirmPassword }"
                />
                <div class="invalid-feedback" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</div>
              </div>
            </div>

            <div class="col-md-12">
              <label class="form-label fw-semibold">User Role</label>
              <div class="role-selector d-flex gap-3">
                <div class="form-check card p-3 flex-fill border-1 shadow-sm clickable" :class="{'active-role': role === 'employee'}">
                  <input class="form-check-input" type="radio" value="employee" v-model="role" id="roleEmp">
                  <label class="form-check-label w-100" for="roleEmp">
                    <span class="d-block fw-bold">Employee</span>
                    <small class="text-muted">Standard access to system features.</small>
                  </label>
                </div>
                <div class="form-check card p-3 flex-fill border-1 shadow-sm clickable" :class="{'active-role': role === 'manager'}">
                  <input class="form-check-input" type="radio" value="manager" v-model="role" id="roleMgr">
                  <label class="form-check-label w-100" for="roleMgr">
                    <span class="d-block fw-bold">Manager</span>
                    <small class="text-muted">Full access to manage teams and data.</small>
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div class="modal-footer bg-light p-3">
          <button class="btn btn-outline-secondary px-4 fw-semibold" @click="emit('close')" :disabled="loading">
            Cancel
          </button>
          <button
              class="btn btn-primary px-4 fw-semibold d-flex align-items-center"
              :disabled="loading"
              @click="handleCreate"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-check-circle me-2"></i>
            {{ loading ? 'Creating...' : 'Create Staff' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show"></div>
</template>

<<style scoped>

.input-group:has(.is-invalid) .input-group-text,
.input-group:has(.is-invalid) .form-control {
  border-color: #f87171 !important;
  color: #ef4444;
}

/* 2. Trạng thái FOCUS: Chuyển sang Sky Blue rực rỡ */
.input-group:focus-within .input-group-text {
  border-color: #0ea5e9 !important;
  color: #0ea5e9 !important;
}

.input-group:focus-within .form-control {
  border-color: #0ea5e9 !important;
}

.input-group:focus-within {
  /* Đổ bóng kiểu Azure mềm mại */
  box-shadow: 0 0 0 0.25rem rgba(14, 165, 233, 0.15);
}

/* 3. Nút bấm chính (Primary Button) */
.btn-primary {
  background-color: #0ea5e9;
  border-color: #0ea5e9;
}

.btn-primary:hover {
  background-color: #0284c7;
  border-color: #0284c7;
}

/* 4. Role Selector: Màu xanh nhạt khi chọn */
.active-role {
  border-color: #0ea5e9 !important;
  background-color: #f0f9ff !important; /* Sky 50 */
}
/* --- 1. CẤU TRÚC CHUNG & ANIMATION --- */
.required::after {
  content: " *";
  color: #dc3545;
  font-weight: bold;
}

.animate-fade-in {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.icon-box {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
}

/* --- 2. XỬ LÝ INPUT GROUP (ICON + INPUT) --- */

/* Trạng thái bình thường */
.input-group-text {
  background-color: #fff;
  color: #6c757d;
  transition: all 0.2s ease;
}

.form-control {
  transition: all 0.2s ease;
}

/* A. TRẠNG THÁI LỖI (INVALID) */
/* Khi có lỗi: Cả icon và input đều biến thành màu đỏ */
.input-group:has(.is-invalid) .input-group-text {
  border-color: #dc3545 !important;
  color: #dc3545;
}

.input-group:has(.is-invalid) .form-control {
  border-color: #dc3545 !important;
}

/* B. TRẠNG THÁI TẬP TRUNG (FOCUS) - Quan trọng nhất */
/* Khi click vào bất kỳ đâu trong group: Cả icon và input sẽ chuyển sang màu xanh (Primary)
   Kể cả khi đang có lỗi, màu xanh của Focus sẽ được ưu tiên để người dùng gõ */
.input-group:focus-within .input-group-text {
  border-color: #0d6efd !important;
  color: #0d6efd !important;
  background-color: #fff;
}

.input-group:focus-within .form-control {
  border-color: #0d6efd !important;
  box-shadow: none !important; /* Tắt shadow mặc định của Bootstrap để viền sạch hơn */
}

/* Đổ bóng nhẹ bao quanh cả cụm khi đang focus */
.input-group:focus-within {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
  border-radius: 0.375rem;
}

/* C. XỬ LÝ VIỀN GIỮA (Junction) */
/* Xóa vạch chia giữa icon và input khi đang lỗi hoặc đang focus để tạo thành 1 khối */
.input-group:has(.is-invalid) .border-end-0,
.input-group:focus-within .border-end-0 {
  border-right-color: transparent !important;
}

.input-group:has(.is-invalid) .border-start-0,
.input-group:focus-within .border-start-0 {
  border-left-color: transparent !important;
}


/* --- 3. ROLE SELECTOR (RADIO CARDS) --- */
.clickable {
  cursor: pointer;
  transition: all 0.2s ease;
}

.clickable:hover {
  border-color: #0d6efd;
  background-color: #f8fbff;
}

.active-role {
  border-color: #0d6efd !important;
  background-color: #f0f7ff !important;
  border-width: 2px !important;
}

.form-check-input {
  cursor: pointer;
}

.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}
/* Thêm vào phần style */
.invalid-feedback {
  transition: opacity 0.5s ease;
  display: block; /* Ép luôn hiển thị để transition hoạt động */
  min-height: 18px; /* Giữ khoảng trống để tránh giật khung */
}

/* Nếu errors rỗng thì ẩn đi bằng opacity */
.invalid-feedback:empty {
  opacity: 0;
}
.form-check-label {
  cursor: pointer;
}
</style>