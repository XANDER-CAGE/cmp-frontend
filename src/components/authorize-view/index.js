import React from 'react';
import { useUserInfo } from '../../contexts/UserInfoContext';

const AuthorizedView = ({ requiredPermissions = [], validateAll = true, children }) => {
    const { permissions } = useUserInfo();

    const hasRequiredPermissions = validateAll
      ? requiredPermissions.length === 0 || requiredPermissions.every(permission => permissions.includes(permission))
      : requiredPermissions.length === 0 || requiredPermissions.some(permission => permissions.includes(permission));


    return hasRequiredPermissions ? <>{children}</> : null;
};

export default AuthorizedView;