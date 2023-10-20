<template>
  <q-page>
    <head-title text="Thêm thể loại" font-size="2em"></head-title>
    <section class="wrapper">
      <h1 class="text-center">Thêm thể loại mới</h1>

      <q-form @submit="handleCreate">
        <q-input class="input" v-model="type" outlined label="Thể loại (*)"> </q-input>
        <q-input
          v-model="description"
          outlined
          label="Thông tin mô tả (*)"
          class="description input"
          type="textarea"
        >
        </q-input>

        <q-btn type="submit" class="submit-btn">THÊM THỂ LOẠI MỚI</q-btn>
      </q-form>
    </section>
  </q-page>
</template>

<script>
import HeadTitle from '../components/HeadTitle.vue'
import LoadingCircle from '../components/LoadingCircle.vue'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import genresService from '../services/genres.service'
import validator from '../helpers/validator'
export default {
  name: 'CreateGenresView',
  components: {
    'head-title': HeadTitle,
    'loading-circle': LoadingCircle
  },
  setup() {
    const type = ref()
    const description = ref()
    const toast = useToast()

    const handleCreate = async () => {
      const payload = {
        type: type.value,
        description: description.value
      }

      const checkPayload = validator.checkSelectedFields(payload, ['type', 'description'])
      if (!checkPayload) {
        toast.warning('Không được để trống các trường (*)')
        return
      }

      try {
        await genresService.createGenre(payload)
        toast.success('Thêm thể loại ' + type.value + ' thành công');
        type.value = '';
        description.value ='';
      } catch (error) {
        toast.error('Xảy ra lỗi trong quá trình thêm thể loại')
      }
    }

    return {
      type,
      description,
      handleCreate
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
  font-size: 40px;
  font-weight: bold;
}

.description {
  margin-top: 20px;
}

.submit-btn {
  display: flex !important;
  margin: 0 auto;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #1976d2;
  color: white;
}

.input {
  font-size: 18px;
}
</style>
