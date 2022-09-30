import {handler} from "../../../../actions/_base/handler";
import GetBountyAction from "../../../../actions/bounties/GetBountyAction";

export default handler({
    get: GetBountyAction,
});