import api from "./api.service";

class SeriesService{
  async create(seriesInfo, image){
    const formData = new FormData()
    for (const key in seriesInfo) {
      formData.append(key, seriesInfo[key])
    }

    if(image){
      formData.append('image', image[0]);
    }

    const newSeries = await api.post('/series', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return newSeries.data;
  }

  async update(id , seriesInfo, image = null){
    const formData = new FormData()
    for (const key in seriesInfo) {
      formData.append(key, seriesInfo[key])
    }

    if(image){
      formData.append('image', image[0]);
    }

    const updatedSeries = await api.put(`/series/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

    return updatedSeries.data;

  }

  async getAll(search){
    const series = await api.get('/series', {params: {search}});
    return series.data;
  }

  async getAllBookSeries(id){
    const res = await api.get(`/series/${id}`);
    return res.data;
  }

  async deleleSeries(id){
    return (await api.delete(`/series/${id}`)).data;
  }

  async addBookToSeries(id, bookId){
    return (await api.patch(`/series/${id}/books`, {bookId, action: 'add'})).data;
  }

  async pullBookOutSeries(id, bookId){
    return (await api.patch(`/series/${id}/books`, {bookId, action: 'pull'})).data;
  }

}

export default new SeriesService();