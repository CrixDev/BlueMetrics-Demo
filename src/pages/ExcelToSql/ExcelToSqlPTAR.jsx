import ExcelToSqlConverter from '../../components/ExcelToSqlConverter';
import { excelToSqlConfigs } from '../../config/excelToSqlConfigs';

const ExcelToSqlPTAR = () => {
  return <ExcelToSqlConverter config={excelToSqlConfigs.ptar} />;
};

export default ExcelToSqlPTAR;
