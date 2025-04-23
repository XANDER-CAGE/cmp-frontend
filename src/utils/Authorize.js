/**
 * Authorize user based on permissions and required permissions.
 * @param userPermissions  The permissions of the user.
 * @param requiredPermissions  The permissions required to access the
 * @param validateAll  If true, all required permissions must be present in the user permissions. If false, at least one of the required permissions must be present in the user permissions.
 * @returns {boolean|*} True if the user has the required permissions, false otherwise.
 * @constructor
 */
const Authorize = (userPermissions, requiredPermissions, validateAll = true) => {
  if (validateAll) {
    return requiredPermissions.length === 0 || requiredPermissions.every(permission => userPermissions.includes(permission));
  } else {
    return requiredPermissions.length === 0 || requiredPermissions.some(permission => userPermissions.includes(permission));
  }
};

export default Authorize;