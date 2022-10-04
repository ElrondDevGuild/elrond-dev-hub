import {handler} from "../../../actions/_base/handler";
import PaginateBountiesAction from "../../../actions/bounties/PaginateBountiesAction";
import CreateBountyAction from "../../../actions/bounties/CreateBountyAction";

export default handler({
    get: PaginateBountiesAction,
    post: CreateBountyAction
});