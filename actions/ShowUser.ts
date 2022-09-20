import BaseAction from "./_base/BaseAction";
import {ApiRequest} from "./_base/handler";
import ApiResponse from "./_base/ApiResponse";


export default class ShowUser extends BaseAction {
    handle(req: ApiRequest): ApiResponse {
        const {user} = req;

        return new ApiResponse().body({...user});
    }

};