import ExcelToSqlConverter from '../../components/ExcelToSqlConverter';
import { excelToSqlConfigs } from '../../config/excelToSqlConfigs';

const ExcelToSqlAgua2024 = () => {
  return <ExcelToSqlConverter config={excelToSqlConfigs.agua_2024} />;
};

export default ExcelToSqlAgua2024;
