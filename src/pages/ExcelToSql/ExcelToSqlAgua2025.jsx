import ExcelToSqlConverter from '../../components/ExcelToSqlConverter';
import { excelToSqlConfigs } from '../../config/excelToSqlConfigs';

const ExcelToSqlAgua2025 = () => {
  return <ExcelToSqlConverter config={excelToSqlConfigs.agua_2025} />;
};

export default ExcelToSqlAgua2025;
