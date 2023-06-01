import  Axios  from "axios"

const api = Axios.create({baseURL: "http://127.0.0.1:5000/", headers: {'Content-Type': 'multipart/form-data' } })

export default api;