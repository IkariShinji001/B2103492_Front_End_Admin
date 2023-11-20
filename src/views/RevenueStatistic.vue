<template>
  <q-page>
    <head-title text="Thống kê doanh thu" font-size="2em"></head-title>
    <div>
      <q-card class="card" v-if="books">
        <p class="title">Tổng doanh thu</p>
        <q-separator />
        <q-card-section>
          <p class="total-all">{{ formatPrice(totalRevenue) }} đ</p>
        </q-card-section>
      </q-card>
      <h5 class="h5">Bảng thống kê doanh thu theo từng sản phẩm</h5>
      <table style="width: 95%; margin: 0 auto" v-if="books">
        <tr class="row">
          <th class="col-md-1 center">STT</th>
          <th class="col-md-2 center">Ảnh</th>
          <th class="col-md-4">Tên sách</th>
          <th class="col-md-1">Volume</th>
          <th class="col-md-2">Số lượng bán</th>
          <th class="col-md-2">Doanh thu</th>
        </tr>

        <div class="table-body">
          <tr class="row" v-for="(book, i) in books" :key="i">
            <td class="col-md-1 center stt-container">{{ i }}</td>
            <td class="col-md-2 img-container"><img :src="book.images[0]" /></td>
            <td class="col-md-4 name-container">{{ book.bookName }}</td>
            <td class="col-md-1 name-container">{{ book.bookVolume }}</td>
            <td class="col-md-2 name-container">{{ book.totalQuantity }}</td>
            <td class="col-md-2 name-container revenue">{{ formatPrice(book.totalRevenue) }} đ</td>
          </tr>
        </div>
      </table>
    </div>
  </q-page>
</template>

<script>
import { ref, onBeforeMount, computed } from 'vue'
import HeadTitle from '../components/HeadTitle.vue'
import orderService from '../services/order.service'
import Card from '../components/Card.vue'
export default {
  components: {
    'head-title': HeadTitle,
    card: Card
  },
  setup() {
    const books = ref()

    onBeforeMount(async () => {
      books.value = await orderService.getRevenueStatistic()
    })

    const formatPrice = (price) => {
      return new Intl.NumberFormat().format(price)
    }

    const totalRevenue = computed(() => {
      const total = books.value.reduce((total, book) => (total += book.totalRevenue), 0)
      return total;
    })

    return {
      formatPrice,
      books,
      totalRevenue
    }
  }
}
</script>

<style scoped>
.h5 {
  text-align: center;
  font-size: 28px;
}

table {
  border-collapse: collapse;
}

th {
  text-align: left;
  font-size: 20px;
  padding: 5px 0;
  background-color: rgb(41, 53, 147);
  color: white;
}

.center {
  text-align: center;
}

.img-container {
  display: flex;
  justify-content: center;
}

.name-container {
  display: flex;
  align-items: center;
}

.stt-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.table-body {
  margin: 0 auto;
  height: 600px;
  overflow: scroll;
}

td {
  width: 100%;
  font-size: 17px;
}

tr:nth-child(odd) {
  background-color: aliceblue;
}

.revenue {
  color: #c92127;
  font-size: 20px;
  font-weight: bold;
}

.card{
  width: 25%;
  background-color: rgb(41, 53, 147);
  margin-left: 34px;
}

.title{
  margin-left: 20px;
  text-align: left;
}

p{
  color: white;
  font-size: 20px;
  text-align: center;
}

.total-all{
  font-size: 24px;
  font-weight: bold;
}
</style>
