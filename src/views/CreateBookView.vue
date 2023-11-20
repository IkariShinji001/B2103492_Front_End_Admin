<template>
  <q-page>
    <loading-circle :isShow="isLoading"></loading-circle>
    <head-title text="Thêm sách mới" width="fix-content" fontSize="2em"></head-title>
    <h2>Thông tin sách mới</h2>
    <q-form class="form" @submit="onSubmit">
      <div class="row justify-between">
        <q-input
          :rules="[rules]"
          outlined
          class="col-md-5 col-12 input"
          label="Tên sách  (*)"
          v-model="name"
        >
        </q-input>
        <q-input
          :rules="[rules]"
          outlined
          label="Volume (*)"
          class="col-md-2 col-12 input"
          v-model="volume"
        ></q-input>
        <q-select
          clearable
          outlined
          label="Series (Không bắt buộc)"
          class="col-md-4 col-12 input"
          v-model="series"
          :options="seriesOptions"
          option-label="name"
          option-value="_id"
          map-options
          emit-value
        ></q-select>
      </div>
      <div class="row justify-between">
        <q-select
          :rules="[rules]"
          outlined
          v-model="bookCover"
          class="col-md-2 col-12 input"
          label="Bìa sách (*)"
          :options="bookCoverOptions"
        >
        </q-select>
        <q-input
          :rules="[rules]"
          outlined
          class="col-md-3 col-12 input"
          label="Tác giả (*)"
          v-model="author"
        />
        <q-input
          :rules="[rules]"
          outlined
          class="col-md-2 col-12 input"
          label="Số trang sách (*)"
          v-model.number="numberOfPages"
          type="number"
        />
        <q-input
          outlined
          :rules="[rules]"
          class="col-md-4 col-12 input"
          label="Giá tiền(vnd) (*)"
          v-model.number="price"
          type="number"
          min="0"
        />
      </div>

      <div class="row justify-between">
        <q-input
          outlined
          :rules="[rules]"
          class="col-md-4 col-12 input"
          label="Trọng lượng(gram) (*)"
          v-model.number="weight"
          type="number"
          min="0"
        />
        <q-input
          outlined
          :rules="[rules]"
          class="col-md-3 col-12 input"
          label="Giảm giá (%)"
          v-model.number="discount"
          type="number"
          min="0"
          max="100"
        />
        <q-input
          outlined
          :rules="[rules]"
          class="col-md-4 col-12 input"
          label="Dành cho độ tuổi từ"
          v-model.number="age"
          type="number"
          min="0"
        />
      </div>

      <div class="row justify-between">
        <q-select
          outlined
          :rules="[rules]"
          class="col-md-8 col-12 input"
          label="Thể loại (*)"
          v-model="genres"
          :options="genresOption"
          option-value="_id"
          option-label="type"
          emit-value
          multiple
          map-options
        >
        </q-select>
        <q-toggle
          outlined
          :rules="[rules]"
          color="primary"
          size="lg"
          val="lg"
          class="col-md-3 col-12 input limited"
          :label="limited ? 'Bản limited' : 'Không là bản limited'"
          v-model="limited"
        />
      </div>

      <div class="row justify-between">
        <q-input
          :rules="[rules]"
          class="col-12 summarize"
          v-model="summarize"
          filled
          type="textarea"
          label="Thông tin sơ lược"
        >
          <template v-slot:label>
            <p class="label-input">Sơ lược về tiểu thuyết (*)</p>
          </template>
        </q-input>
      </div>

      <div class="row justify-between">
        <q-input
          class="col-12 promotions"
          v-model="promotions"
          filled
          type="textarea"
          label="Thông tin quà tặng, khuyến mãi"
        >
          <template v-slot:label>
            <p class="label-input">Thông tin quà tặng, khuyến mãi</p>
          </template>
        </q-input>
      </div>
      <section>
        <h2>Thêm ảnh cho sản phẩm</h2>
        <span style="color: red">Lưu ý: Ảnh đầu tiên sẽ được lấy làm ảnh bìa cho sách</span>
        <q-file use-chips multiple accept=".jpg, image/*" filled v-model="images" label="Thêm ảnh">
          <template v-slot:prepend>
            <q-icon name="cloud_upload" />
          </template>
        </q-file>
        <image-preview :images="reverseImage"></image-preview>
      </section>
      <div class="row btn-container">
        <q-btn
          color="secondary"
          class="btn-submit col-md-3 col-12"
          label="Thêm sách mới"
          type="submit"
        ></q-btn>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { computed, onBeforeMount, ref } from 'vue'
