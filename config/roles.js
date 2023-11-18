const roles = {
    admin: {
        roleName: 'admin',
        priveleges: ['read', 'write', 'delete', 'update']
    },
    user: {
        roleName: 'user',
        priveleges: ['read', 'write']
    },
    none: {
        roleName: 'none',
        priveleges: []
    }
};

module.exports = roles;