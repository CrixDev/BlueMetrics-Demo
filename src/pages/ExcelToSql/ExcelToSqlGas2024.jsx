import ExcelToSqlConverter from '../../components/ExcelToSqlConverter';
import { excelToSqlConfigs } from '../../config/excelToSqlConfigs';

const ExcelToSqlGas2024 = () => {
  return <ExcelToSqlConverter config={excelToSqlConfigs.gas_2024} />;
};

export default ExcelToSqlGas2024;
