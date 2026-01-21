import { createRouter, createWebHistory } from 'vue-router'
import AdminHomeView from '@/views/admin/AdminDashboard.vue'
import ManagerHomeView from '@/views/manager/pages/HomeView.vue'
import EmployeeHomeView from '@/views/employee/pages/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import NotFound from '@/views/errorNotFound/404.vue'
import {useAuthStore} from '@/stores/authStore'
import {useUserStore} from '@/stores/userStore'
import Profile from "@/views/admin/pages/Profile.vue";
import OverviewTab from "@/views/admin/tabs/OverviewTab.vue";
import ManagersTab from "@/views/admin/tabs/ManagersTab.vue";
import EmployeesTab from "@/views/admin/tabs/EmployeesTab.vue";
import UnassignedTab from "@/views/admin/tabs/UnassignedTab.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      redirect: (_to) => {
        return { name: 'login' }
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/admin/home',
      component: AdminHomeView,
      children: [
        { path: '', redirect: { name: 'admin.overview' } },
        { path: 'overview', name: 'admin.overview', component: OverviewTab },
        { path: 'managers', name: 'admin.managers', component: ManagersTab },
        { path: 'employees', name: 'admin.employees', component: EmployeesTab },
        { path: 'unassigned', name: 'admin.unassigned', component: UnassignedTab }
      ]
    },

    {
      path: '/admin/profile',
      name: 'admin.profile',
      component: Profile,
      meta: { role: 'admin' },
    },
    {
      path: '/manager/home',
      name: 'manager.home',
      component: ManagerHomeView,
      meta: { role: 'manager' },
    },
    {
      path: '/employee/home',
      name: 'employee.home',
      component: EmployeeHomeView,
      meta: { role: 'employee' },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "404",
      component: NotFound,
    }
  ],
})
router.beforeEach(async (to, _from, next) => {
  const userStore = useUserStore()
  const authStore = useAuthStore()
  console.log("is Logged : ", authStore.isLoggedIn)
  console.log("is auth ",userStore.isAuthenticated)
  if(!authStore.isLoggedIn || !userStore.isAuthenticated) {
      if (to.name === 'login') {
        return next()
      }
    return next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  }
  const role = userStore.role ? userStore.role : undefined
  const homeRoute = () => {
    if (userStore.isAdmin) return 'admin.home'
    if (userStore.isManager) return 'manager.home'
    return 'employee.home'
  }
  if (to.name === 'login' || to.path === '/') {
    const target = homeRoute()
    console.log('target', target)
    if (to.name !== target) {
      return next({ name: target })
    }
  }
  if (to.meta.role && to.meta.role !== role) {
    const target = homeRoute()
    if (to.name !== target) {
      return next({ name: target })
    }
  }
  next()
})

export default router
