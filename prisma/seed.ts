import { PrismaClient } from '@prisma/client';
import { PERMISSIONS, appConstant } from '../src/commons/constants/app.constant';
import { hash } from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { parseArgs } from 'util';


const prisma = new PrismaClient();
async function main() {

  for (const module in PERMISSIONS) {
    if (PERMISSIONS.hasOwnProperty(module)) {
      for (const permissionkey in PERMISSIONS[module]) {
        if (PERMISSIONS[module].hasOwnProperty(permissionkey)) {
          const permission = PERMISSIONS[module][permissionkey];
          await prisma.permission.upsert({
            where: { permission_id: permission.permission_id },
            update: {},
            create: {
              permission_id: permission.permission_id,
              name: permission.name,
              description: permission.description
            },
          });
        }
      }
    }
  }

  const permissions = await prisma.permission.findMany({
    select: {
        id: true
    }
  })

  for (const role of appConstant.default.roles) {
    await prisma.role.upsert({
        where: { name: role.name },
        update: {},
        create: {
          name: role.name
        },
      });
  }

  for (const perm of permissions) {
    await prisma.rolesPermission.upsert({
        where: { 
            role_id_permission_id: {
                role_id: 1,
                permission_id: perm.id
            }
        },
        update: {},
        create: {
            role_id: 1,
            permission_id: perm.id
        },
      });
  }

  for (const user of appConstant.default.users) {
    await prisma.user.upsert({
        where: { username: user.username },
        update: {},
        create: {
            username: user.username,
            role_id: user.role_id,
            password: await hash(user.password, 10)
        },
      });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
