import {handler} from "../../actions/_base/handler";
import ShowUser from "../../actions/user/ShowUser";
import UpdateUserAction from "../../actions/user/UpdateUserAction";


export default handler({
    get: ShowUser,
    put: UpdateUserAction,
});