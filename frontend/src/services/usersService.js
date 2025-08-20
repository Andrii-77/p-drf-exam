import {apiService} from "./apiService";
import {urls} from "../constants/urls";

const userService = {
    getAll(){
        return apiService.get(urls.users)
    },
    create(data){
        return apiService.post(urls.users, data)
    }
}

export {
    userService
}