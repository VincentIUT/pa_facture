import  Axios  from "axios"

const api = Axios.create({baseURL: "http://10.33.5.131:5000/", headers: {'Accept': 'application/json', 'Content-Type': 'application/json' } })

export default api;