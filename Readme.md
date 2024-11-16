# NodeJs Skeleton Code

This is a User Manager for nodejs server side application based on express server. User manager signup user,login user, forgot password, reset password, .

## Directory Structure of the project

```
.
├── Readme.md
└── config
    ├── default.js
    ├── developement.js
    ├── logger.js
    └── santry.js
├── package-lock.json
├── package.json
├── server.js
└── src
    ├── controllers
        ├── file
            ├── index.js
            ├── getFileController.js
            └── uploadFileController.js
        ├── users
            ├── index.js
            ├── createUserController.js
            ├── deleteUserByIdController.js
            ├── getUserByIdController.js
            ├── forgotPasswordController.js
            └── resetPasswordController.js
        |
        └── index.js
    ├── models
        ├── file.js
        ├── user.js
        └── index.js
    ├── policies
        ├── user
            ├── forgotPassword.policy.js
            └── user.policy.js
        ├── file
            └── uploadFile.policy.js
    ├── middleware
        └── authentication.js
    ├── services
        ├── file
            ├── index.js
            ├── getFileService.js
            └── uploadFileService.js
        ├── users
            ├── index.js
            ├── createUserService.js
            ├── deleteUserByIdService.js
            ├── getUserByIdService.js
            ├── forgotPasswordService.js
            └── resetPasswordService.js
        └── index.js
    ├── test
    └── utilities
        ├── commons.js
        ├── constants.js
        ├── generateResponse.js
        ├── notification.js
        ├── validateRequest.js
        ├── validations.js
        └── exceptions
            ├── BadRequestException.js
            ├── ExceptionHandler.js
            ├── generateException.js
            ├── ResourceNotFoundException.js
            ├── ServerException.js
            ├── UnauthorizedException
            └── index.js
```

### server.js

This file is the entry point of our application all the express middleware are set here and all the routes are also loaded from this file. The server is started from this file.

Check application health point using direct Base URL.

{base_url}/user-manager/health

### package.json

All the information regarding the application such as name of application, the description, version, scripts required for development, testing, and deployment of the application is available in `package.json` file. All the dependency management is done in this file.

### config

This directory contains all the application configuration, this includes connections to database, all the configuration json consisting of environment based application properties.

### coverage

This directory will contain coverage reports of unit test cases, it is auto generated directory by library [nyc](https://www.npmjs.com/package/nyc) for coverage reports. For tutorial on how to generate coverage reports check [here](https://istanbul.js.org/docs/tutorials/) nyc is cli interface for istanbul library for test coverages.

### public

This directory will contain all the static assets such as images, icons, files etc.

### src

This directory contains all the important source code of our application it has sub-directories viz. controllers, policies, services, listeners.

### controllers

This directory will have all the code for controllers and is not supposed to contain any business logic or request validations.

### policies

This can also be referred as validator(or interceptors), this directory will contain all policy(validation) files having logic to validate the API request to the server and either respond back or hand over the control to controller.

### middleware

This directory will contain the files with all the authentication logic.

### services

This directory will contain the files with all the business logic.

### listeners

This dirctory will contain the files with kafka request for creating topics and data.

### utilities

This directory will contain all the utilities required for this application viz. logger, centralized api calling function, data manipulation functions etc.

## Scripts

### Test

This directory will contain all the tests required for this application viz

```
npm run test
```

### Test case with coverage reports

```
npm run test-with-coverage
```

### Before Start application set development

In order to execute this user manager make sure your postgres instance is up and running

### Build application for development / production

```
npm run build
```

### Start application for development

```
npm run start:dev
```

### Start application for production

```
npm run start:prod
```

### If application development with PM2. start application using PM2 in production and dev environment.

```
npm run pm2-start
```

### Start application for production before set ENV

```
(Note: This all values are sample values. may be changes all values as your base environment)

PORT=3000
DB_HOST=localhost
DB_NAME=polls
DB_USER_NAME=postgres
DB_USER_PASSWORD=root
DB_DIALECT=dialect

SENTRY_DSN=https://7716d292e9f8443ab55a6a2f2c6f2ff1@o529792.ingest.sentry.io/5648679

SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=
SMTP_PASSWORD=
LOGLEVEL=info
DIALECT=postgres

CREATE_CAMPAIGN_TOPIC=
KAFKA_PARTITION=1
KAFKA_REPLICATION_FACTOR=1
KAFKA_TOPIC_NAME=
KAFKA_ENDPOINT=localhost:2181
TOKEN_SECRET=09f26e402586e2faa8da4c98a35f1b20d6b033c60
TOKEN_EXPIRES_TIME=86400
```

### Check application health

after application started successfully you have to check application health using link.

{BASE_URL}/user-manager/health

#### application required kafka and zookeeper.

Download kafka and zookeeper please follow link

This structure mostly covers different layers of a nodejs backend application, all suggestions,edits to document and PRs(with proper commit messages only) are welcome !!
