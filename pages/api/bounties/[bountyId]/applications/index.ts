import {handler} from "../../../../../actions/_base/handler";
import CreateApplicationAction from "../../../../../actions/bounties/CreateApplicationAction";
import ListBountyApplicationsAction
    from "../../../../../actions/bounties/ListBountyApplicationsAction";

export default handler({
    get: ListBountyApplicationsAction,
    post: CreateApplicationAction,

});