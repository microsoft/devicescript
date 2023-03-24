# Website developement

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation

-   install node.js 18

```
nvm install 18
nvm use 18
```

-   install packages

```
$ npm install
```

### Local Development

```
$ npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

The documentation files (markdown or mdx) should be placed under the `docs` folder.

### Deployment

Deployment is done through actions.

```
$ npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.
