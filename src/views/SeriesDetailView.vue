<template>
  <q-page>
    <loading-cirlce :isShow="isLoading"></loading-cirlce>
    <head-title font-size="2em" text="Chi tiết bộ sách"></head-title>
    <section class="wrapper" v-if="detailSeries">
      <div class="row">
        <div class="col-md-6">
          <h1 class="name">{{ detailSeries.name }}</h1>
          <p class="info">Nhà xuất bản: {{ detailSeries.publisher }}</p>
          <p class="info">Số lượt theo dõi: {{ detailSeries.followerCount }}</p>
          <p class="info">Số sách: {{ detailSeries.books.length }}</p>
        </div>
        <img class="col-md-5" :src="detailSeries.image" />

        <div class="col-md-2">
          <q-btn class="btn-add" @click="openAdd = true">Thêm sách vào bộ sách</q-btn>
          <q-btn class="btn-update" @click="handleOpenUpdate">Sửa thông tin bộ sách</q-btn>
        </div>
      </div>

      <div class="books">
        <h2>Danh sách các sách thuộc bộ sách</h2>
        <table style="width: 85vw; margin: 0 auto">
          <tr class="row">
            <th class="col-md-1 stt">STT</th>
            <th class="col-md-5">Tên sách</th>
            <th class="col-md-2">Volume</th>
            <th class="col-md-2">Kho tồn</th>
            <th class="col-md-2 func">Chức năng</th>
          </tr>

          <tr class="row" v-for="(book, i) in detailSeries.books" :key="i">
            <td class="col-md-1 stt">{{ i }}</td>
            <td class="col-md-5">{{ book.name }}</td>
            <td class="col-md-2">{{ book.volume }}</td>
            <td class="col-md-2">{{ book.quantity }}</td>
            <td class="col-md-2">
              <div class="remove-container">
                <q-icon @click="handleRemoveBook(book._id)" class="remove" name="delete"></q-icon>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <q-dialog v-model="openAdd">
        <q-card style="min-width: 1000px">
          <q-card-section>
            <div class="text-h6">Thêm sách vào bộ</div>
          </q-card-section>

          <q-card-section class="q-pt-none row">
            <q-select
              class="book-add-series"
              label="Sách thêm vào bộ"
              outlined
              v-model="bookAdd"
              :options="booksNotInSeries"
              option-label="name"
              option-value="_id"
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

          <q-card-actions align="center">
            <q-btn label="Thêm" class="btn-add-book" @click="handleAddBookToSeries" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="openUpdate">
        <q-card style="min-width: 1000px">
          <q-card-section>
            <div class="text-h6">Thêm bộ sách mới</div>
          </q-card-section>

          <q-card-section class="q-pt-none row">
            <q-input v-model="name" class="col-12 input" outlined label="Tên bộ sách(*)"></q-input>
            <q-input
              v-model="publisher"
              class="col-12 input"
              outlined
              label="Nhà xuất bản(*)"
            ></q-input>
            <q-file
              class="col-12 input"
              outlined
              use-chips
              multiple
              accept=".jpg, image/*"
              v-model="image"
              label="Thêm ảnh"
            >
              <template v-slot:prepend>
                <q-icon name="cloud_upload" />
              </template>
            </q-file>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn label="CẬP NHẬT" class="btn-update-action" @click="handleUpdateSeries" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </section>
  </q-page>
</template>

