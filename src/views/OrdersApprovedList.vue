<template>
  <q-page>
    <head-title text="Đơn hàng đã được duyệt" font-size="2em"></head-title>
    <section class="wrapper">
      <div class="row justify-between">
        <card-order-info
          v-if="approveOrder"
          title="Số đơn đã được duyệt"
          :value="approveOrderCount"
        ></card-order-info>

        <card-order-info
          v-if="approveOrder"
          title="Số đơn đã chấp nhận"
          :value="acceptedOrderCount"
        ></card-order-info>

        <card-order-info
          v-if="approveOrder"
          title="Số đơn đã từ chối"
          :value="rejectOrderCount"
        ></card-order-info>
      </div>

      <q-select
        outlined
        class="select"
        :options="orderOptions"
        label="Lọc đơn hàng theo trạng thái"
        v-model="orderOptionValue"
        clearable
      >
      </q-select>

      <table style="width: 100%; margin-top: 30px;">
        <tr class="header-table">
          <th class="col-md-1">STT</th>
          <th class="col-md-3">Mã đơn hàng</th>
          <th class="col-md-2">Giá đơn hàng</th>
          <th class="col-md-2">Người duyệt</th>
          <th class="col-md-3">Trạng thái</th>
        </tr>

        <tr v-for="(order, i) in approveOrder" :key="i">
          <td class="col-md-1">{{ i }}</td>
          <td class="col-md-3">{{ order._id }}</td>
          <td class="col-md-2">{{ new Intl.NumberFormat().format(order.orderPrice) + ' đ' }}</td>
          <td class="col-md-2">{{ order.staff.fullName }}</td>
          <td class="col-md-3">{{ order.status }}</td>
        </tr>
      </table>
    </section>
  </q-page>
</template>

<script>
import HeadTitle from '../components/HeadTitle.vue'
import CardOrderInfo from '../components/CardOrderInfo.vue'
import orderService from '../services/order.service'
import { onBeforeMount, ref, watchEffect } from 'vue'
export default {
  name: 'OrdersApprovedList',
  components: {
    'head-title': HeadTitle,
    'card-order-info': CardOrderInfo
  },
  setup() {
    const approveOrder = ref()
    const approveOrderCount = ref()
    const acceptedOrderCount = ref()
    const rejectOrderCount = ref()
    const orderOptions = ref(['Chấp nhận đơn hàng', 'Từ chối đơn hàng'])
    const orderOptionValue = ref()
    const onBeforeMountCompleted = ref(false);

    onBeforeMount(async () => {
      try {
        approveOrder.value = await orderService.getAllOrder()
        approveOrder.value = approveOrder.value.filter(
          (order) => order.status === 'Chấp nhận đơn hàng' || order.status === 'Từ chối đơn hàng'
        )
        approveOrderCount.value = approveOrder.value.length
        acceptedOrderCount.value = approveOrder.value.reduce((count, order) => {
          if (order.status === 'Chấp nhận đơn hàng') {
            return count + 1
          }
          return count
        }, 0)

        rejectOrderCount.value = approveOrder.value.reduce((count, order) => {
          if (order.status === 'Từ chối đơn hàng') {
            return count + 1
          }
          return count
        }, 0)
        onBeforeMountCompleted.value = true;
      } catch (error) {
        console.log(error)
      }
    })

    watchEffect(async () => {
      if (onBeforeMountCompleted.value) {
        let statusFilter = null;
        if (orderOptionValue.value === 'Chấp nhận đơn hàng') {
          statusFilter = 'Chấp nhận đơn hàng'
        } else if (orderOptionValue.value === 'Từ chối đơn hàng') {
          statusFilter = 'Từ chối đơn hàng'
        }
        approveOrder.value = await orderService.getAllOrder(statusFilter);

        console.log(approveOrder.value);
      }
    })

    return {
      approveOrderCount,
      approveOrder,
      acceptedOrderCount,
      rejectOrderCount,
      orderOptions,
      orderOptionValue
    }
  }
}
</script>

<style scoped> 
.wrapper {
  width: 90%;
  margin: 0 auto;
}

.select {
  margin-top: 20px;
  font-size: 20px;
}

table{
  border-collapse: collapse;
}


.header-table{
  display: fixed;
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

</style>