import HeadTitle from '../components/HeadTitle.vue'
import ImagePreview from '../components/ImagePreview.vue'
import genresService from '../services/genres.service'
import bookService from '../services/book.service'
import normalize from '../helpers/format/normalize'
import seriesService from '../services/series.service'
import LoadingCircle from '../components/LoadingCircle.vue'
import validator from '../helpers/validator'
import { useToast } from 'vue-toastification'

export default {
  name: 'CreateBookView',
  components: {
    'head-title': HeadTitle,
    'loading-circle': LoadingCircle,
    'image-preview': ImagePreview
  },
  setup() {
    const toast = useToast()
    const bookCoverOptions = ['Cứng', 'Mềm']
    const seriesOptions = ref([])
    const genresOption = ref([])
    const name = ref()
    const bookCover = ref()
    const volume = ref()
    const series = ref()
    const numberOfPages = ref()
    const price = ref()
    const weight = ref()
    const discount = ref(0)
    const promotions = ref()
    const limited = ref(false)
    const age = ref()
    const genres = ref([])
    const summarize = ref()
    const images = ref([])
    const author = ref()
    const fieldRequired = [
      'name',
      'volume',
      'bookCover',
      'author',
      'numberOfPages',
      'price',
      'weight',
      'summarize'
    ]

    const isLoading = ref(false)

    onBeforeMount(async () => {
      try {
        seriesOptions.value = await seriesService.getAll()
        genresOption.value = await genresService.getAllGenres()
      } catch (error) {
        console.log(error)
      }
    })

    const rules = (val) => (val !== null && val !== '') || 'Không được để trống'

    const reverseImage = computed(() =>{
      return images.value.reverse();
    })
    const onSubmit = async () => {
      const bookInfo = {
        name: name.value,
        bookCover: bookCover.value,
        volume: volume.value,
        series: series.value,
        numberOfPages: numberOfPages.value,
        price: price.value,
        weight: weight.value,
        discount: discount.value,
        promotions: promotions.value,
        limited: limited.value,
        age: age.value,
        summarize: summarize.value,
        author: author.value,
        genres: genres.value,
        series: series.value
      }
      normalize.trim(bookInfo)

      const checkPayload = validator.checkSelectedFields(bookInfo, fieldRequired)
      const isEmptyImg = validator.isNotQualified(images.value)
      const isEmptyGenres = validator.isNotQualified(genres.value)

      if (!checkPayload || isEmptyGenres || isEmptyImg) {
        toast.warning('Không được để trống các trường (*)')
        return
      }
      try {
        isLoading.value = true
        await bookService.createNewBook(bookInfo, images.value)
        toast.success('Đã thêm sách thành công!')
        isLoading.value = false
      } catch (error) {
        console.log(error)
        if (error.response.status === 400) {
          toast.error(error.response.data.message)
        }
        toast.error("Lỗi trong quá trình xử lí");
        isLoading.value = false;
      }
    }
    return {
      bookCover,
      bookCoverOptions,
      name,
      volume,
      series,
      numberOfPages,
      price,
      weight,
      discount,
      limited,
      age,
      genresOption,
      genres,
      promotions,
      isLoading,
      onSubmit,
      rules,
      images,
      summarize,
      author,
      seriesOptions,
      reverseImage
    }
  }
}
</script>

<style scoped>
h2 {
  text-align: center;
  font-size: 3em;
}

.form {
  width: 80%;
  margin: 0 auto;
}

.input {
  margin: 5px 10px;
  font-size: 18px;
}

.btn-submit {
  margin: 0 auto;
  margin-top: 20px;
  padding: 15px 10px;
}

.label-input {
  font-size: 20px;
}
.promotions {
  font-size: 18px;
}
.btn-container {
  margin-top: 30px;
  padding-bottom: 50px;
}
.summarize {
  margin-bottom: 20px;
}
</style>
