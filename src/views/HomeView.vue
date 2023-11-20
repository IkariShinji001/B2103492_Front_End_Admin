<template>
  <q-page>
    <head-title
      text="Trang Chủ"
      width="fix-content"
      fontSize="2em"
      class="lt-sm-hidden"
    ></head-title>
    <section class="row">
      <div class="col-sm-6 col-xs-12" v-for="(card, i) in cardInfor">
        <card-infor
          :key="i"
          :title="card.title"
          :text="totalWaitingOrder"
          :height="card.height"
          :background-color="card.backgroundColor"
          :margin="card.margin"
          :unit="card.unit"
        >
        </card-infor>
      </div>
      <div class="col-md-6"><h2 style="text-align: center;">Thế giới tiểu thuyết</h2></div>
    </section>

    <div class="banner-container row justify-around">
      <div class="col-md-6"><h2 style="text-align: center;">Các banner mới</h2></div>
      <img src="../assets/banner.jpg" class="banner" />
    </div>
  </q-page>
</template>

<script>
import HeadTitle from '../components/HeadTitle.vue'
import Card from '../components/Card.vue'
import orderSeries from '../services/order.service'
import { onBeforeMount, ref } from 'vue'
export default {
  name: 'HomeView',
  components: {
    'head-title': HeadTitle,
    'card-infor': Card
  },
  setup() {
    const totalWaitingOrder = ref(0)
    onBeforeMount(async () => {
      totalWaitingOrder.value = (await orderSeries.getAllOrder('Chờ xác nhận')).length
    })
    const cardInfor = ref([
      {
        title: 'Số đơn đang đợi duyệt',
        value: null,
        width: '90%',
        height: '20vh',
        backgroundColor: '#42a5f5!important',
        margin: '10px 20px',
        unit: 'đơn hàng'
      }
    ])

    return {
      cardInfor,
      totalWaitingOrder
    }
  }
}
</script>

<style scoped>
.banner-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
