import { createRouter, createWebHistory } from 'vue-router'
import AuthService from '../services/auth.service'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'home',
      meta: {
        title: 'Đăng nhập'
      },
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/',
      name: 'dashboard',
      meta: {
        title: 'Trang quản lý',
        requiresAuth: true
      },
      component: () => import('../layouts/DashboardView.vue'),
      children: [
        {
          path: '/',
          component: () => import('../views/HomeView.vue')
        },
        {
          path: '/books',
          component: () => import('../views/BookListView.vue')
        },
        {
          path: '/books/genres',
          component: () => import('../views/GenresListView.vue')
        },
        {
          path: '/books/inventory',
          component: () => import('../views/InventoryHistoryView.vue')
        },
        {
          path: '/books/inventory/:id',
          component: () => import('../views/AddInventoryView.vue')
        },
        {
          path: '/books/genres/create',
          component: () => import('../views/CreateGenresView.vue')
        },
        {
          path: '/books/create',
          component: () => import('../views/CreateBookView.vue')
        },
        {
          path: '/books/:id',
          component: () => import('../views/DetailBookView.vue')
        },
        {
          path: '/series',
          component: () => import('../views/SeriesListView.vue')
        },
        {
          path: '/series/:id',
          component: () => import('../views/SeriesDetailView.vue')
        },
        {
          path: '/staffs',
          component: () => import('../views/StaffListView.vue')
        },{
          path: '/orders/waiting',
          component: () => import('../views/OrdersWaitingList.vue')
        },{
          path: '/orders/approved',
          component: () => import('../views/OrdersApprovedList.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      meta: {
        title: 'Không tồn tại trang web'
      },
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const isLoginState = await AuthService.verifyAccessToken()
  if (to.meta.requiresAuth && !isLoginState) {
    next('/login')
  } else if (to.path === '/login' && isLoginState) {
    next('/')
  } else {
    document.title = to.meta.title
    next()
  }
})

export default router
