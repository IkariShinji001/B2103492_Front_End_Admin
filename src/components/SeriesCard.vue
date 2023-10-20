<template>
  <div :class="class" id="container">
    <div class="image">
      <router-link :to="path" class="container">
        <img :src="image" />
      </router-link>
    </div>

    <div class="info-container">
      <div class="name-container">
        <router-link :to="path" class="container">
          <p class="name">{{ name }}</p>
        </router-link>
      </div>

      <p class="name">{{ 'Nhà xuất bản: ' + publisher }}</p>
      <p class="name">{{ 'Số lượt theo dõi:  ' + follow }}</p>
      <div class="delete-container">
        <q-icon class="delete" @click="handleDelete" name="delete"></q-icon>
      </div>
    </div>
  </div>
</template>

<script>
import SeriesService from '../services/series.service'
import { useToast } from 'vue-toastification';
import { ref } from 'vue';
export default {
  name: 'SeriesCard',
  props: {
    isLoading: Boolean,
    path: String,
    class: String,
    series: Object
  },
  setup(props, {emit}) {
    const toast = useToast();
    const isLoading = ref(props.isLoading);
    const id = props.series._id;
    const handleDelete = async () =>{
      const confirm = window.confirm('Bạn muốn xóa bộ sách này?')

      if(confirm){
        isLoading.value = true;
        updateIsLoading();
        try {
          await SeriesService.deleleSeries(id);
          isLoading.value = false;
          updateIsLoading();
          updateDelete();
          toast.success('Xoá bộ sách thành công');
        } catch (error) {
          isLoading.value = false;
          updateIsLoading();
          console.log(error);
          toast.error('Lỗi trong quá trình xóa');
        }
      }
    }

    const updateIsLoading = () =>{
      emit('updateIsLoading', isLoading.value);
    }

    const updateDelete = () =>{
      emit('updateDelete', id)
    }

    return {
      class: props.class,
      path: props.path,
      image: props.series.image,
      name: props.series.name,
      publisher: props.series.publisher,
      follow: props.series.followerCount,
      handleDelete
    }
  }
}
</script>

<style scoped>
#container {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px solid #eeeeeecc;
}

.container {
  margin-top: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.info-container {
  width: 80%;
  margin: 0 auto;
}

.name {
  margin-top: 20px;
  font-size: 18px;
  text-align: center;
}

.image {
  display: flex;
  height: 250px;
}

.name-container{
  height: 70px;
}

.delete-container{
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
}

.delete:hover{
  cursor: pointer;
  color: darkred;
}
</style>
