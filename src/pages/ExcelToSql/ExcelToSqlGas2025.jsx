import ExcelToSqlConverter from '../../components/ExcelToSqlConverter';
import { excelToSqlConfigs } from '../../config/excelToSqlConfigs';

const ExcelToSqlGas2025 = () => {
  return <ExcelToSqlConverter config={excelToSqlConfigs.gas_2025} />;
};

export default ExcelToSqlGas2025;
