
# Interswitch Assessment
This included the theory and practical solution to the assessment question from section 1 to 5.

Solutions include: 

**Task CRUD Operation with Heirachial feature**
**Unique code generation service with dynamic pattern**
**Identity Module with JWT and Role Based Access Control (for test, create user endpoint is RBAC-procted)**
**FHIR Patient resource implementation**

Section 2a and 4 can be found in `$root_dir/interswitch-theory-answer.pdf`

Database used: MySQL

## Installation
1. Clone the repository
2. Run `yarn install`

3. Configure `.env` file. Copy required value from `.env.sample` file
4. Run `yarn migrate:dev` to run migrations
5. Run `yarn migrate:seed` to create default records
6. Run `yarn start` to start the application

The above command will create a default admin user as:
**username: admin**
**password: password**

A default super admin role and user role will be created as well
Query `auth/roles` endpoint to view list of roles created and their respective permissions

## Swagger Documentation
On your browser, visit `{baseurl}/api/doc` for api documentation

# Interswitch Assessment
This included the theory and practical solution to the assessment question from section to 5.

Section 2a and 4 can be found in `$root_dir/interswitch-theory-answer.pdf`

## Installation
1. Clone the repository
2. Run `yarn install`

3. Configure `.env` file. Copy required value from `.env.sample` file
4. Run `yarn migrate:dev` to run migrations
5. Run `yarn migrate:seed` to create default records
6. Run `yarn start` to start the application

The above command will create a default admin user as:
**username: admin**
**password: password**

A default super admin role and user role will be created as well
Query `auth/roles` endpoint to view list of roles created and their respective permissions

## Swagger Documentation
On your browser, visit `{baseurl}/api/doc` for api documentation
