import {handler} from "../../../../../actions/_base/handler";
import ListApplications from "../../../../../actions/bounties/ListApplications";
import CreateApplicationAction from "../../../../../actions/bounties/CreateApplicationAction";

export default handler({
    get: ListApplications,
    post: CreateApplicationAction,

});