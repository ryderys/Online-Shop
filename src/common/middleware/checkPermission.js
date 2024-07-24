const permissions = require("../../modules/RBAC/permissions");
const roles = require("../../modules/RBAC/roles")

function checkPermission(resource, action) {
    return (req, res, next) => {
        const userRole = req.user.role; // Assuming the role is stored in req.user
        const resourcePermissions = permissions[resource][action];

        let hasPermission = false;
        let currentRole = userRole;

        while (currentRole) {
            if (resourcePermissions.includes(currentRole)) {
                hasPermission = true;
                break;
            }
            currentRole = roles[currentRole][0]; // Get parent role
        }

        if (hasPermission) {
            next();
        } else {
            res.status(403).json({ message: 'Forbidden' });
        }
    };
}

function checkOwnership(resource, action) {
    return async (req, res, next) => {
        const userRole = req.user.role;
        const resourcePermissions = permissions[resource][action];

        let hasPermission = false;
        let currentRole = userRole;

        while (currentRole) {
            if (resourcePermissions.includes(currentRole)) {
                hasPermission = true;
                break;
            }
            currentRole = roles[currentRole][0]; // Get parent role
        }

        if (hasPermission) {
            if (action.includes('Own')) {
                // Check if the user owns the resource
                const resourceId = req.params.id;
                const resource = await ResourceModel.findById(resourceId);
                if (resource && resource.userId.equals(req.user._id)) {
                    next();
                } else {
                    res.status(403).json({ message: 'Forbidden' });
                }
            } else {
                next();
            }
        } else {
            res.status(403).json({ message: 'Forbidden' });
        }
    };
}


module.exports = {checkPermission,
    checkOwnership
}