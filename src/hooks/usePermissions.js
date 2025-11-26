import { useAuth } from '../contexts/AuthContextNew';
import { hasPermission, getRolePermissions } from '../config/permissions';

export const usePermissions = () => {
  const { user } = useAuth();
  
  const role = user?.role || 'user';
  
  const can = (permission) => {
    return hasPermission(role, permission);
  };
  
  const permissions = getRolePermissions(role);
  
  return {
    can,
    permissions,
    role,
    // Permisos específicos para fácil acceso
    canViewWater: can('water'),
    canViewGas: can('gas'),
    canViewPTAR: can('ptar'),
    canAddData: can('addData'),
    canViewCorreos: can('correos'),
    canUseExcelToSql: can('excelToSql'),
  };
};