<script>
import { onBeforeMount, ref } from 'vue'
import HeadTitle from '../components/HeadTitle.vue'
import { useRoute } from 'vue-router'
import SeriesService from '../services/series.service'
import bookService from '../services/book.service'
import { useToast } from 'vue-toastification'
import LoadingCircle from '../components/LoadingCircle.vue'
export default {
  name: 'SeriesDetailView',
  components: {
    'head-title': HeadTitle,
    'loading-cirlce': LoadingCircle
  },
  setup() {
    const isLoading = ref(false)
    const route = useRoute()
    const toast = useToast()
    const id = route.params.id
    const detailSeries = ref()
    const booksNotInSeries = ref([])
    const booksNotInSeriesOrigin = ref([])
    const openAdd = ref()
    const openUpdate = ref()
    const bookAdd = ref()
    const name = ref()
    const publisher = ref()
    const image = ref()

    onBeforeMount(async () => {
      detailSeries.value = await SeriesService.getAllBookSeries(id)
      booksNotInSeries.value = await bookService.getBookNotInSeries()
      booksNotInSeriesOrigin.value = [...booksNotInSeries.value]
    })

    const filterFn = (val, update, abort) => {
      update(() => {
        const needle = val.toLowerCase()
        booksNotInSeries.value = booksNotInSeriesOrigin.value.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    const handleOpenUpdate = () => {
      openUpdate.value = true
      name.value = detailSeries.value.name
      publisher.value = detailSeries.value.publisher
    }

    const handleUpdateSeries = async () => {
      if (!name.value || !publisher.value) {
        toast.error('Không được để trống các trường có (*)')
      }

      try {
        isLoading.value = true
        if (image.value) {
          openUpdate.value = false; 
          const res = await SeriesService.update(
            id,
            { name: name.value, publisher: publisher.value },
            image.value
          )
          isLoading.value = false
          detailSeries.value.name = res.name
          detailSeries.value.publisher = res.publisher
          detailSeries.value.image = res.image
          toast.success('Cập nhật bộ sách thành công');
          return;
        }
        const res = await SeriesService.update(id, { name: name.value, publisher: publisher.value })
        detailSeries.value.name = res.name
        detailSeries.value.publisher = res.publisher
        isLoading.value = false
        toast.success('Cập nhật bộ sách thành công');
      } catch (error) {
        toast.success('Xảy ra lỗi cập nhật bộ sách');
        isLoading.value = false
        console.log(error)
      }
    }

    const handleRemoveBook = async (bookId) => {
      const confirm = window.confirm('Bạn muốn xóa cuốn sách này ra khỏi bộ sách chứ')
      if (confirm) {
        try {
          const index = detailSeries.value.books.findIndex((book) => book._id === id)
          await SeriesService.pullBookOutSeries(id, bookId)
          detailSeries.value.books.splice(index, 1)
          toast.success('Xóa sách ra khỏi bộ sách thành công')
        } catch (error) {
          toast.error('Xóa sách ra khỏi bộ sách xảy ra lỗi')
        }
      }
    }

    const handleAddBookToSeries = async () => {
      try {
        await SeriesService.addBookToSeries(id, bookAdd.value)
        const book = await bookService.getBookById(bookAdd.value)
        toast.success('Đã thêm sách vào bộ thành công')
        detailSeries.value.books.push({
          name: book.name,
          volume: book.volume,
          quantity: book.quantity
        })
        openAdd.value = false
        booksNotInSeries.value = await bookService.getBookNotInSeries()
      } catch (error) {
        toast.error('Lỗi xảy ra trong quá trình thêm sách vào bộ')
      }
    }
    return {
      isLoading,
      openUpdate,
      name,
      publisher,
      image,
      detailSeries,
      openAdd,
      booksNotInSeries,
      bookAdd,
      filterFn,
      handleAddBookToSeries,
      handleRemoveBook,
      handleUpdateSeries,
      handleOpenUpdate
    }
  }
}
</script>

<style scoped>
.wrapper {
  padding-bottom: 200px;
}
h1 {
  font-size: 60px;
  text-align: center;
}

.info {
  text-align: center;
  font-size: 20px;
}

img {
  width: 20% !important;
}

.btn-update,
.btn-add {
  background-color: #1976d2;
  color: white;
  width: 100%;
  margin: 30px 0;
  margin-left: 60px;
  padding: 10spx 0;
}

h2 {
  margin-top: 60px;
  font-size: 40px;
  text-align: center;
}

th {
  font-size: 20px;
  text-align: left;
  background-color: rgb(41, 53, 147);
  color: white;
}

td {
  padding: 10px 0s;
  font-size: 18px;
}

.stt {
  padding-left: 10px;
}

.book-add-series {
  width: 90%;
  margin: 0 auto;
  font-size: 18px;
}

.label-name {
  font-size: 18px;
}

.label-volume {
  font-size: 17px;
}

.btn-add-book {
  margin: 0 auto;
  margin-top: 20px;
  padding: 10px 100px;
  background-color: #1976d2;
  color: white;
}

.remove-container {
  display: flex;
  justify-content: center;
}

.remove {
  font-size: 28px;
  cursor: pointer;
}

.remove:hover {
  color: red;
}

.func {
  text-align: center;
}

.input {
  margin: 10px 0;
  font-size: 18px;
}
.btn-update-action{
  margin: 0 auto;
  padding: 10px 60px;
  background-color: #1976d2;
  font-weight: bold;
  color: white;
}
</style>
