import { handler } from '../../../actions/_base/handler';
import CreateResourceImageAction from '../../../actions/CreateResourceImageAction';

export default handler({
  post: CreateResourceImageAction,
});
