import api from "./api.service";
class GenresService{
  async getAllGenres(search, nameOrder){
    const genres = (await api.get('/genres/', {params: {search, order: nameOrder}})).data;
    return genres;
  }

  async deleteGenres(id){
    const result = await api.delete(`/genres/${id}`);
    console.log(result.data);
    return result.data;
  }

  async updateGenre(id, payload){
    await api.put(`/genres/${id}`, payload);
  }

  async createGenre(payload){
    const result = await api.post('/genres', payload);
    return result.data;  
  }
}

export default new GenresService();