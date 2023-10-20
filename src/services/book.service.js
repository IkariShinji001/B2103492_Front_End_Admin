import api from './api.service'

class BookService {
  async getBooks(limit, page, sortName, sortDate, search = null) {
    const books = await api.get('/books', { params: { search, limit, page, sortName, sortDate } })
    return books.data
  }

  async getBookById(id) {
    const book = (await api.get(`/books/${id}`)).data
    return book
  }

  async createNewBook(newBookInfo, images) {
    const formData = new FormData()
    for (const key in newBookInfo) {
      formData.append(key, newBookInfo[key])
    }
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i])
    }
    const books = (
      await api.post('/books', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    ).data
    return books
  }

  async getBookCount() {
    const count = (await api.get('/books/count')).data
    return count
  }

  async updateIsInBussiness(id, state) {
    await api.patch(`/books/${id}/is-in-bussiness`, { state })
  }

  async deleteBook(id) {
    return (await api.delete(`/books/${id}`)).data
  }

  async deleteImage(bookId, publicId) {
    await api.delete(`/books/${bookId}/images/${publicId}`)
  }

  async updateBookInfo(bookId, payload) {
    await api.put(`/books/${bookId}`, payload)
  }

  async updateBookImages(bookId, images) {
    const formData = new FormData()
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i])
    }

    const newImages = await api.patch(`/books/${bookId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return newImages.data;
  }


  async getAllInventoryHistory(sortDate){
    const res = await api.get('/books/inventory', {params: {sortDate}});
    return res.data;
  }

  async addInventoryBook(id,quantity){
    const res = await api.put(`/books/${id}/inventory`, {quantity});
    return res.data;
  }

  async getInventoryHistoryById(id){
    const inventoryHistory = await api.get(`/books/${id}/inventory`);
    return inventoryHistory.data;
  }


  async getBookNotInSeries(){
    const books = await api.get('/books/not-in-series');
    return books.data;
  }
}

export default new BookService()
