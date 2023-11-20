<template>
  <div class="container">
    <span :style="{width, height, fontSize}">{{ text }}</span>
  </div>
</template>


<script>
import { ref } from 'vue';

export default{
  name: 'HeadTitle',
  props: {
    text: String,
    width: String,
    height: String,
    fontSize: String
  },
  setup(props){
    const width = ref(props.width);
    const text = ref(props.text)
    const height = ref(props.height);
    const fontSize = ref(props.fontSize);

    return {
      width,
      text,
      height,
      fontSize
    }
  }

}
</script>

<style scoped>
.container{
  background-color: aliceblue;
  width: fit-content;
  margin: 30px;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.1);
}
</style>