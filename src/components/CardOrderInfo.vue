<template>
  <q-card
    class="my-card-total text-white"
    style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
  >
    <q-card-section>
      <div class="text-h6">{{ title }}</div>
      <div class="total-waiting-value">{{ value }} đơn</div>
    </q-card-section>
  </q-card>
</template>


<script>
export default {
  name: 'CardOrderInfo',
  props:{
    title: String,
    value: Number,
  },

  setup(props){

    return{
      title: props.title,
      value: props.value
    }
  }
}
</script>

<style>
.my-card-total {
  width: 30%;
}

.total-waiting-value {
  font-size: 40px;
  text-align: center;
}

.text-h6 {
  text-align: center;
  color: rgb(255, 255, 255);
}

</style>