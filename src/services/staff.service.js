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

  async update(id ,payload){
    return (await api.put(`/staffs/${id}`, payload)).data;
  }

  async delete(id){
    return (await api.delete(`/staffs/${id}`)).data;
  }
   
}

export default new StaffService();