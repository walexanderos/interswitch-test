export const appConstant = {
  errorDefinition: {
    NOT_FOUND: 'Record not found',
    SERVER_ERROR: 'Internal server error',
    BAD_REQUEST: 'Invalid request sent',
    UNIQUE: 'Record already exist',
  },
  token: {
    ttl: 5, //minutes
  },
  default: {
    roles: [
      {
        name: 'Super Administrator',
      },
      {
        name: 'Normal User',
      },
    ],
    users: [
      {
        username: 'admin',
        role_id: 1,
        password: 'password',
      },
    ]
  },
};

export const PERMISSIONS = {
  USER: {
    CREATE: {
      name: 'Create User',
      permission_id: 'USER_CREATE',
      description: '',
    },
    READ: {
      name: 'View User',
      permission_id: 'USER_READ',
      description: '',
    },
  }
};
