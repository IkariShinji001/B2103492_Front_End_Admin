<template>
  <q-card class="container" :style="{width, height, backgroundColor, padding, margin}">
    <p class="title">{{ title }}</p>
    <q-separator />
    <q-card-section>
      <p>{{ text }}  {{ unit  }}</p>
    </q-card-section>
  </q-card>
</template>


<script>

export default{
  name: 'Card',
  props:{
    width: String,  
    height: String,
    backgroundColor: String,
    padding: String,
    margin: String,
    title: String,
    text: String,
    unit: String,
  },
  setup(props){
    console.log("hello")
  }

}
</script>

<style scoped>
.container{
  width: 90%;
}
p{
  color: white;
  font-size: 20px;
  text-align: center;
}
.title{
  margin-left: 20px;
  text-align: left;
}
</style>