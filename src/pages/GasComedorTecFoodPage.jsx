import ExcelToSqlConverter from '../components/ExcelToSqlConverter';
import { excelToSqlConfigs } from '../config/excelToSqlConfigs';

const GasComedorTecFoodPage = () => {
  const config = excelToSqlConfigs.gas_2025_comedor_tec_food;

  return <ExcelToSqlConverter config={config} />;
};

export default GasComedorTecFoodPage;
