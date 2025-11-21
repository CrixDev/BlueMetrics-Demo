import ExcelToSqlConverter from '../../components/ExcelToSqlConverter';
import { excelToSqlConfigs } from '../../config/excelToSqlConfigs';

const ExcelToSqlAgua2023 = () => {
  return <ExcelToSqlConverter config={excelToSqlConfigs.agua_2023} />;
};

export default ExcelToSqlAgua2023;
