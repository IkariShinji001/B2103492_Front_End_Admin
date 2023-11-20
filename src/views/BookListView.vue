<template>
  <q-page>
    <loading :isShow="isLoading"></loading>
    <head-title text="Danh sách tiểu thuyết" fontSize="2em"></head-title>
    <section class="wrapper">
      <div class="row search">
        <q-input
          filled
          class="input search col-md-7 col-12"
          label="Tìm kiếm sách theo tên hoặc volume"
          v-model="search"
        >
          <template v-slot:prepend>
            <q-icon name="search"></q-icon>
          </template>
        </q-input>
        <q-select
          outlined
          class="col-md-2 col-12"
          v-model="sortName"
          :options="sortNameOrderOptions"
          option-label="name"
          emit-value
          map-options
          label="Sắp xếp theo"
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="sort_by_alpha"></q-icon>
          </template>
        </q-select>
        <q-select
          outlined
          class="col-md-2 col-12"
          v-model="sortDate"
          :options="sortDateOrderOptions"
          option-label="name"
          label="Thời gian"
          clearable
          emit-value
          map-options
        >
        </q-select>
      </div>

      <section class="table">
        <table style="width: 100%">
          <tr class="row">
            <th class="col-12 col-md-1">STT</th>
            <th class="col-12 col-md-3">Tên sách</th>
            <th class="col-12 col-md-2">Ảnh bìa</th>
            <th class="col-12 col-md-1">Volume</th>
            <th class="col-12 col-md-1">Tồn Kho</th>
            <th class="col-12 col-md-2">Giá</th>
            <th class="col-12 col-md-2">Chức năng</th>
          </tr>
          <tr style="text-align: center" class="row" v-for="(book, index) in books" :key="index">
            <td class="col-12 col-md-1">{{ index }}</td>
            <td class="col-12 col-md-3">{{ book.name }}</td>
            <td class="col-12 col-md-2 img-container"><img :src="book.images[0]" /></td>
            <td class="col-12 col-md-1">{{ book.volume }}</td>
            <td class="col-12 col-md-1">{{ book.quantity }} cuốn</td>
            <td class="col-12 col-md-2 price">
              <div class="price-origin">{{ new Intl.NumberFormat().format(book.price) }}đ</div>

              <div v-if="book.discount !== 0" class="price-discount">
                {{ new Intl.NumberFormat().format(book.discountPrice) }}đ ({{ -book.discount }}%)
              </div>
            </td>
            <td class="col-12 col-md-2 function">
              <div class="func-container">
                <router-link :to="'/books/' + book._id">
                  <q-icon title="Xem chi tiết" name="visibility" class="func-btn"></q-icon>
                </router-link>
                <q-icon
                  v-if="role === 'admin'"
                  title="Xóa"
                  name="delete"
                  class="func-btn"
                  @click="handleDeleteBook(book._id)"
                ></q-icon>
              </div>
              <q-toggle
                v-if="role === 'admin'"
                @click="handleChangeIsInBussiness(book._id, book.isInBussiness)"
                v-model="book.isInBussiness"
                :label="book.isInBussiness ? 'Đang kinh doanh' : 'Dừng kinh doanh'"
              ></q-toggle>
            </td>
          </tr>
        </table>
      </section>
    </section>
    <pagination
      v-if="maxPage"
      @updatePage="handleUpdatePage"
      :currentPage="currentPage"
      :maxPage="maxPage"
    ></pagination>
  </q-page>
</template>

<script>
import HeadTitle from '../components/HeadTitle.vue'
import bookService from '../services/book.service'
import { onBeforeMount, ref, watchEffect } from 'vue'
import { useToast } from 'vue-toastification'
import LoadingCircle from '../components/LoadingCircle.vue'
import Pagination from '../components/Pagination.vue'
export default {
  name: 'BookListView',
  components: {
    'head-title': HeadTitle,
    loading: LoadingCircle,
    pagination: Pagination
  },
  setup() {
    const sortNameOrderOptions = [
      { name: 'Từ A -> Z', value: 1 },
      { name: 'Từ Z -> A', value: -1 }
    ]
    const sortDateOrderOptions = [
      { name: 'Mới nhất', value: -1 },
      { name: 'Cũ nhất', value: 1 }
    ]
    const toast = useToast()
    const sortName = ref()
    const sortDate = ref()
    const books = ref([])
    const limit = 10
    const currentPage = ref(1)
    const isLoading = ref(false)
    const search = ref()
    const maxPage = ref()
    const role = ref()

    onBeforeMount(async () => {
      role.value = localStorage.getItem('role')
      try {
        isLoading.value = true
        books.value = await bookService.getBooks(
          limit,
          currentPage.value,
          sortName.value,
          sortDate.value
        )
        const bookCount = await bookService.getBookCount()
        maxPage.value = Math.ceil(bookCount / limit)
      } catch (error) {
        console.log(error)
      } finally {
        isLoading.value = false
      }
    })

    watchEffect(async () => {
      books.value = await bookService.getBooks(
        limit,
        currentPage.value,
        sortName.value,
        sortDate.value,
        search.value
      )
    })

    const handleUpdatePage = (value) => {
      currentPage.value = value
    }

    const handleChangeIsInBussiness = async (bookId, state) => {
      try {
        await bookService.updateIsInBussiness(bookId, state)
      } catch (error) {
        console.log(error)
      }
    }

    const handleDeleteBook = async (bookId) => {
      const confirm = window.confirm('Bạn muốn xóa sách này đúng không?')

      if (confirm) {
        const index = books.value.findIndex((book) => book._id === bookId)
        try {
          isLoading.value = true
          const result = await bookService.deleteBook(bookId)
          console.log(result)
          books.value.splice(index, 1)
          isLoading.value = false
          toast.success(result.message)
        } catch (error) {
          isLoading.value = false
          console.log(error)
        }
      }
    }

    return {
      sortNameOrderOptions,
      sortName,
      sortDate,
      sortDateOrderOptions,
      books,
      isLoading,
      search,
      currentPage,
      maxPage,
      role,
      handleChangeIsInBussiness,
      handleDeleteBook,
      handleUpdatePage
    }
  }
}
</script>

<style scoped>
.wrapper {
  margin: 0 auto;
  width: 90%;
  justify-content: center;
}

.search {
  gap: 10px;
}

.table {
  margin-top: 40px;
}

.img-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

th {
  background-color: rgb(41, 53, 147);
  font-size: 20px;
  color: white;
}

td {
  font-weight: bold;
  font-size: 16px;
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

tr:nth-child(odd) {
  background-color: aliceblue;
}

tr:nth-child(even) {
  background-color: rgb(244, 245, 247);
}

img {
  width: 50%;
}
.function {
  display: flex;
  flex-direction: column;
}

.func-container {
  width: 60%;
  display: flex;
  justify-content: space-around;
}

.func-btn {
  color: black;
  font-size: 28px;
  cursor: pointer;
}

.func-btn:hover {
  color: brown;
}

.price {
  flex-direction: column;
}

.price-discount {
  font-size: 20px;
  color: brown;
}

.search {
  font-size: 18px;
}
</style>
