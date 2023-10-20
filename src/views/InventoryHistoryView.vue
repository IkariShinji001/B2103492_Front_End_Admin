<template>
  <q-page>
    <head-title text="Quản lý kho" font-size="2em"></head-title>
    <section class="wrapper">
      <h1 class="text-center">Lịch sử nhập kho</h1>

      <q-select
      class="sort"
        label="Sắp xếp theo"
        outlined
        v-model="sortDate"
        :options="sortDateOptions"
        option-label="text"
        emit-value
        map-options
        clearable
      ></q-select>

      <table style="width: 100%">
        <tr>
          <th>STT</th>
          <th>Tên sách</th>
          <th>Volume</th>
          <th>Số lượng nhập</th>
          <th>Người nhập</th>
          <th>Ngày nhập</th>
        </tr>

        <tr v-for="(history, index) in allInventoryHistory" :key="history._id">
          <td>{{ index }}</td>
          <td>{{ history.bookName }}</td>
          <td>{{ history.volume }}</td>
          <td>{{ history.quantity }}</td>
          <td>{{ history.staffID }}</td>
          <td>{{ getDateTime(history.entryDate) }}</td>
        </tr>
      </table>
    </section>
  </q-page>
</template>

<script>
import { onBeforeMount, ref, watchEffect } from 'vue'
import HeadTitle from '../components/HeadTitle.vue'
import bookService from '../services/book.service'
import extractDateAndTime from '../helpers/extractDateAndTime'
export default {
  name: 'InventoryHistoryView',
  components: {
    'head-title': HeadTitle
  },
  setup() {
    const allInventoryHistory = ref([])
    const sortDateOptions = [
      {
        text: 'Mới nhất',
        value: -1
      },
      {
        text: 'Cũ nhất',
        value: 1
      }
    ]

    const sortDate = ref()

    const getDateTime = (timestamp) => {
      return extractDateAndTime(timestamp)
    }
    onBeforeMount(async () => {
      try {
        allInventoryHistory.value = await bookService.getAllInventoryHistory()
        console.log(allInventoryHistory.value)
      } catch (error) {
        console.log(error)
      }
    })

    watchEffect(async () =>{
      allInventoryHistory.value = await bookService.getAllInventoryHistory(sortDate.value)
    })

    return {
      allInventoryHistory,
      sortDate,
      sortDateOptions,
      getDateTime
    }
  }
}
</script>

<style scoped>
.wrapper {
  width: 90%;
  margin: 0 auto;
}

h1 {
  font-size: 50px;
  font-weight: bold;
}
</style>

<style scoped>
table {
  border-collapse: collapse;
}
td {
  text-align: center;
  font-size: 18px;
  padding: 10px 0;
}

tr:nth-child(even) {
  background-color: aliceblue;
}

tr:nth-child(odd) {
  background-color: rgb(244, 245, 247);
}

th {
  background-color: rgb(41, 53, 147);
  color: white;
  font-size: 20px;
}

.sort{
  margin: 10px 0;
  margin-bottom: 30px;
}
</style>
