<template>
  <q-page>
    <head-title text="Nhập kho" font-size="2em"></head-title>
    <section class="wrapper" v-if="book">
      <h1 class="h1">{{ book.name + ' Volume ' + book.volume }}</h1>
      <span class="notice">Lưu ý: Đơn vị tính là cuốn</span>
      <q-input
        class="input"
        label="Số lượng nhập kho"
        outlined
        v-model.number="quantity"
        type="number"
        min="0"
      ></q-input>
      <q-btn class="submit" @click="handleAddInventory">Nhập kho</q-btn>

      <div>
        <h2>Lịch sử nhập kho</h2>
        <div class="container-table row">
          <table style="width: 100%">
            <thead>
              <tr>
                <th class="col-md-2">STT</th>
                <th class="col-md-4">Số lượng nhập</th>
                <th class="col-md-4">Người nhập</th>
                <th class="col-md-2">Ngày nhập</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, i) in inventoryHistory.inventory" :key="i">
                <td class="col-md-2">{{ i }}</td>
                <td class="col-md-4">{{ item.quantity || 0 }} cuốn</td>
                <td class="col-md-4">{{ item.staffID }}</td>
                <td class="col-md-2">{{ extractDateAndTime(item.entryDate) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script>
import { useRoute } from 'vue-router'
import HeadTitle from '../components/HeadTitle.vue'
import bookService from '../services/book.service'
import { onBeforeMount, ref } from 'vue'
import { useToast } from 'vue-toastification'
import extractDateAndTime from '../helpers/extractDateAndTime'
export default {
  name: 'AddInventoryView',
  components: {
    'head-title': HeadTitle
  },
  setup() {
    const toast = useToast()
    const router = useRoute()
    const bookId = router.params.id
    const book = ref()
    const quantity = ref()
    const inventoryHistory = ref([])
    onBeforeMount(async () => {
      book.value = await bookService.getBookById(bookId)
      inventoryHistory.value = await bookService.getInventoryHistoryById(bookId)
      console.log(inventoryHistory.value)
    })

    const handleAddInventory = async () => {
      if (!quantity.value) {
        toast.warning('Không được để trống')
        return
      }
      try {
        const res = await bookService.addInventoryBook(bookId, quantity.value)
        console.log(res)
        inventoryHistory.value.inventory.unshift({staffID: res.staffID, quantity: res.quantity, entryDate: res.entryDate});
        toast.success('Thêm vào kho thành công')
      } catch (error) {
        console.log(error);
        toast.error('Thêm vào kho thất bại do bị lỗi trong quá trình')
      }
    }

    return { bookId, book, quantity, handleAddInventory, inventoryHistory, extractDateAndTime }
  }
}
</script>

<style scoped>
.wrapper {
  width: 90%;
  margin: 0 auto;
  padding-bottom: 150px;
}

.input {
  font-size: 18px;
}

.h1 {
  font-size: 40px;
  font-weight: bold;
  text-align: center;
}

.notice {
  display: block;
  color: red;
  font-size: 16px;
  margin-bottom: 2s0px;
}

.submit {
  display: flex;
  margin: 0 auto;
  padding: 10px 50px;
  margin-top: 50px;
  background-color: #1976d2;
  color: white;
}

table {
  border-collapse: collapse;
  margin-top: 50px;
}

td {
  text-align: center;
  font-size: 16px;
  padding: 10px 0;
}

tr:nth-child(odd) {
  background-color: aliceblue;
}
.container-table {
  width: 100%;
  position: relative;
  max-height: 500px; /* Đặt chiều cao tối đa của bảng */
  overflow: auto;
}

th {
  position: sticky;
  font-size: 20px;
  background-color: rgb(41, 53, 147);
  color: white;
  top: 0; /* Giữ đầu bảng ở vị trí cố định khi cuộn */
}

h2 {
  font-size: 35px;
  text-align: center;
}
</style>
