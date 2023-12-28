# ApliTrack

ApliTrack is a Job Application Tracking System (JATS) that aims to ease the burden of managing job applications for busy University students who find themselves applying to tens or hundreds of jobs, often due to limited professional experience and a highly competitive job market. With ApliTrack, applicants are able to manage the most relevant information pertaining
to their job applications in one comprehensive solution, keeping track of components like the applications themselves, the jobs and companies they apply to, the documents they submit, the interviews and offers they receive, as well as any of their contacts who may be relevant to the jobs they apply to.

To create ApliTrack, the group followed the database design and implementation process from start to finish. First, an initial proposal and set of broad requirements was created to establish the purpose and general functionality of the web application. Then, an enhanced entity relationship diagram with 13 entities (EERD) was created to convey all components of the application, more clearly illustrating the information that would be stored in the database and the resulting functionality that could be reasonably expected. Once the EERD was complete, it was mapped to a relational model (RM) that more closely resembled the underlying database structure that is used in the back-end of the application.

## Enhanced Entity Relationship Diagram
![image](https://github.com/prempreetbrar/ApliTrack/assets/89614923/104c5236-552f-47f1-ba79-6214abe5a62f)
&nbsp;

## Relational Model Diagram
![image](https://github.com/prempreetbrar/ApliTrack/assets/89614923/86c2a388-fb31-4a9a-98c0-17d44000d2e9)
&nbsp;

## Use Case Diagram
![image](https://github.com/prempreetbrar/ApliTrack/assets/89614923/ccde793f-20f9-4668-bb69-a2efffa2a276)

## Sequence Diagram
![image](https://github.com/prempreetbrar/ApliTrack/assets/89614923/6657150d-aa58-4111-8cff-20585be65d0c)






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
