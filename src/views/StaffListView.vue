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
        <q-btn class="col-md-2 btn-add-open" @click="handleOpenAdd">Thêm nhân sự mới</q-btn>
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
          <td class="col-md-2 c-center row justify-center">
            <q-icon class="func" @click="handleOpenUpdate(staff._id)" name="visibility"></q-icon>
            <q-icon class="func" @click="handleDelete(staff._id)" name="delete"></q-icon>
          </td>
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
            <q-btn label="Thêm" class="btn" @click="handleCreate" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="openUpdate">
        <q-card style="min-width: 1000px">
          <q-card-section>
            <div class="text-h6">Thông tin chi tiết</div>
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
            <q-btn label="Cập nhật" class="btn" @click="handleUpdate" />
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
    const openUpdate = ref()
    const updateId = ref();
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
    })

    watchEffect(async () => {
      staffs.value = await staffService.getAll(search.value)
    })

    const handleOpenAdd = () => {
      openAdd.value = true
      fullName.value = null
      phoneNumber.value = null
      role.value = null
      address.value = null
      email.value = null
    }

    const handleOpenUpdate = (id) => {
      openUpdate.value = true
      const staff = staffs.value.filter((staff) => staff._id === id)[0]
      updateId.value = staff._id;
      fullName.value = staff.fullName
      phoneNumber.value = staff.phoneNumber
      role.value = staff.role
      address.value = staff.address
      email.value = staff.email
    }

    const handleUpdate = async () => {
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
        const res = await staffService.update(updateId.value ,payload)
        const index = staffs.value.findIndex((staff) => staff._id === res._id);
        isLoading.value = false;
        staffs.value[index].fullName = res.fullName;
        staffs.value[index].email = res.email;
        staffs.value[index].role = res.role;
        toast.success('Cập nhật thông tin nhân viên thành công!')
      } catch (error) {
        isLoading.value = false
        if (error.response.status === 400) {
          toast.error(error.response.data.message)
          return;
        }
        toast.error('Xảy ra lỗi trong quá trình cập nhật nhân viên mới!')
      }
    }

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

    const handleDelete = async (id) =>{
      const confirm = window.confirm('Bạn có muốn xóa nhân viên này không ?');

      if(!confirm){
        return;
      }
      const index = staffs.value.findIndex((staff) => staff._id === id);
      try {
        await staffService.delete(id);
        staffs.value.splice(index, 1);
        toast.success('Xóa nhân viên thành công');
      } catch (error) {
        toast.error('Xảy ra lỗi trong quá trình xóa nhân viên');
      }

    }

    return {
      isLoading,
      address,
      email,
      phoneNumber,
      fullName,
      roleOption,
      openUpdate,
      role,
      openAdd,
      staffs,
      search,
      handleCreate,
      handleOpenUpdate,
      handleOpenAdd,
      handleUpdate,
      handleDelete
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

.func {
  cursor: pointer;
  margin: 0 10px;
  font-size: 28px;
}

.func:hover {
  color: red;
}

.btn {
  padding: 10px 100px;
  font-weight: bold;
  background-color: #1976d2;
  color: white;
}
</style>
