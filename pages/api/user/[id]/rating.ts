import {handler} from "../../../../actions/_base/handler";
import GetUserRatingAction from "../../../../actions/reviews/GetUserRatingAction";

export default handler({
    get: GetUserRatingAction,
});