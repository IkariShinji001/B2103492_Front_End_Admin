import api from "./api.service";
class InventoryService{
  async addInventory(data){
    const inventory = (await api.post('/inventory/', data)).data;
    return inventory;
  }
}

export default new InventoryService();