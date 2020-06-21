 
import RouterAuth from '../modules/auth/RouterAuth';
import RouterHome from '../modules/home/RouterHome';
import RouterUser from '../modules/user/RouterUser';
import RouterTransaction from '../modules/transaction/RouterTransaction';
import RouterMonthlyBonus from '../modules/monthlyBonus/RouterMonthlyBonus';
import RouterProductExcellence from '../modules/productExcellence/RouterProductExcellence';
import RouterProduct from '../modules/product/RouterProduct';

export default [
  ...RouterAuth,
  ...RouterHome,
  ...RouterUser,
  ...RouterTransaction,
  ...RouterMonthlyBonus,
  ...RouterProductExcellence,
  ...RouterProduct,
];
