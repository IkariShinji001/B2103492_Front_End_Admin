import api from "./api.service";

class StaffService{
  async login(staffID, password){
    return ((await api.post('/staffs/login', {staffID: staffID.value, password: password.value})).data);
  }

  async getAll(search){
    return (await api.get('/staffs', {params: {search}})).data;
  }

  async register(payload){
    return (await api.post('/staffs', payload)).data;
  }

}

export default new StaffService();