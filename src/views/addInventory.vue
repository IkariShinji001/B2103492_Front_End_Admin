<template>
  <q-page>
    <div class="wrapper">
      <head-title text="Nhập kho" font-size="2em"></head-title>
      <h3 class="text-center">Phiếu nhập hàng</h3>
      <div style="width: 90%; margin: 0 auto" class="row justify-between">
        <div class="col-md-2 header">Ảnh</div>
        <div class="col-md-3 header">Tên</div>
        <div class="col-md-2 header">Volume</div>
        <div class="col-md-1 header">Số lượng</div>
        <div class="col-md-1 header">Đơn giá</div>
        <div class="col-md-2 header">Tổng giá</div>
      </div>
      <ul style="width: 90%; margin: 0 auto" v-if="items">
        <li class="row justify-between" v-for="(item, i) in items" :key="i">
          <div class="col-md-2 v-c">
            <img :src="item.bookAdd.images[0]" />
          </div>
          <div class="col-md-3 v-c">
            <div class="value">{{ item.bookAdd.name }}</div>
          </div>
          <div class="col-md-2 v-c">
            <div class="value">{{ item.bookAdd.volume }}</div>
          </div>
          <div class="col-md-1 v-c">
            <div class="value">{{ item.bookQuantity }} cuốn</div>
          </div>
          <div class="col-md-1 v-c">
            <div class="value">{{ formatPrice(item.priceTag) }} vnđ</div>
          </div>
          <div class="col-md-2 v-c">
            <div class="value">{{ formatPrice(item.priceTag * item.bookQuantity) }} vnđ</div>
          </div>
        </li>
      </ul>
      <q-btn class="add-book" @click="openDialog = true">+</q-btn>
      <div class="total-price">Tổng giá: {{ formatPrice(totalPrice) }} vnđ</div>
      <q-btn class="add-inventory" v-if="items.length !== 0" color="primary" @click="addInventory"
        >Nhập kho</q-btn
      >
    </div>
  </q-page>

  <q-dialog v-model="openDialog">
    <q-card style="min-width: 1000px">
      <q-card-section>
        <q-select
          class="input"
          label="Nhập kho"
          outlined
          v-model="bookAdd"
          :options="books"
          option-label="name"
          use-input
          fill-input
          input-debounce="0"
          hide-selected
          @filter="filterFn"
          map-options
          emit-value
          color="teal"
          clearable
          options-selected-class="text-deep-orange"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section avatar>
                <q-icon name="book" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="label-name">{{ scope.opt.name }}</q-item-label>
                <q-item-label class="label-volume" caption
                  >Volume {{ scope.opt.volume }}</q-item-label
                >
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>

      <q-card-section>
        <q-input
          class="input"
          outlined
          type="number"
          label="Số lượng (cuốn)"
          v-model.number="bookQuantity"
        ></q-input>
      </q-card-section>

      <q-card-section>
        <q-input
          class="input"
          outlined
          type="number"
          label="Đơn giá (đơn vị vnđ)"
          v-model.number="priceTag"
        ></q-input>
      </q-card-section>

      <q-card-section>
        <q-btn class="add-btn" color="primary" @click="add">Thêm</q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import InventoryService from '../services/inventory.service'
import HeadTitle from '../components/HeadTitle.vue'
import { onBeforeMount, ref, computed } from 'vue'
import bookService from '../services/book.service'
import { useToast } from 'vue-toastification'
export default {
  components: {
    'head-title': HeadTitle
  },
  setup() {
    const toast = useToast()
    const items = ref([])
    const openDialog = ref(false)
    const books = ref([])
    const booksOrigin = ref(null)
    const bookAdd = ref(null)
    const bookQuantity = ref(0)
    const priceTag = ref()

    const filterFn = (val, update, abort) => {
      update(() => {
        const needle = val.toLowerCase()
        books.value = booksOrigin.value.filter((v) => v.name.toLowerCase().indexOf(needle) > -1)
      })
    }

    const formatPrice = (price) => {
      return new Intl.NumberFormat().format(price)
    }

    const filterData = computed(() => {
      const data = items.value.map((v) => {
        return {
          _id: v.bookAdd._id,
          quantity: v.bookQuantity,
          price: v.priceTag
        }
      })

      return data
    })

    const totalPrice = computed(() => {
      let total = 0
      items.value.forEach((item) => {
        total += item.priceTag * item.bookQuantity
      })
      return total
    })

    const add = () => {
      if (!bookAdd.value || !bookQuantity.value || !priceTag.value) {
        toast.error('Vui lòng nhập đầy đủ thông tin')
        return
      }
      items.value.push({
        bookAdd: bookAdd.value,
        bookQuantity: bookQuantity.value,
        priceTag: priceTag.value
      })
      bookAdd.value = null
      bookQuantity.value = null
      priceTag.value = null
    }

    onBeforeMount(async () => {
      books.value = await bookService.getBooks()
      booksOrigin.value = [...books.value]
    })

    const addInventory = async () => {
      try {
        const res = await InventoryService.addInventory(filterData.value);
        toast.success("Thêm vào kho thành công");
        items.value = [];
      } catch (error) {
        toast.error("Xảy ra lỗi trong quá trình nhập kho");
        console.log(error);
      }
    }
    return {
      add,
      filterFn,
      books,
      items,
      openDialog,
      bookAdd,
      bookQuantity,
      priceTag,
      totalPrice,
      filterData,
      formatPrice,
      addInventory
    }
  }
}
</script>

<style scoped>
.add-btn {
  display: flex;
  margin: 0 auto;
  padding: 10px 50px;
}

.label-name {
  font-size: 18px;
}

.label-volume {
  font-size: 17px;
}

.input {
  font-size: 20px;
}

ul {
  padding: 0;
  margin: 0;
}

.header {
  padding: 10px 0;
  font-size: 20px;
  font-weight: bold;
}

ul li:nth-child(odd) {
  background-color: #cccccc6a;
}

.value {
  font-size: 18px;
}

.v-c {
  display: flex;
  align-self: center;
}

.add-book {
  padding: 0px 20px;
  display: flex;
  font-size: 16px;
  margin: 0 auto;
  margin-top: 20px;
}

.total-price {
  width: 90%;
  margin: 0 auto;
  text-align: right;
  margin-left: 10px;
  font-size: 20px;
}

.add-inventory {
  padding: 15px 40px;
  display: flex;
  margin: 0 auto;
}
</style>
