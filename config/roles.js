const roles = {

    //Example roles for a permissions system
    sudoUser: {
        roleName: 'sudo',
        priveleges: ['read', 'write', 'delete', 'update'],
        accessLevel: 9001
    },
    admin: {
        roleName: 'admin',
        priveleges: ['read', 'write', 'delete', 'update'],
        accessLevel: 9000
    },
    manager: {
        roleName: 'manager',
        priveleges: ['read', 'write', 'delete', 'update'],
        accessLevel: 8000
    },
    user: {
        roleName: 'user',
        priveleges: ['read', 'write'],
        accessLevel: 0
    },
    none: {
        roleName: 'none',
        priveleges: [],
        accessLevel: 0
    }
};

module.exports = roles;