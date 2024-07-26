const permissions = require("../../modules/RBAC/permissions");
const roles = require("../../modules/RBAC/roles")
const httpError = require("http-errors")



function checkPermission(resource, action) {
    return (req, res, next) => {
        try {
            const userRole = req.user.role; // Assuming the role is stored in req.user
            if(!userRole){
                throw new httpError.BadRequest("no role found")
            }
            const resourcePermissions = permissions[resource]?.[action];
            if(!resourcePermissions){
                throw new httpError.BadGateway("Forbidden: No permissions found for this resource and action")
            }
            let hasPermission = false;
            let currentRole = userRole;

            while (currentRole) {
                if (resourcePermissions.includes(currentRole)) {
                    hasPermission = true;
                    break;
                }
                currentRole = roles[currentRole]?.[0]; // Get parent role
            }

            if (hasPermission) {
                next();
            } else {
                res.status(403).json({ message: 'Forbidden' });
            }
        } catch (error) {
            next(error)   
        }
    };
}

function checkOwnership(Model, resource, action) {
    return async (req, res, next) => {
       try {
            const userRole = req.user.role;
            const resourcePermissions = permissions[resource]?.[action]
            if(!resourcePermissions){
                throw new httpError.BadGateway("Forbidden: No permissions found for this resource and action")
            }

            let hasPermission = false;
            let currentRole = userRole;

            while (currentRole) {
                if (resourcePermissions.includes(currentRole)) {
                    hasPermission = true;
                    break;
                }
                currentRole = roles[currentRole]?.[0]; // Get parent role
            }

            if (hasPermission) {
                next();
            } else {
                if (action.includes('Own')) {
                    // Check if the user owns the resource
                    const resourceId = req.params.id;
                    const resource = await Model.findById(resourceId);
                    if (resource && resource.userId.equals(req.user._id)) {
                        next();
                    } else {
                        return res.status(403).json({ message: 'Forbidden' });
                    }
                
            } else {
                return res.status(403).json({ message: 'Forbidden' });
            }
        }
       } catch (error) {
            next(error)
       }
    };
}


module.exports = {checkPermission,
    checkOwnership
}