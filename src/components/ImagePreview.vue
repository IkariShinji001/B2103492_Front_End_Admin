<template>
  <div class="img-preview row">
    <span class="img-container row">
      <img v-for="image in imagesPreview" class="img col-md-5 col-12" :src="image"/>
    </span>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'ImagePreview',
  props:{
    images: Array
  },
  setup(props) {
    const images = ref(props.images);
    const imagesPreview = ref([]);

    const previewImages = (images) => {
      imagesPreview.value = [];
      images.forEach(image => {
        const url = URL.createObjectURL(image);
        imagesPreview.value.push(url);
      });
    }

    watch(() => props.images,  (newImages) => {
      images.value = newImages;
      previewImages(images.value);
    });


    return {imagesPreview}

    
  }
}
</script>

<style scoped>
.img-container{
  width: 100%;
  gap: 30px;
  justify-content: space-around;
}

img{
  width: 100%;
  object-fit: contain;
}


</style>
