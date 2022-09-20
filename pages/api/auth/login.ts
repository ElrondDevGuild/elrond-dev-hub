import {handler} from "../../../actions/_base/handler";
import Login from "../../../actions/auth/Login";

export default handler({
    post: Login
});