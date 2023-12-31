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
![image](https://github.com/prempreetbrar/ApliTrack/assets/89614923/1bc138e1-3614-4303-9321-4f35952c3bcc)

## Sequence Diagram
![image](https://github.com/prempreetbrar/ApliTrack/assets/89614923/6657150d-aa58-4111-8cff-20585be65d0c)

## Signup
Users will be warned if passwords do not match or if a user already exists with the provided username. Note that a welcome email is sent upon registration.
&nbsp;
![Signup](https://github.com/prempreetbrar/ApliTrack/assets/89614923/e14a5168-e093-40a1-8291-d16f6f4b3017)

## Login
![Login](https://github.com/prempreetbrar/ApliTrack/assets/89614923/0d6a9582-072c-48a0-a845-929e0a39d2e1)

## Profile

### Account Info
Applicants can update personal information or their password by pressing the corresponding Update button on the right.
&nbsp;
![AccountInfo](https://github.com/prempreetbrar/ApliTrack/assets/89614923/6be50c57-0589-46ac-a3d3-1dbd7c1c63a3)

### Career Info
Applicants can then add Experiences, Projects, Certifications, Skills, and Competitions by populating the corresponding empty fields in the Profile page. 
&nbsp;
![AddCareerInfo](https://github.com/prempreetbrar/ApliTrack/assets/89614923/02a82f75-cc8c-4584-94b0-d7791b2b83e9)
&nbsp;

Applicants can then edit the Experiences and Projects entries as these have titles and descriptions. Entries can be edited by clicking the Pencil icon, 
after which a pop-up will appear.
&nbsp;
&nbsp;
![EditCareerInfo](https://github.com/prempreetbrar/ApliTrack/assets/89614923/d81c71ea-1a27-472a-94e2-74c85ce4b620)

&nbsp;
Applicants can also delete any entries by clicking the Bin icon for Experiences and Projects, or clicking the X for Certifications, Skills, and Competitions. For Experiences and Projects, a confirmation box will pop up, while Certifications, Skills, and Competitions entries will be deleted right away, as they are simple entries. 
&nbsp;
![DeleteCareerInfo](https://github.com/prempreetbrar/ApliTrack/assets/89614923/4fbe84bd-af33-42c8-8b8c-d396bbe07cef)



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
