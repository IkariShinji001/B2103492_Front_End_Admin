<template>
  <q-layout view="lhh Lpr lFf">
    <q-header hidden class="xs">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <q-toolbar-title>Menu</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer
      class="drawer"
      v-model="drawer"
      :breakpoint="600"
      :mini="miniState"
      show-if-above
      bordered
      @mouseover="miniState = false"
      @mouseout="miniState = true"
    >
      <q-list padding>
        <router-link to="/">
          <q-item class="logo-container">
            <img src="../assets//675081_18298235_3340912_0d101093_image.jpg" />
          </q-item>
        </router-link>

        <q-separator spaced />
        <q-item-label header class="option-header">Quản lý sách</q-item-label>
        <router-link
          :to="`${option.path}`"
          v-for="(option, index) in drawerOptionBooks"
          :key="index"
        >
          <q-item clickable v-ripple class="option">
            <q-item-section avatar>
              <q-icon :name="option.iconName" :class="option.class" />
            </q-item-section>
            <q-item-section class="option-text"> {{ option.text }} </q-item-section>
          </q-item>
        </router-link>

        <q-separator spaced />
        <q-item-label header class="option-header">Quản lý bộ sách</q-item-label>
        <router-link
          :to="`${option.path}`"
          v-for="(option, index) in drawerOptionSeries"
          :key="index"
        >
          <q-item clickable v-ripple class="option">
            <q-item-section avatar>
              <q-icon :name="option.iconName" :class="option.class" />
            </q-item-section>
            <q-item-section class="option-text"> {{ option.text }} </q-item-section>
          </q-item>
        </router-link>

        <q-separator spaced />
        <q-item-label header class="option-header">Quản lý Kho</q-item-label>
        <router-link
          :to="`${option.path}`"
          v-for="(option, index) in drawerOptionInventory"
          :key="index"
        >
          <q-item clickable v-ripple class="option">
            <q-item-section avatar>
              <q-icon :name="option.iconName" :class="option.class" />
            </q-item-section>
            <q-item-section class="option-text"> {{ option.text }} </q-item-section>
          </q-item>
        </router-link>

        <div v-if="role === 'admin'">
          <q-separator spaced />
          <q-item-label header class="option-header">Quản lí nhân sự</q-item-label>
          <router-link :to="`${option.path}`" v-for="(option, index) in staffOption" :key="index">
            <q-item clickable v-ripple class="option">
              <q-item-section avatar>
                <q-icon :name="option.iconName" :class="option.class" />
              </q-item-section>
              <q-item-section class="option-text"> {{ option.text }} </q-item-section>
            </q-item>
          </router-link>
        </div>
      </q-list>
      <q-item>
        <q-item-section>
          <q-btn @click="handleSignOut" class="btn-sign_out">Đăng xuất</q-btn>
        </q-item-section>
      </q-item>
    </q-drawer>
    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/auth.service'
import { useToast } from 'vue-toastification'
export default {
  name: 'DashBoard',
  setup() {
    const router = useRouter()
    const toast = useToast()
    const miniState = ref(true)
    const drawer = ref(false)
    const role = ref();

    onBeforeMount(() => {
      role.value = localStorage.getItem('role');
    })
    const drawerOptionBooks = [
      { iconName: 'inbox', class: 'icon', text: 'Sách', path: '/books' },
      { iconName: 'add_box', class: 'icon', text: 'Thêm sách mới', path: '/books/create' },
      { iconName: 'view_list', class: 'icon', text: 'Thể loại sách', path: '/books/genres' },
      { iconName: 'add_box', class: 'icon', text: 'Thêm loại sách', path: '/books/genres/create' }
    ]

    const drawerOptionSeries = [
      {
        iconName: 'list',
        class: 'icon',
        text: 'Bộ sách',
        path: '/series'
      }
    ]

    const drawerOptionInventory = [
      { iconName: 'inbox', class: 'icon', text: 'Lịch sử nhập kho', path: '/books/inventory' }
    ]

    const staffOption = [
      { iconName: 'inbox', class: 'icon', text: 'Danh sách nhân sự', path: '/staffs' }
    ]

    const handleSignOut = async () => {
      try {
        const result = await authService.signOut()
        if (result) {
          router.push('/login')
          toast.success('Đăng xuất thành công')
        }
      } catch (error) {
        toast.error('Bị lỗi')
      }
    }

    return {
      role,
      miniState,
      drawer,
      drawerOptionBooks,
      drawerOptionInventory,
      handleSignOut,
      drawerOptionSeries,
      staffOption
    }
  }
}
</script>

<style>
.drawer {
  background-color: #1976d2;
}

.icon {
  color: white;
}

img {
  width: 50%;
}

.logo-container {
  display: flex;
  justify-content: center;
}

a {
  text-decoration: none !important;
}
.icon {
  font-size: 25px;
}

.option-text {
  font-size: 17px;
  color: white;
}
.option:hover {
  background-color: #1606cccc;
}
.option-header {
  font-size: 20px;
  color: white;
}

.btn-sign_out {
  background-color: #819ab3;
  color: white;
}
</style>
