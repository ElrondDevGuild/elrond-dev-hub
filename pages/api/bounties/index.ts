import {handler} from "../../../actions/_base/handler";
import PaginateBountiesAction from "../../../actions/bounties/PaginateBountiesAction";

export default handler({
    get: PaginateBountiesAction
});