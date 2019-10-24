## Skeleton for Node.js applications written in TypeScript

This project can be used as a template for a web service.
It contains:
  - backend generator used to speed up development process
  - an example blog project containing users, profile images and blog posts
  - an interactive graphql console for exploring the API

Technology stack includes: javascript-node-express-graphql-typeorm-type-graphql

### Generate backend before running
```bash
npm run generate
```

Backend is mostly generated from specification file `src/data/model.er`.

ER (entities' relations) file is a way to define project's relations and fields for relations.
You can open (and edit) the file for further info.

The project currently implements a backend for simple blogging engine containing users, blog posts and files.
It allows users to register and manage their profile info, profile image and post blog posts.
Email login, facebook login and google login are also implemented.

`config.ts` contains the info about all env variables required for setting up project for social login and database connection

For every relation, the following files are generated in the `data` directory:
    - `model` which contains all fields, relations and update method
    
    - `auth` which defines permissions for every one of CRUD operations per entity
    
    - `enum` which contains all enums mentioned in the ER file
    
    - `field-resolver` for custom graphql resolvers
    
    - `resolver` for automatically generated CRUD operations
    
    - `inputs/CreateInput` for input used in CREATE operations
    
    - `inputs/NestedInput` for input used in nested UPDATE operations (used to update relations)
    
    - `inputs/EditInput` for input used in regular UPDATE operations

Most of these files can be edited by adding code within the existing // <keep-*> tags.

### Development
```bash
npm start
```

### Running tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Proxy to internet
```bash
npm run proxy
```

### Production run
```bash
node src
```

### Creating an empty migration
```bash
npm run db:migration:create
```

### Autogenerate migration which syncs the database with current schema
```bash
npm run db:migration:generate
```

### Apply all pending migrations
```bash
npm run db:migration:up
```

### Trying out the backend
Run `npm start` and open your graphql console at `http://localhost:5001/playground` so you can try out the backend there.
To be able to use authentication via cookies, set "request.credentials" to "include" in playground console settings.

When application is run for the first time, administrator user `admin@coreline.hr` is created.
You can login by going to `http://localhost:5001/playground` and executing this mutation:
```
mutation {
  emailLogin(email: "admin@coreline.hr", password: "password") {
    token
  }
}
```
