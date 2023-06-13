import  Axios  from "axios"

const api = Axios.create({baseURL: "http://172.17.0.2:5000", headers: {'Content-Type': 'multipart/form-data' } })

export default api;