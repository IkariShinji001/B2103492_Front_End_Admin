import api from "./api.service";

class OrderService{
  async getAllOrder(status = null){
    try {
      const orders = await api.get('/orders', {params: {status}});
      return orders.data;
    } catch (error) {
      console.log(error);
    }
  }


  async approveOrder(id ,status){
    try {
      const res = await api.patch(`/orders/approve/${id}`, {status});
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

}

export default new OrderService();