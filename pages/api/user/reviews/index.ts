import {handler} from "../../../../actions/_base/handler";
import ListReviewsAction from "../../../../actions/reviews/ListReviewsAction";
import SubmitReviewAction from "../../../../actions/reviews/SubmitReviewAction";

export default handler({
    get: ListReviewsAction,
    post:SubmitReviewAction
});