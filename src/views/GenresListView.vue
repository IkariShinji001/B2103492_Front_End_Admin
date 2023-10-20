<template>
  <q-page>
    <loading-circle :isShow="isLoading"></loading-circle>
    <head-title text="Danh sách thể loại" font-size="2em"></head-title>
    <section class="wrapper">
      <div class="search-container row justify-around">
        <q-input
          class="search col-md-8 col-12"
          v-model="search"
          outlined
          label="Tìm kiếm theo tên thể loại"
        >
          <template v-slot:prepend> <q-icon name="search"></q-icon> </template
        ></q-input>
        <q-select
          v-model="sortName"
          :options="sortNameOrderOptions"
          class="col-md-3 col-12"
          outlined
          clearable
          emit-value
          map-options
          option-label="name"
          label="Tìm kiếm theo"
        >
          <template v-slot:prepend>
            <q-icon name="sort_by_alpha"></q-icon>
          </template>
        </q-select>
      </div>

      <div>
        <table>
          <tr class="row">
            <th class="col-md-1">STT</th>
            <th class="col-md-3">Thể loại</th>
            <th class="col-md-6">Thông tin chi tiết</th>
            <th class="function col-md-2">Chức năng</th>
          </tr>

          <tr class="row" v-for="(genre, i) in genres" :key="i">
            <td class="col-md-1 stt">{{ i }}</td>
            <td class="col-md-3 type">{{ genre.type }}</td>
            <td class="col-md-6">{{ genre.description }}</td>
            <td class="function col-md-2">
              <q-icon
                title="Xem thông tin chi tiết"
                class="detail"
                name="visibility"
                @click="handleOpenDialog(genre._id)"
              ></q-icon>
              <q-icon
                title="Xóa"
                class="delete"
                name="delete"
                @click="handleDelete(genre._id)"
              ></q-icon>
            </td>
          </tr>
        </table>
      </div>

      <q-dialog v-model="isOpenDialog">
        <q-card style="width: 40%">
          <q-card-section>
            <div class="text-h6">Thông tin chi tiết</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input v-model="type" label="Thể loại"> </q-input>
            <q-input v-model="description" type="textarea" label="Mô tả chi tiết"> </q-input>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn label="Cập nhật" @click="handleUpadte" color="primary"></q-btn>
            <q-btn flat label="Trở về" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </section>
  </q-page>
</template>

<script>
import HeadTitle from '../components/HeadTitle.vue'
import LoadingCircle from '../components/LoadingCircle.vue'
import genresService from '../services/genres.service'
import { useToast } from 'vue-toastification'
import { onBeforeMount, ref, watchEffect } from 'vue'

export default {
  name: 'GeresListView.vue',
  components: {
    'head-title': HeadTitle,
    'loading-circle': LoadingCircle
  },
  setup() {
    const isOpenDialog = ref(false)
    const isLoading = ref(false)
    const type = ref()
    const description = ref()
    const toast = useToast()
    const genresId = ref()
    const sortNameOrderOptions = [
      { name: 'Từ A -> Z', value: 1 },
      { name: 'Từ Z -> A', value: -1 }
    ]
    const genres = ref([])

    onBeforeMount(async () => {
      genres.value = await genresService.getAllGenres()
    })
    const sortName = ref()
    const search = ref()

    watchEffect(async () => {
      genres.value = await genresService.getAllGenres(search.value, sortName.value)
    })

    const handleDelete = async (id) => {
      const confirm = window.confirm('Bạn muốn xóa thể loại này đúng không?')
      if (confirm) {
        const index = genres.value.findIndex((genre) => genre._id === id)
        try {
          isLoading.value = true
          await genresService.deleteGenres(id)
          toast.success('Xóa thành công')
          genres.value.splice(index, 1)
          isLoading.value = false
        } catch (error) {
          console.log(error)
          toast.error('Xảy ra lỗi trong quá trình xóa')
        }
      }
    }

    const handleOpenDialog = (id) => {
      isOpenDialog.value = true
      const genre = genres.value.filter((genre) => genre._id === id)[0]
      type.value = genre.type
      description.value = genre.description
      genresId.value = genre._id
    }

    const handleUpadte = async () => {
      try {
        const index = genres.value.findIndex((genre) => genre._id === genresId.value)
        await genresService.updateGenre(genresId.value, {
          type: type.value,
          description: description.value
        })
        toast.success('Cập nhật thành công')
        genres.value[index].type = type.value
        genres.value[index].description = description.value
      } catch (error) {
        console.logI(error)
        toast.success('Xảy ra lỗi trong qua trình cập nhật')
      }
    }

    return {
      sortNameOrderOptions,
      type,
      description,
      sortName,
      search,
      genres,
      isLoading,
      isOpenDialog,
      handleDelete,
      handleOpenDialog,
      handleUpadte
    }
  }
}
</script>

<style scoped>
.wrapper {
  width: 90%;
  margin: 0 auto;
}

.search {
  width: 70%;
  font-size: 20px;
}

table {
  width: 100%;
  margin-top: 50px;
}
th {
  background-color: rgb(41, 53, 147);
  font-size: 20px;
  color: white;
}

td {
  padding: 10px 0;
  font-size: 16px;
  text-align: start;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

tr:nth-child(odd) {
  background-color: aliceblue;
}

tr:nth-child(even) {
  background-color: rgb(244, 245, 247);
}

.stt,
.type {
  text-align: center;
}

.function {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
}

.delete,
.detail {
  font-size: 25px;
}

.delete:hover,
.detail:hover {
  color: red;
  cursor: pointer;
}
</style>
