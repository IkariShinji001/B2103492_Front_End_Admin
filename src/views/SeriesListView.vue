<template>
  <q-page>
    <loading-circle :isShow="isLoading"></loading-circle>
    <head-title text="Bộ sách" font-size="2em"></head-title>
    <section class="wrapper">
      <h1>Danh sách các bộ sách</h1>
      <div class="row justify-between">
        <q-input v-model="search" class="col-md-9" outlined label="Tìm tên bộ sách"> </q-input>
        <q-btn class="col-md-2 btn" @click="openCreate = true">Thêm bộ sách mới</q-btn>
      </div>

      <section>
        <div class="row series-container">
          <series-card
            class="card-series"
            v-for="item in series"
            :key="item._id"
            :path="`/series/${item._id}`"
            :series="item"
            :isLoading="isLoading"
            @updateDelete="handleuUpdateDelete"
            @updateIsLoading="handleUpdateIsLoading"
          ></series-card>
        </div>
      </section>

      <q-dialog v-model="openCreate">
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
              label="Thêm ảnh(*)"
            >
              <template v-slot:prepend>
                <q-icon name="cloud_upload" />
              </template>
            </q-file>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn label="Thêm" class="btn-add" @click="handleCreate" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </section>
  </q-page>
</template>

<script>
import { onBeforeMount, ref, watchEffect } from 'vue'
import HeadTitle from '../components/HeadTitle.vue'
import SeriesService from '../services/series.service'
import SeriesCard from '../components/SeriesCard.vue'
import LoadingCircle from '../components/LoadingCircle.vue'
import validator from '../helpers/validator'
import { useToast } from 'vue-toastification'
export default {
  name: 'SeriesListView',
  components: {
    'head-title': HeadTitle,
    'series-card': SeriesCard,
    'loading-circle': LoadingCircle
  },
  setup() {
    const toast = useToast();
    const id = ref()
    const isLoading = ref()
    const openCreate = ref()
    const name = ref()
    const publisher = ref()
    const series = ref([])
    const search = ref()
    const image = ref()

    onBeforeMount(async () => {
      series.value = await SeriesService.getAll()
    })

    watchEffect(async () => {
      series.value = await SeriesService.getAll(search.value)
    })

    const handleUpdateIsLoading = (value) => {
      isLoading.value = value;

    }

    const handleuUpdateDelete = (value) => {
      id.value = value;
      const index = series.value.findIndex((element) => element._id === id);
      series.value.splice(index, 1);
    }

    const handleCreate = async () => {
      const payload = { name: name.value, publisher: publisher.value};
      const checkPayload = validator.checkSelectedFields(payload, ['name', 'publisher']);
      const isEmptyImg = validator.isNotQualified(image.value);
      if(!checkPayload || isEmptyImg){
        toast.warning('Không dược để trống các trường (*)');
        return;
      }

      try {
        isLoading.value = true
        const res = await SeriesService.create(
          payload,
          image.value
        )
        isLoading.value = false;
        toast.success('Thêm bộ sách thành công');
        series.value.push({
          name: res.name,
          publisher: res.publisher,
          image: res.image,
          followerCount: res.followerCount
        })
        openCreate.value = false;
      } catch (error) {
        isLoading.value = false;
        toast.error('Thêm bộ sách thất bại');
        console.log(error)
      }
    }

    return {
      isLoading,
      openCreate,
      name,
      publisher,
      handleCreate,
      search,
      series,
      image,
      handleUpdateIsLoading,
      handleuUpdateDelete
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
  text-align: center;
  font-size: 45px;
  font-weight: 500;
}

.btn {
  background-color: #1976d2;
  font-weight: bold;
  color: white;
}

.input {
  margin-top: 20px;
  font-size: 18px;
}

.btn-add {
  background-color: #1976d2;
  font-weight: bold;
  color: white;
  padding: 10px 50px;
}

.series-container {
  margin: 0 auto;
  width: 100%;
  justify-content: start;
  gap: 10px;
}

.card-series {
  width: 24%;
}

.image {
  width: 100%;
}
</style>
