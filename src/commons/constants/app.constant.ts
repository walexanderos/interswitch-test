export const appConstant = {
  errorDefinition: {
    NOT_FOUND: 'Record not found',
    SERVER_ERROR: 'Internal server error',
    BAD_REQUEST: 'Invalid request sent',
    UNIQUE: 'Record already exist',
  },
  token: {
    ttl: 5, //minutes
    type: {
      verification: 'verification',
      password_reset: 'password-reset'
    }
  },
  duration: ['minute', 'day', 'week', 'month', 'year'],
  suscription: {
    status: {
      active: 'ACTIVE',
      cancelled: 'CANCELLED',
      expired: 'EXPIRED',
    },
  },
  default: {
    roles: [
      {
        name: 'Super Administrator',
      },
    ],
    users: [
      {
        firstname: 'Super',
        lastname: 'Admin',
        email: 'admin@email.com',
        role_id: 1,
        password: 'password',
      },
    ],
    contact_us: {
      email: 'contact@email.com',
      phone: '090123456789',
      address: '123 Main Street',
      reasons: [
        'Complaint',
        'Enquiry',
        'Feedback',
        'Investor Relations',
        'Products & Services',
        'Careers & Job Vacancies',
        'Subsidiaries',
        'Others',
      ],
    },
  },
};

export const PERMISSIONS = {
  ROLE: {
    CREATE: {
      name: 'Create Role',
      permission_id: 'ROLE_CREATE',
      description: '',
    },
    UPDATE: {
      name: 'Update Role',
      permission_id: 'ROLE_UPDATE',
      description: '',
    },
    DELETE: {
      name: 'Delete Role',
      permission_id: 'ROLE_DELETE',
      description: '',
    },
    READ: {
      name: 'View Roles',
      permission_id: 'ROLE_READ',
      description: '',
    },
    ASSIGN: {
      name: 'Assign Permissions to role',
      permission_id: 'ROLE_ASSIGN',
      description: '',
    },
    REMOVE: {
      name: 'Remove Permissions from role',
      permission_id: 'ROLE_REMOVE',
      description: '',
    },
  },
  PERMISSION: {
    UPDATE: {
      name: 'Update Permission',
      permission_id: 'PERMISSION_UPDATE',
      description: '',
    },
    READ: {
      name: 'View Permission',
      permission_id: 'PERMISSION_READ',
      description: '',
    },
  },
  USER: {
    CREATE: {
      name: 'Create User',
      permission_id: 'USER_CREATE',
      description: '',
    },
    UPDATE: {
      name: 'Update User',
      permission_id: 'USER_UPDATE',
      description: '',
    },
    DELETE: {
      name: 'Delete User',
      permission_id: 'USER_DELETE',
      description: '',
    },
    READ: {
      name: 'View Users',
      permission_id: 'USER_READ',
      description: '',
    },
  },
  FAQ: {
    CREATE: {
      name: 'Create faq',
      permission_id: 'FAQ_CREATE',
      description: '',
    },
    UPDATE: {
      name: 'Update faq',
      permission_id: 'FAQ_UPDATE',
      description: '',
    },
    DELETE: {
      name: 'Delete faq',
      permission_id: 'FAQ_DELETE',
      description: '',
    },
    READ: {
      name: 'View faq',
      permission_id: 'FAQ_READ',
      description: '',
    },
  },
  ACCESSPLAN: {
    CREATE: {
      name: 'Create Access Plan',
      permission_id: 'ACCESSPLAN_CREATE',
      description: '',
    },
    UPDATE: {
      name: 'Update Access Plan',
      permission_id: 'ACCESSPLAN_UPDATE',
      description: '',
    },
    DELETE: {
      name: 'Delete Access Plan',
      permission_id: 'ACCESSPLAN_DELETE',
      description: '',
    },
    READ: {
      name: 'View Access Plan',
      permission_id: 'ACCESSPLAN_READ',
      description: '',
    },
  },
};
