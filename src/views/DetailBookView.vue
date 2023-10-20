<template>
  <q-page>
    <loading-circle :isShow="isLoading"></loading-circle>
    <head-title text="Thêm sách mới" width="fix-content" fontSize="2em"></head-title>
    <h2>Thông tin chi tiết <div class="book-name">{{ name }} <br/> Volume {{ volume }}</div></h2>
    <q-form class="form">
      <div class="row justify-between">
        <q-input
          :rules="[rules]"
          outlined
          class="col-md-5 col-12 input"
          label="Tên sách (*)"
          v-model="name"
        >
        </q-input>
        <q-input
          :rules="[rules]"
          outlined
          label="Volume"
          class="col-md-2 col-12 input"
          v-model="volume"
        ></q-input>
        <q-select
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
          label="Bìa sách"
          :options="bookCoverOptions"
        >
        </q-select>
        <q-input
          :rules="[rules]"
          outlined
          class="col-md-3 col-12 input"
          label="Tác giả"
          v-model="author"
        />
        <q-input
          :rules="[rules]"
          outlined
          class="col-md-2 col-12 input"
          label="Số trang sách"
          v-model.number="numberOfPages"
          type="number"
        />
        <q-input
          outlined
          :rules="[rules]"
          class="col-md-4 col-12 input"
          label="Giá tiền(vnd)"
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
          label="Trọng lượng(gram)"
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
          label="Thể loại"
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
          class="col-12 summarize"
          v-model="summarize"
          filled
          type="textarea"
          label="Thông tin sơ lược"
        >
          <template v-slot:label>
            <p class="label-input">Sơ lược về tiểu thuyết</p>
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
      <div class="row btn-container">
        <q-btn
          color="secondary"
          class="btn-submit col-md-3 col-12"
          label="Cập nhật thông tin sách"
          @click="handleUpdate"
        ></q-btn>
      </div>
      <section>
        <h2>Ảnh sản phẩm</h2>
        <section class="row wrap justify-around img-db-container">
          <span class="col-md-3 col-12 image-container" v-for="(img,i) in imagesInDB" :key="i">
            <img :src="img" class="image-db"/>
            <q-icon class="delete-img" name="cancel" @click="handleDeleteImage(img)"></q-icon>
          </span>
        </section>

        <q-file use-chips multiple accept=".jpg, image/*" filled v-model="images" label="Thêm ảnh">
          <template v-slot:prepend>
            <q-icon name="cloud_upload" />
          </template>
        </q-file>
        <section>
          <im />
        </section>
        <image-preview :images="images"></image-preview>
      </section>

      <div class="row btn-container">
        <q-btn
          color="secondary"
          class="btn-submit col-md-3 col-12"
          label="Thêm ảnh mới"
          @click="handleUpdateImages"
        ></q-btn>
      </div>
    </q-form>
  </q-page>
</template>


<script>
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import bookService from '../services/book.service'
import genresService from '../services/genres.service';
import seriesService from '../services/series.service';
import HeadTitle from '../components/HeadTitle.vue'
import ImagePreview from '../components/ImagePreview.vue'
import LoadingCircle from '../components/LoadingCircle.vue'
import {getImageIdFromSecureUrl} from '../helpers/getImageIdFromSecureUrl'
import {useToast} from 'vue-toastification'
export default{
  name: "DetailBookView",
  components: {
    'head-title': HeadTitle,
    'loading-circle': LoadingCircle,
    'image-preview': ImagePreview
  },
  setup(){
    const toast = useToast();
    const route = useRoute();
    const book = ref();
    const bookCoverOptions = ['Cứng', 'Mềm']
    const seriesOptions = ref([]);
    const genresOption = ref([])
    const name = ref()
    const bookCover = ref()
    const volume = ref()
    const series = ref()
    const numberOfPages = ref()
    const price = ref()
    const weight = ref()
    const discount = ref()
    const promotions = ref()
    const limited = ref(false)
    const age = ref()
    const genres = ref([])
    const summarize = ref();
    const imagesInDB = ref([]);
    const images = ref([]);
    const author = ref();

    const isLoading = ref(false)
    onBeforeMount(async () =>{
      const {id} = route.params;
      book.value = await bookService.getBookById(id);
      genresOption.value = await genresService.getAllGenres()
      seriesOptions.value = await seriesService.getAll();
      name.value = book.value.name;
      volume.value = book.value.volume;
      bookCover.value = book.value.bookCover;
      author.value = book.value.author;
      series.value = book.value.series;
      numberOfPages.value = book.value.numberOfPages;
      price.value = book.value.price;
      weight.value = book.value.weight;
      discount.value = book.value.discount;
      promotions.value = book.value.promotions;
      limited.value = book.value.limited;
      age.value = book.value.age;
      genres.value = book.value.genres;
      summarize.value = book.value.summarize
      imagesInDB.value = book.value.images
    })


    const handleDeleteImage = async (url) =>{
      if(imagesInDB.value.length === 1){
        toast.warning('Không được xóa ảnh cuối cùng dùng làm ảnh bìa');
        return;
      }
      const index = imagesInDB.value.findIndex(img => img === url);
      const publicId = getImageIdFromSecureUrl(url);
      try {
        isLoading.value = true;
        await bookService.deleteImage(route.params.id, publicId);
        imagesInDB.value.splice(index, 1);
        isLoading.value = false;
        toast.success('Xóa ảnh thành công');
      } catch (error) {
        isLoading.value = false;
        toast.error('Xảy ra lỗi trong quá trình xóa ảnh');
      }
    }

    const handleUpdate = async () =>{
      const {id} = route.params;
      const payload = {
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
        genres: genres.value
      }

      try {
        isLoading.value = true;
        await bookService.updateBookInfo(id, payload);
        toast.success('Cập nhật thông tin thành công');
      } catch (error) {
        toast.error('Lỗi trong quá trình cập nhật');
      }finally{
        isLoading.value = false;
      }
      
    }

    const handleUpdateImages = async () =>{
      const {id} = route.params;

      try {
        isLoading.value = true;
        const newImages = await bookService.updateBookImages(id, images.value);
        imagesInDB.value = [...imagesInDB.value, ...newImages];
        images.value = [];
        toast.success('Thêm ảnh thành công');
        isLoading.value = false;
      } catch (error) {
        toast.error('Thêm ảnh thất bại')
        console.log(error);
      }finally{
        isLoading.value = false;
      }
    }

    const rules = (val) => (val !== null && val !== '') || 'Không được để trống'

    return{
      route,book,
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
      rules,
      imagesInDB,
      images,
      summarize,
      author,
      seriesOptions,
      handleDeleteImage,
      handleUpdate,
      handleUpdateImages
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
.summarize{
  margin-bottom: 20px;
  font-size: 18px;
}

.book-name{
  font-weight: bolder;
}
.image-db{
  width: 100%;
}
.image-container{
  border: 2px solid #cccc;
  height: fit-content;
  position: relative;
}
.image-container:hover .image-db{
  filter: grayscale(80%);
}

.delete-img{
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  color: red !important;
  font-size: 40px;
  transform: translateX(-50%);
  cursor: pointer;
}

.image-container:hover .delete-img{
  display: block;
}

.img-db-container{
  padding: 30px 0;
}

</style>
