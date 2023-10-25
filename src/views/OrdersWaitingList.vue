<template>
  <q-page>
    <head-title text="Đơn hàng đang đợi duyệt" font-size="2em"></head-title>
    <div class="wrapper">
      <h1 class="text-h4">Danh sách đơn hàng đợi duyệt</h1>

      <card-order-info
        v-if="waitingOrders"
        title="Tổng số đơn đang đợi duyệt"
        :value="totalWaitingOrders"
      >
      </card-order-info>
      <table style="width: 100%">
        <tr class="row">
          <th class="col-md-1">STT</th>
          <th class="col-md-3">Mã đơn hàng</th>
          <th class="col-md-2">Giá đơn hàng</th>
          <th class="col-md-2">Tên khách hàng</th>
          <th class="col-md-2">Ngày đặt hàng</th>
          <th class="col-md-2">Chức năng</th>
        </tr>

        <tr class="row" v-for="(order, i) in waitingOrders" :key="i">
          <td class="col-md-1">{{ i }}</td>
          <td class="col-md-3">{{ order._id }}</td>
          <td class="col-md-2">{{ new Intl.NumberFormat().format(order.orderPrice) }} đ</td>
          <td class="col-md-2">{{ order.user.fullName }}</td>
          <td class="col-md-2">{{ extractTime(order.orderDate) }}</td>
          <td class="col-md-2">
            <q-icon
              class="detail-btn"
              title="Xem chi tiết"
              @click="handleOpenDetail(order._id)"
              name="visibility"
            ></q-icon>
          </td>
        </tr>
      </table>

      <q-dialog v-model="openDetail">
        <q-card style="min-width: 1000px; padding-bottom: 50px">
          <q-card-section>
            <h2 class="text-h4">Chi tiết đơn hàng</h2>
            <q-input
              outlined
              class="detail-input"
              label="Mã đơn hàng"
              readonly
              v-model="orderDetail._id"
            >
              <template v-slot:label>
                <span class="label">Mã đơn hàng</span>
              </template>
            </q-input>

            <div class="row justify-between">
              <q-input
                outlined
                class="detail-input col-md-6"
                label="Tên khách hàng"
                readonly
                v-model="orderDetail.user.fullName"
              >
                <template v-slot:label>
                  <span class="label">Tên khách hàng</span>
                </template>
              </q-input>

              <q-input
                outlined
                class="detail-input col-md-5"
                label="Tên khách hàng"
                readonly
                v-model="orderDetail.user.phoneNumber"
              >
                <template v-slot:label>
                  <span class="label">Số điện thoại</span>
                </template>
              </q-input>
            </div>

            <div class="row justify-between">
              <q-input
                outlined
                class="detail-input col-md-6"
                label
                readonly
                v-model="orderDetail.orderPriceDetail"
              >
                <template v-slot:label>
                  <span class="label">Giá đơn hàng</span>
                </template>
              </q-input>

              <q-input
                outlined
                class="detail-input col-md-5"
                label
                readonly
                v-model="orderDetail.orderDate"
              >
                <template v-slot:label>
                  <span class="label">Thời gian đặt hàng</span>
                </template>
              </q-input>
            </div>

            <q-input
              outlined
              class="detail-input col-md-5"
              label
              readonly
              v-model="orderDetail.address"
            >
              <template v-slot:label>
                <span class="label" type="textarea">Địa chỉ giao hàng</span>
              </template>
            </q-input>

            <q-input
              outlined
              class="detail-input col-md-5"
              label
              readonly
              v-model="orderDetail.notes"
            >
              <template v-slot:label>
                <span class="label" type="textarea">Ghi chú của khách hàng</span>
              </template>
            </q-input>
            <h2 class="text-h4">Sản phẩm</h2>
            <table style="width: 100%">
              <tr class="row">
                <th class="col-md-1">STT</th>
                <th class="col-md-6">Tên sách</th>
                <th class="col-md-1">Volume</th>
                <th class="col-md-2">Số lượng</th>
                <th class="col-md-2">Giá</th>
              </tr>
              <tr class="row" v-for="(orderDetail, i) in orderDetail.books" :key="i">
                <td class="col-md-1">{{ i }}</td>
                <td class="col-md-6">{{ orderDetail.book.name }}</td>
                <td class="col-md-1">{{ orderDetail.book.volume }}</td>
                <td class="col-md-2">{{ orderDetail.quantity }}</td>
                <td class="col-md-2">
                  {{ new Intl.NumberFormat().format(orderDetail.book.discountPrice) + ' đ' }}
                </td>
              </tr>
            </table>

            <h2 class="text-h4">Phê duyệt đơn hàng</h2>

            <q-select
              v-model="approve"
              :options="approveOptions"
              class="approve"
              label="Trạng thái đơn hàng"
            >
            </q-select>

            <q-btn class="approve-btn" @click="hanldeApproveOrder">Xác nhận</q-btn>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { onBeforeMount, ref } from 'vue'
