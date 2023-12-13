# ApliTrack

## Downloading node and npm
Using this website https://nodejs.org/en/download/ get the installer and install node along with npm
- Note: once downloaded restart VSCode to apply changes

To confirm installation do:
```
node -v
npm -v
```

## Recommended VSCode extensions
1. ESLint
2. Prettier
3. SQLite (explore and query SQLite databases). https://marketplace.visualstudio.com/items?itemName=alexcvzz.vscode-sqlite
4. SQLite Viewer

## Running the server:

1. `cd` into the `Apli-Track/server` directory
2. Run `npm install`
3. Run `npm install morgan`
4. Run `npm run start:dev` to start the server up. You're now able to send requests to localhost:3000/URL (where `URL`) is the URL of one of the endpoints in our application. For example, localhost:3000/api/auth.

Note: we can view the database's contents in the server folder by clicking on the database "cpsc471.sqlite"
- Ensure you have the SQLite Viewer extension installed on VSCode

## Running the client:

1. `cd` into the `Apli-Track/client` directory
2. Run `npm install`
3. Run `npm install react-scripts`
4. Run `npm install @mui/material @emotion/react @emotion/styled`
5. Run `npm install notistack`
6. Run `npm run start:dev` to start the client.
