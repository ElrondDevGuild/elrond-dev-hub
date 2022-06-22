import {handler} from "../../../actions/_base/handler";
import CreateResourceAction from "../../../actions/CreateResourceAction";
import PaginateResourcesAction from "../../../actions/PaginateResourcesAction";

export default handler({
    post: CreateResourceAction,
    get: PaginateResourcesAction
});