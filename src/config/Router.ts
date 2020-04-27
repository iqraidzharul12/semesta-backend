 
import RouterAuth from '../modules/auth/RouterAuth';
import RouterHome from '../modules/home/RouterHome';
import RouterUser from '../modules/user/RouterUser';
import RouterTransaction from '../modules/transaction/RouterTransaction';

export default [
  ...RouterAuth,
  ...RouterHome,
  ...RouterUser,
  ...RouterTransaction,
];
