<template>
  <q-page>
    <head-title text="Trang Chủ" width="fix-content" fontSize="2em" class="lt-sm-hidden"></head-title>
    <section class="row">
      <div class="col-sm-4 col-xs-12" v-for="(card, i) in cardInfor">
        <card-infor
          :key="i"
          :title="card.title"
          :text="card.text"
          :height="card.height"
          :background-color="card.backgroundColor"
          :margin="card.margin"
          :unit="card.unit"
        >
        </card-infor>
      </div>
    </section>
  </q-page>
</template>

<script>
import HeadTitle from '../components/HeadTitle.vue'
import Card from '../components/Card.vue'
import { ref } from 'vue'
export default {
  name: 'HomeView',
  components: {
    'head-title': HeadTitle,
    'card-infor': Card
  },
  setup() {
    const cardInfor = ref([
      {
        title: 'Số đơn đang đợi duyệt',
        value: null,
        width: '90%',
        height: '20vh',
        backgroundColor: '#42a5f5!important',
        margin: '10px 20px',
        unit: 'đơn hàng'
      },
      {
        title: 'Số đơn đang vận chuyển',
        value: null,
        width: '90%',
        height: '20vh',
        backgroundColor: '#1976d2!important',
        margin: '10px 20px',
        unit: 'đơn hàng'
      },
      {
        title: 'Doanh thu tháng này',
        value: null,
        width: '90%',
        height: '20vh',
        backgroundColor: '#0d47a1!important',
        margin: '10px 20px',
        unit: 'đ'
      }
    ])

    return {
      cardInfor
    }
  }
}
</script>

<style scoped></style>
