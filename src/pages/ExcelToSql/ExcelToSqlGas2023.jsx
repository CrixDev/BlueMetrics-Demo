import ExcelToSqlConverter from '../../components/ExcelToSqlConverter';
import { excelToSqlConfigs } from '../../config/excelToSqlConfigs';

const ExcelToSqlGas2023 = () => {
  return <ExcelToSqlConverter config={excelToSqlConfigs.gas_2023} />;
};

export default ExcelToSqlGas2023;
