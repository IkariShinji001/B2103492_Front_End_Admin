const normalize = {
  trim(data) {
    console.log(data)
    for (let field in data) {
      if (data[field] && typeof data[field] === 'string') {
        data[field] = data[field].trim()
      }
    }
  }
}

export default normalize;
