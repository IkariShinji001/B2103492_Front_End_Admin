<template>
  <q-page padding class="wrapper">
    <div class="content-container shadow-12">
      <div class="title"><h1>Welcome back!</h1><h1>Quản trị Thế Giới Tiểu Thuyết</h1></div>
      <div class="row">
        <div class="col img-container gt-md" hidden>
          <img src="../assets//675081_18298235_3340912_0d101093_image.jpg" />
        </div>

        <section class="col">
          <div>
            <h2>Đăng nhập</h2>
            <q-input outlined v-model="staffID" label="Staff ID" class="input staff-id">
              <template v-slot:prepend>
                <q-icon name="person_outline" />
              </template>
            </q-input>
            <q-input outlined v-model="password" label="Password" type="password" class="input">
              <template v-slot:prepend>
                <q-icon name="password" />
              </template>
            </q-input>
            <div class="btn-container">
              <q-btn color="primary" label="Đăng nhập" class="submit" v-on:click="login"/>
            </div>
          </div>
        </section>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import StaffService from '../services/staff.service'
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router'

export default {
  name: 'LoginView',
  setup(){
    const Toast = useToast();
    const router = useRouter();
    const staffID = ref();
    const password = ref();

    const login = async () =>{
      try{
        const res = await StaffService.login(staffID, password);
        localStorage.setItem('role', res.role);
        Toast.success('Đăng nhập thành công');
        router.push('/');
      }catch(error){
        Toast.error('Sai tên đăng nhập hoặc mật khẩu');
        console.log(error);
      }
    }
    return {staffID, password, login}
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;500;600&display=swap');

.wrapper {
  background-color: #002f42;
  width: 100%;
  height: auto;
  margin: 0 auto;
}

.img-container{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-container {
  width: 80%;
  height: auto;
  margin: 0 auto;
  margin-top: 40px;
  background-color: white;
  padding-bottom: 100px;
  border-radius: 10px;
}

img {
  margin: 0 auto;
  width: 50%
}

h1 {
  margin: 0;
  font-weight: 500;
  font-size: 35px;
  text-align: center;
}

h2 {
  font-weight: 500;
  text-align: center;
  margin-bottom: 50px;
  font-size: 3vw;
}
.input {
  width: 80%;
  background-color: white;
  margin: 20px auto;
  font-size: 18px;
}

.staff-id {
  margin-top: 50px;
}

.btn-container {
  width: 100%;
  display: flex;
}

.submit {
  width: 80%;
  margin: 0 auto !important;
  padding: 10px 0;
  font-size: 18px;
}

@media screen and (max-width: 650px) {
  h1{
    font-size: 25px;
  }
  h2{
    font-size: 30px;
  }
}
</style>

