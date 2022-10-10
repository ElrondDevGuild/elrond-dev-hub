import {handler} from "../../../actions/_base/handler";
import ShowUser from "../../../actions/user/ShowUser";

export default handler({
    get: ShowUser,
});