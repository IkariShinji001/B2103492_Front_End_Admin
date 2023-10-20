<template>
  <q-page>
    <loading-circle :isShow="isLoading"> </loading-circle>
    <head-title text="Danh sách nhân sự" font-size="2em"></head-title>
    <div class="wrapper">
      <div class="row justify-between search">
        <q-input
          class="input col-md-9"
          label="Tìm theo tên hoặc theo mã nhân viên"
          outlined
          v-model="search"
        ></q-input>
        <q-btn class="col-md-2 btn-add-open" @click="openAdd = true">Thêm nhân sự mới</q-btn>
      </div>

      <table style="width: 100%">
        <tr class="row">
          <th class="col-md-1 c-center">STT</th>
          <th class="col-md-2">Mã nhân viên</th>
          <th class="col-md-3">Họ và tên</th>
          <th class="col-md-2">Email</th>
          <th class="col-md-2">Chức vụ</th>
          <th class="col-md-2 c-center">Chức năng</th>
        </tr>

        <tr class="row" v-for="(staff, i) in staffs" :key="staff._id">
          <td class="col-md-1 c-center">{{ i }}</td>
          <td class="col-md-2">{{ staff.staffID }}</td>
          <td class="col-md-3">{{ staff.fullName }}</td>
          <td class="col-md-2">{{ staff.email }}</td>
          <td class="col-md-2">{{ staff.role === 'admin' ? 'Quản lí' : 'Nhân viên' }}</td>
          <td class="col-md-2 c-center">Chức năng</td>
        </tr>
      </table>

      <q-dialog v-model="openAdd">
        <q-card style="min-width: 1000px">
          <q-card-section>
            <div class="text-h6">Thêm nhân viên mới</div>
          </q-card-section>
          <div class="text-h6 text-center">Thông tin nhân viên</div>
          <q-card-section class="q-pt-none row">
            <q-input
              v-model="fullName"
              class="col-12 input"
              outlined
              label="Họ và tên(*)"
            ></q-input>
            <q-input
              v-model.number="phoneNumber"
              class="col-12 input"
              outlined
              type="number"
              label="Số điện thoại(*)"
            ></q-input>
            <q-select
              outlined
              v-model="role"
              class="col-12 input"
              label="Chức vụ"
              :options="roleOption"
              option-label="text"
              emit-value
              map-options
            >
            </q-select>
            <q-input v-model="email" label="Email (*)" outlined class="col-12 input"> </q-input>
            <q-input
              v-model="address"
              type="textarea"
              label="Địa chỉ (*)"
              outlined
              class="col-12 input"
            >
            </q-input>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn label="Thêm" class="btn-add" @click="handleCreate" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import staffService from '../services/staff.service'
import HeadTitle from '../components/HeadTitle.vue'
import { onBeforeMount, ref, watchEffect } from 'vue'
import isEmail from 'validator/lib/isEmail'
import validate from '../helpers/validator'
import { useToast } from 'vue-toastification'
import LoadingCircle from '../components/LoadingCircle.vue'
export default {
  name: 'StaffListView',
  components: {
    'head-title': HeadTitle,
    'loading-circle': LoadingCircle
  },
  setup() {
    const toast = useToast()
    const staffs = ref()
    const search = ref()
    const openAdd = ref()
    const role = ref()
    const address = ref()
    const email = ref()
    const phoneNumber = ref()
    const fullName = ref()
    const isLoading = ref()
    const roleOption = ref([
      {
        text: 'Quản lí',
        value: 'admin'
      },
      {
        text: 'Nhân viên',
        value: 'employee'
      }
    ])
    const fieldRequired = ['fullName', 'phoneNumber', 'role', 'address', 'email']
    onBeforeMount(async () => {
      staffs.value = await staffService.getAll()
      console.log(staffs.value)
    })

    watchEffect(async () => {
      staffs.value = await staffService.getAll(search.value)
    })

    const handleCreate = async () => {
      const payload = {
        fullName: fullName.value,
        phoneNumber: phoneNumber.value,
        role: role.value,
        address: address.value,
        email: email.value
      }

      const isQualified = validate.checkSelectedFields(payload, fieldRequired)

      if (!isQualified) {
        toast.warning('Không được để trống các trường (*)')
        return
      }

      const isValidEmail = isEmail(payload.email)

      if (!isValidEmail) {
        toast.error('Email không đúng định dạng')
        return
      }

      try {
        isLoading.value = true
        const res = await staffService.register(payload)
        console.log(res)
        isLoading.value = false
        toast.success('Thêm nhân viên mới thành công!')
      } catch (error) {
        isLoading.value = false
        if (error.response.status === 400) {
          toast.error(error.response.data.message)
          return
        }
        toast.error('Xảy ra lỗi trong quá trình thêm nhân viên mới!')
      }
    }

    return {
      address,
      email,
      phoneNumber,
      fullName,
      roleOption,
      role,
      openAdd,
      staffs,
      search,
      handleCreate
    }
  }
}
</script>

<style scoped>
.wrapper {
  width: 90%;
  margin: 0 auto;
}

.input {
  font-size: 18px;
}

.search {
  margin-top: 80px;
}

table {
  margin-top: 70px;
  border-collapse: collapse;
}

tr:nth-child(even) {
  background-color: rgb(244, 245, 247);
}

th {
  color: white;
  background-color: rgb(41, 53, 147);
  padding: 10px 0;
  font-size: 20px;
  text-align: left;
}

td {
  padding: 10px 0;
  font-size: 18px;
}

tr:nth-child(odd) {
  background-color: aliceblue;
}

.c-center {
  text-align: center;
}

.btn-add-open {
  background-color: #1976d2;
  font-weight: bold;
  color: white;
}

.text-center {
  text-align: center;
}

.input {
  margin: 10px 0;
}
</style>
