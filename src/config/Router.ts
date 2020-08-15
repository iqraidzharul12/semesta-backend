import RouterAuth from "../modules/auth/RouterAuth";
import RouterHome from "../modules/home/RouterHome";
import RouterUser from "../modules/user/RouterUser";
import RouterTransaction from "../modules/transaction/RouterTransaction";
import RouterStockiesPurchase from "../modules/stockiesPurchase/RouterStockiesPurchase";
import RouterMonthlyBonus from "../modules/monthlyBonus/RouterMonthlyBonus";
import RouterMonthlyLevelBonus from "../modules/monthlyLevelBonus/RouterMonthlyLevelBonus";
import RouterProductExcellence from "../modules/productExcellence/RouterProductExcellence";
import RouterProduct from "../modules/product/RouterProduct";
import RouterStockies from "../modules/stockies/RouterStockies";
import RouterStock from "../modules/stock/RouterStock";
import RouterProvince from "../modules/province/RouterProvince";
import RouterRegency from "../modules/regency/RouterRegency";
import RouterDistrict from "../modules/district/RouterDistrict";
import RouterVillage from "../modules/village/RouterVillage";

export default [
  ...RouterAuth,
  ...RouterHome,
  ...RouterUser,
  ...RouterTransaction,
  ...RouterMonthlyBonus,
  ...RouterMonthlyLevelBonus,
  ...RouterProductExcellence,
  ...RouterProduct,
  ...RouterStockiesPurchase,
  ...RouterStockies,
  ...RouterStock,
  ...RouterProvince,
  ...RouterRegency,
  ...RouterDistrict,
  ...RouterVillage,
];
