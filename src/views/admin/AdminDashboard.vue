<script setup lang="ts">
import { ref } from 'vue'
import { useAuthActions } from '@/composables/useAuthActions'

import OverviewTab from './tabs/OverviewTab.vue'
import ManagersTab from './tabs/ManagersTab.vue'
import EmployeesTab from './tabs/EmployeesTab.vue'
import UnassignedTab from './tabs/UnassignedTab.vue'
import router from "@/router";

const { logout } = useAuthActions()

type TabKey = 'overview' | 'managers' | 'employees' | 'unassigned'
const activeTab = ref<TabKey>('overview')
const handleChangeTab = (tab: TabKey) => {
  activeTab.value = tab
}
const goToProfile = () =>{
  router.push({
    name: 'admin.profile',
  })
}
</script>
<template>
  <div class="container-fluid px-4 mt-4">

    <!-- ===== HEADER ===== -->
    <header
        class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom"
    >
      <div>
        <h1 class="h3 fw-bold mb-0">Admin Dashboard</h1>
        <small class="text-muted">
          System management & user administration
        </small>
      </div>

      <button
          class="btn btn-outline-danger"
          @click="logout"
      >
        <i class="bi bi-box-arrow-right me-2"></i>
        Logout
      </button>

    </header>
    <div class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
      <button
          class="btn btn-info"
          @click="goToProfile"
      >
        Profile
      </button>
    </div>

    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <RouterLink
            class="nav-link"
            :class="{ active: $route.name === 'admin.overview' }"
            :to="{ name: 'admin.overview' }"
        >
          <i class="bi bi-speedometer2 me-1"></i>
          Overview
        </RouterLink>
      </li>

      <li class="nav-item">
        <RouterLink
            class="nav-link"
            :class="{ active: $route.name === 'admin.managers' }"
            :to="{ name: 'admin.managers' }"
        >
          Managers
        </RouterLink>
      </li>

      <li class="nav-item">
        <RouterLink
            class="nav-link"
            :class="{ active: $route.name === 'admin.employees' }"
            :to="{ name: 'admin.employees' }"
        >
          Employees
        </RouterLink>
      </li>

      <li class="nav-item">
        <RouterLink
            class="nav-link"
            :class="{ active: $route.name === 'admin.unassigned' }"
            :to="{ name: 'admin.unassigned' }"
        >
          Unassigned
        </RouterLink>
      </li>
    </ul>
    <!-- ===== CONTENT ===== -->
    <section class="card shadow-sm border-0 p-4">
      <RouterView />
    </section>

  </div>
</template>