import HeadTitle from '../components/HeadTitle.vue'
import OrderService from '../services/order.service'
import extractDateAndTime from '../helpers/extractDateAndTime'
import CardOrderInfo from '../components/CardOrderInfo.vue'
import { useToast } from 'vue-toastification'
export default {
  name: 'OrdersWaitingList',
  components: {
    'head-title': HeadTitle,
    'card-order-info': CardOrderInfo
  },
  setup() {
    const toast = useToast()
    const approveOptions = ['Chấp nhận đơn hàng', 'Từ chối đơn hàng']
    const waitingOrders = ref()
    const totalWaitingOrders = ref()
    const approve = ref()
    const orderDetail = ref()
    const openDetail = ref()

    const handleOpenDetail = (id) => {
      const selectedOrder = { ...waitingOrders.value.find((order) => order._id === id) }
      orderDetail.value = selectedOrder
      orderDetail.value.orderPriceDetail =
        new Intl.NumberFormat().format(orderDetail.value.orderPrice) + ' đ'
      orderDetail.value.orderDate = extractDateAndTime(orderDetail.value.orderDate)
      console.log(orderDetail.value)
      openDetail.value = true
    }
    onBeforeMount(async () => {
      waitingOrders.value = await OrderService.getAllOrder('Chờ xác nhận')
      totalWaitingOrders.value = waitingOrders.value.length;
    })

    const extractTime = (time) => {
      return extractDateAndTime(time)
    }

    const hanldeApproveOrder = async () => {
      const index = waitingOrders.value.findIndex((order) => order._id === orderDetail.value._id)
      try {
        await OrderService.approveOrder(orderDetail.value._id, approve.value)
        waitingOrders.value.splice(index, 1)
        totalWaitingOrders.value--
        toast.success('Đã duyệt đơn hàng thành công')
        openDetail.value = false
      } catch (error) {
        console.log(error)
        toast.error('Duyệt đơn hàng thất bại')
      }
    }

    return {
      orderDetail,
      waitingOrders,
      openDetail,
      totalWaitingOrders,
      approveOptions,
      approve,
      handleOpenDetail,
      extractTime,
      hanldeApproveOrder
    }
  }
}
</script>

<style scoped>
h1 {
  margin-top: 40px;
  text-align: center;
}
.wrapper {
  width: 90%;
  margin: 0 auto;
}

.my-card-total {
  width: 30%;
}
.text-h6 {
  text-align: center;
  color: rgb(255, 255, 255);
}
.total-waiting-value {
  font-size: 40px;
  text-align: center;
}

table {
  margin-top: 30px;
}

th {
  padding: 10px 0;
  font-size: 20px;
  color: white;
  background-color: #293593;
}

td {
  text-align: center;
  padding: 15px 0;
  font-size: 18px;
}

.detail-btn {
  font-size: 30px;
  cursor: pointer;
}

h2 {
  text-align: center;
}

.detail-btn:hover {
  color: red;
}

.detail-input {
  margin: 5px 0;
  font-size: 18px;
}
.label {
  font-size: 22px;
}

.approve {
  font-size: 20px;
}

.approve-btn {
  display: flex;
  margin: 0 auto;
  margin-top: 50px;
  padding: 15px 60px;
  background-color: #293593;
  color: white;
  font-weight: bold;
}
</style>
