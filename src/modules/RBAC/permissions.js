const permissions = {
    product: {
        create: ['admin'],
        read: ['admin', 'user', 'guest'],
        update: ['admin'],
        delete: ['admin']
    },
    category: {
        create: ['admin'],
        read: ['admin'],
        delete: ['admin']
    },
    review: {
        create: ['admin', 'user'],
        read: ['admin', 'user', 'guest'],
        update: ['admin', 'user'],
        delete: ['admin', 'user']
    },
    order: {
        create: ['admin', 'user'],
        read: ['admin', 'user'],
        update: ['admin'],
        updateOwn: ['user'], // This allows users to update their own orders
        delete: ['admin']
    },
    cart: {
        readOwn: ['user'], // This allows users to read their own cart
        updateOwn: ['user'] // This allows users to update their own cart
    },
    savedItems: {
        readOwn: ['user'], // This allows users to read their own cart
        updateOwn: ['user'] // This allows users to update their own cart
    }
};

module.exports = permissions;