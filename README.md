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
<br><br>
![Signup](https://github.com/prempreetbrar/ApliTrack/assets/89614923/e14a5168-e093-40a1-8291-d16f6f4b3017)

## Login
![Login](https://github.com/prempreetbrar/ApliTrack/assets/89614923/0d6a9582-072c-48a0-a845-929e0a39d2e1)

## Forgot Password
Users will be warned if passwords do not match or if a user already exists with the provided username. Note that a welcome email is sent upon registration.
&nbsp;
<br><br>
![ForgotPassword](https://github.com/prempreetbrar/ApliTrack/assets/89614923/079de06e-26af-4f9d-ac85-feeb257d3ba5)

## Profile

### Account Info
Applicants can update personal information or their password by pressing the corresponding Update button on the right.
&nbsp;
<br><br>
![AccountInfo](https://github.com/prempreetbrar/ApliTrack/assets/89614923/6be50c57-0589-46ac-a3d3-1dbd7c1c63a3)

### Career Info
Applicants can then add Experiences, Projects, Certifications, Skills, and Competitions by populating the corresponding empty fields in the Profile page. 
&nbsp;
<br><br>
![AddCareerInfo](https://github.com/prempreetbrar/ApliTrack/assets/89614923/02a82f75-cc8c-4584-94b0-d7791b2b83e9)
&nbsp;

Applicants can then edit the Experiences and Projects entries as these have titles and descriptions. Entries can be edited by clicking the Pencil icon, 
after which a pop-up will appear.
&nbsp;
<br><br>
![EditCareerInfo](https://github.com/prempreetbrar/ApliTrack/assets/89614923/d81c71ea-1a27-472a-94e2-74c85ce4b620)

&nbsp;
Applicants can also delete any entries by clicking the Bin icon for Experiences and Projects, or clicking the X for Certifications, Skills, and Competitions. For Experiences and Projects, a confirmation box will pop up, while Certifications, Skills, and Competitions entries will be deleted right away, as they are simple entries. 
&nbsp;
<br><br>
![DeleteCareerInfo](https://github.com/prempreetbrar/ApliTrack/assets/89614923/4fbe84bd-af33-42c8-8b8c-d396bbe07cef)

## Documents

### Add Document
Upon first loading the Documents page, applicants will encounter none of their Documents stored in the system. The page allows applicants to upload documents, provide a Document Type and Description, and upload the file itself. 
&nbsp;
<br><br>
![AddDocument](https://github.com/prempreetbrar/ApliTrack/assets/89614923/3c38176f-e171-4d85-a676-33994f4ecb97)
&nbsp;

### Edit Document
Upon adding a document, each will appear. Applicants are also able to update each document by updating the necessary fields and then pressing the Update button. 
&nbsp;
<br><br>
![EditDocument](https://github.com/prempreetbrar/ApliTrack/assets/89614923/a0a245b6-ee14-4f7e-8a65-dad512b91327)
&nbsp;

### Delete Document
To delete a document, applicants can press the Bin icon, which will create a confirmation pop-up.
&nbsp;
<br><br>
![DeleteDocument](https://github.com/prempreetbrar/ApliTrack/assets/89614923/a14eeae3-8304-4056-a16d-a303d3e78cf6)
&nbsp;

### Searching and Sorting Documents
Applicants can search for document file names. For example, an applicant may search for all file names containing the string “Resume". Applicants can also enhance the search by specifying the sorting order in which to display results. Upon selecting the sorting method, the Search icon on the right must be pressed to execute the search and show the results.
&nbsp;
<br><br>
![SortAndSearchDocuments](https://github.com/prempreetbrar/ApliTrack/assets/89614923/5170b8ed-be0d-495a-a55c-0352430bb586)
&nbsp;

## Companies and Jobs

Upon first loading the Companies page, applicants will typically encounter previously populated Company entries, as these are shared across all applicants. If the Companies
page is blank, that means no applicants have yet added any companies to the system. The idea is that applicants can "work together" by adding companies and jobs to assist
each other in the job search.

### Adding Company

A new company can be added by filling in the fields, then pressing the Create button to the right. 
&nbsp;
<br><br>
![AddCompany](https://github.com/prempreetbrar/ApliTrack/assets/89614923/56fda35f-43c1-4ddf-910e-45640b067f9b)
&nbsp;

### Updating Company

Note that jobs can only be added to existing companies. If a company does not exist and an applicant wishes to add a job, they must add the company to the system first. Any fields for the Company can then be edited and updated with the Update button. 
&nbsp;
<br><br>
![UpdatingCompany](https://github.com/prempreetbrar/ApliTrack/assets/89614923/41446f19-beb3-439c-9041-e67fc84ea54a)
&nbsp;

### Deleting Company or Job (Admin with Delete Permissions Only)

Note that regular applicants cannot delete companies as these are shared across all users; only admins have the permission to delete companies. These routes are protected on the backend (by checking the permission flag on the user) and on the frontend (by not showing the delete button unless the user is an admin). 
&nbsp;
<br><br>
![DeleteJobAndCompany](https://github.com/prempreetbrar/ApliTrack/assets/89614923/c4a44444-3df3-460e-b2a9-0508bb9706c8)

#### Adding Job
![AddJob](https://github.com/prempreetbrar/ApliTrack/assets/89614923/1266e46b-32a4-4739-bf19-d06f87c3d09d)

##### Adding Qualifications and Responsibilities
With a job added, applicants have the option of adding multiple qualifications and responsibilities to the job, as shown towards the right of the screen. To add these, applicants can simply enter the new qualification and/or responsibility and press the corresponding + icon, as shown below. 
&nbsp;
<br><br>
![AddQualificationsAndResponsibilities](https://github.com/prempreetbrar/ApliTrack/assets/89614923/661e3364-656c-4eb4-b500-b65976c6e6c8)

##### Deleting Qualifications and Responsibilities
![DeletingQualificationsAndResponsibilities](https://github.com/prempreetbrar/ApliTrack/assets/89614923/db2562ef-2156-47e4-bcac-9fb18a6b3edd)

#### Editing Job
![EditJob](https://github.com/prempreetbrar/ApliTrack/assets/89614923/88fca06f-5d7f-4805-9aef-c71eb1681d5f)

#### Tracking Job
Applicants that may wish to track certain jobs have the option to do so by simply ticking the Track This Job box on the screen. Once the job is being tracked, applicants can enter information specific to tracking, such as a target date to apply and any notes, and then press the Update button to save that information. 
&nbsp;
<br><br>
![TrackingJob](https://github.com/prempreetbrar/ApliTrack/assets/89614923/a388326c-45a9-4ba1-92d5-b7e7c7770bf3)

### Searching Companies and Jobs

Applicants are able to search the Companies page by Company Names and/or the application deadlines, as shown below. For example, searching for Amazon will bring up the Amazon company and its corresponding jobs. Alternatively, applicants can enter just the application deadline dates to search by jobs that match the date(s) criteria. This is useful if you are looking for jobs by a certain company and/or want to see all jobs that fall within a certain deadline.
&nbsp;
<br><br>
https://github.com/prempreetbrar/ApliTrack/assets/89614923/9968bd3d-dcfb-44fa-9a80-abc9069264dd

### Tracking Filter

Alternatively, can only display jobs that they are personally tracking in the system. The Tracking filter will apply automatically, while sorting will only be applied once the search Icon is pressed, like it was for regular searching above. Note that if the Tracking filter is selected, all companies will still be displayed (if there is no company search applied), but only tracked jobs will display under each company. This means that if an applicant does not track any jobs from a specific company, it will appear as if the company has no jobs posted for it in the system. The tracking allows the applicant to mark only those jobs that are relevant to them and easily search for their tracked or "marked" jobs.
&nbsp;
<br><br>
![TrackingFilter](https://github.com/prempreetbrar/ApliTrack/assets/89614923/cf141544-2fac-4dc1-a469-00fe0fe277c8)

## Applications

Users can add, edit, or delete their own applications. For existing applications, applicants can add even more details by specifying categories for each application, relevant URLs, specific documents submitted for each application, and the job(s) that the application corresponds to. Categories and Relevant URLs are custom and can thus be entered into their fields as shown below. 

&nbsp;
<br><br>
![Application](https://github.com/prempreetbrar/ApliTrack/assets/89614923/5756cae4-0427-4c35-8902-f136c8575664)
&nbsp;
<br><br>

To add submitted documents and jobs to the application, the documents and jobs must already exist in the database, as the adding is done using dropdown menus that only show existing options! This is done to minimize keyboard input (providing for a better use experience) and preventing errors from users entering in documents and/or jobs that do not exist. For each job, applicants can also add specific URLs relevant to the job itself that may not appear in the Companies page. Once Documents and Corresponding jobs have been added, they will appear and can be hovered over to show the full text. These entries can also be deleted by simply pressing the X icon.

### Search Applications

With applicants needing to handle tens or even hundreds of applications, they can easily search for applications by name, status, and category using the search bar at the top of the page. For example, searching for Status “Submitted” will return applications where the searched text is included in the Status field, as shown below. Searching by Name and/or Category will yield results using those categories. 
&nbsp;
<br><br>
![ApplicationSearch](https://github.com/prempreetbrar/ApliTrack/assets/89614923/8e5c0750-5a37-4998-8d8e-36cd1c658d68)

## Contacts

Upon first loading the Contacts page, applicants will typically encounter previously populated Contact entries, as these are shared across all applicants. Applicants can add or update contacts.
&nbsp;
<br><br>
![Contact](https://github.com/prempreetbrar/ApliTrack/assets/89614923/3b9e3b76-a839-4727-951b-f55c8175178c)

### Delete Contact (Restricted to Admin With Delete Permission Only)
&nbsp;
<br><br>
![DeleteContact](https://github.com/prempreetbrar/ApliTrack/assets/89614923/542262e7-7f84-4c8d-99d7-4081d41274ab)

### Contact Works At

Next, applicants can also specify which companies each contact works at using the Works At field, which contains a dropdown showing existing companies in the database. Applicants are able to choose a company and specify the specific role that the contact holds at that company, as shown below, and then add the entry by pressing the + icon on the right. 
&nbsp;
<br><br>
![WorksAt](https://github.com/prempreetbrar/ApliTrack/assets/89614923/a8c673dd-9ac8-45d1-8e69-edc75afe18e7)

### Contact is Known

With many contacts in the system, applicants can further specify whether they personally know a particular contact by selecting the ‘I know this person!’ checkbox, which will then provide additional fields for the applicant to fill in. This is extremely beneficial because it allows an applicant to sift through the thousands of contacts (hypothetically) in the system and mark which ones they know personally. They can then filter to only show contacts they know using a switch at the top of the page. 
&nbsp;
<br><br>
![Know](https://github.com/prempreetbrar/ApliTrack/assets/89614923/96c6d785-60c9-4b2f-8cb0-7a210fe99210)

### Referrals

Finally, applicants are also able to specify whether the contacts they know have provided any referrals, and if so, then for which existing job in the system. This can be done by filling in the fields and selecting the right Job under Referral(s), as shown below. Once added, a referral appears and can be edited by editing any of the fields and pressing the Update button. Additionally, the referral can be deleted by pressing the Bin icon, but only after confirming the deletion in a pop-up, as shown below.
&nbsp;
<br><br>
![Referrals](https://github.com/prempreetbrar/ApliTrack/assets/89614923/4562212c-18f7-4a75-80bc-d0ebf9597c88)

## Interviews

An interview can be added by filling in the fields under ‘Add New Interview’, then pressing Create. Note that while Stage and Date take any input from the user, the Application field is a dropdown menu that displays the applicant’s existing applications in the system. 

Existing interviews can then be supplemented with additional information, like any Contacts who are stored in the system who are attending the interview, as well as the specific jobs that the interview is related to. These can be selected in their corresponding dropdown menus that display entries that already exist in the application. Once added, attending contacts and mentioned jobs appear. Note that each can be hovered over to display the full text.

Note that if duplicate items are attempted to be added by the applicant, they will see an error pop up informing them of this.
&nbsp;
<br><br>
![Interviews](https://github.com/prempreetbrar/ApliTrack/assets/89614923/edde9b2a-ef29-4199-acb2-e7d955c16bd9)

### Search and Sort Interviews
![SearchAndSortInterviews](https://github.com/prempreetbrar/ApliTrack/assets/89614923/1c39a581-f629-4d8a-af11-9595ee1e824c)

## Offers

An offer can be added by filling in the fields to the right of Create Offer. Note that the Job field is a dropdown that only allows for selection of jobs already in the system. Additionally, applicants are able to upload their job offer files to the system using the rightmost field.
&nbsp;
<br><br>
![Offers](https://github.com/prempreetbrar/ApliTrack/assets/89614923/e8ab2625-7317-424a-8708-1233689355be)

### Searching and Sorting Offers

If applicants have multiple offers to decide between, they are able to easily search and compare offers by using the various search options provided, including searching by lowest and highest compensation, earliest and latest response deadline, and earliest and latest start date.
&nbsp;
<br><br>
![SearchAndSortOffers](https://github.com/prempreetbrar/ApliTrack/assets/89614923/3d5a5e1b-8ac1-43cb-8b9d-4adb9e64108f)

## Users (Admin)

Upon loading the user page (which admins can only access) the admins will be able to see a list of users that currently exist on the system/database. From here they are able to update user’s first and last names, activate and deactivate their accounts, change their permission levels and reset their passwords. They can even create or delete users from the database. Admins also have the option to search for users using their first or last names.
&nbsp;
<br><br>
![Admin](https://github.com/prempreetbrar/ApliTrack/assets/89614923/52b41c98-8e82-421d-b436-ec7b65878a7b)

## Logged Out Views (Contacts and Companies)
Finally, users who are not logged in are able to view the Contacts and Companies pages, as these entries are public and not specific to any particular applicants. However, since the users are not logged in, they are unable to make any additions or updates to the data in the system, as these actions require users to be logged in. Below are the sample views for the Contacts and Companies pages, as seen by a logged-out user or a user with no existing account. 
&nbsp;
<br><br>
![LoggedOutViews](https://github.com/prempreetbrar/ApliTrack/assets/89614923/047c0ab1-ab0a-4765-a0ec-f8f860618143)

## Mobile and Tablet Views
Since our group spends considerable time on mobile or tablet devices, we had an incentive to make our application compatible with both mobile and tablet screen sizes. See below both mobile and tablet views. 

### Profile, Documents, Applications, Offers (Mobile and Tablet Views)
![MobileAndTablet](https://github.com/prempreetbrar/ApliTrack/assets/89614923/002ef44a-57f0-4ebf-be49-5fd27addc7df)

### Interviews, Contacts, Companies (Mobile and Tablet Views)
![MobileAndTablet2](https://github.com/prempreetbrar/ApliTrack/assets/89614923/a1286b5a-6055-4eef-9850-d7ece6e598f3)

### Users (Mobile and Tablet Views)
![MobileAndTablet3](https://github.com/prempreetbrar/ApliTrack/assets/89614923/5933ae7a-894b-45b5-8c5c-5d13c169d619)

# Features (Languages/Technologies Used: TypeScript, React.js, Node.js, Express, SQLite, Sequelize, Pug.js)
- Uses a REST API with an MVC backend architecture that supports filtering, sorting, PROPER authentication with JWT (token must be valid, not expired, the user's password has not changed, and the user is not inactive) and authorization
- Has **INCREDIBLY** strong error handling with a generic "catch all" error handler that reduces code duplication and distinguishes between different types of errors
- Deals with unhandled rejections and exceptions
- Supports creation of new users by storing encrypted passwords in database; allows user to change password and reset it if it is forgotten via Brevo email handling
- A proper data model derived from an Enhanced Entity Relationship Diagram which was then mapped to the Relational Model; the corresponding tables from the relational model were implemented in Sequelize using SQLite as the underlying DBMS.
- Factory functions reduce code duplication in controllers and views
- Email templating created Pug.js, with blocks used to reduce code duplication and HTML data sets used to transfer data. A snackbar is shown whenever there is ANY error, so the user is never left surprised as to what is happening. A success snackbar is shown to give feedback when an operation is successful.
- Custom file uploading using Multer, with file names and paths stored in the database; the actual file is kept on the file system, and a special suffix is added to ensure we can distnguish between two files that otherwise have the same name.
&nbsp;

# Limitations/Design Choices

- The backend has lots of code reuse and little duplication, however, the frontend has considerable duplication. The team was focused on completing the project before the deadline and decided to "jump in" to frontend development without planning beforehand. In the future, we would plan out the frontend design BEFORE we start coding. It may take a few extra hours upfront, but it would considerably speed up development time. 
- TypeScript was used albeit sparingly; some group members were not familiar with TypeScript, so explicit annotations were not used to prevent confusion. **TypeScript was used _only_ for type inference (which still helped us catch tons of errors).**
- The EERD models admins and applicants as being disjoint; however, the current system implementation allows admins to perform all actions allowed by applicants, therefore modeling them as overlapping. This change was made to simplify the backend while maintaining the desired functionality.
- Sequelize was unable to correctly process and implement foreign keys that reference composite primary keys. This proved to be an issue only for weak entities that were previously defined with composite keys and which were then referenced by other relations in the database. To address this, weak entities that were affected by the issue were instead given a new primary key in the form of a unique auto-assigned and incremented integer ID, enabling them to have a single primary key that can be referenced. However, to ensure that the original functionality was preserved, attributes that previously comprised the composite key were assigned unique tags, ensuring that the combination of these attributes is unique for any instance in the relation, thereby mimicking the functionality of a composite primary key. This change was applied to the following entities in the database: `Interview`, `Document`, `Application`, `Job`
- The developer table was deemed redundant because a developer’s and admin's permissions and abilities are normally managed in the GitHub repository, NOT in the application itself. This table was not created in the final application.
- Some rest API routes are created in the backend (and fully functional), but have no corresponding frontend. Specifically, the routes relating to `AdminResponsibility` (which was deemed redundant as `PermissionLevel` could easily capture this info), `DeveloperType`, `Specialization`, and Admin `Abilities` (which is instead determined by the routes to which the admin has access, NOT the database itself).
- Additional columns not present in the EERD or the Relational Model may be seen in the application; some of these are to deal with Sequelize constraints regarding referencing composite primary keys. Others are to aid with functionality from our Use Case diagram that was not originally conceived during the EERD phase. For example, the user has `PasswordLastChangedAt`, `PasswordResetToken`, and `PasswordResetExpires` columns (to help with authentication and password changing, forgetting, and resetting functionality in the application).
- Initially, the group settled on using MySQL, but swapped to SQLite because connection to MySQL and synchronization (not to mention preventing race conditions) proved to be difficult.

&nbsp;

# Running it Locally

**1. Install NVM: https://github.com/nvm-sh/nvm**
&nbsp;
<br><br>
![NVMInstallation](https://github.com/prempreetbrar/ApliTrack/assets/89614923/88014084-5485-457c-9faa-0799c0ac194a)

**2. Install Node and NPM: https://github.com/nvm-sh/nvm**
&nbsp;
<br><br>
![NodeANDNPMInstallation](https://github.com/prempreetbrar/ApliTrack/assets/89614923/ed1a1c11-bb63-42bf-89c0-621b2314902d)

***If you performed the above downloads using VSCode's terminal, restart VSCode so that it can "know" about these installations.

**3. To Confirm Installation Do:**

```
node -v
npm -v
```
![ConfirmingInstallation](https://github.com/prempreetbrar/ApliTrack/assets/89614923/42e52237-8596-4f2e-b60a-472180941cfa)

**4. Clone the GitHub Repo:**
![CloningRepo](https://github.com/prempreetbrar/ApliTrack/assets/89614923/5e2e6448-31c0-46e0-8293-9c5e7e856ea8)

**5. Run the Server:**

```
cd ApliTrack/server
npm install
npm run start:dev
```
![RunServer](https://github.com/prempreetbrar/ApliTrack/assets/89614923/7649a0a6-ff5c-46d0-880c-1e3c4b2717a0)

<br><br>
You can view the database's contents in the server folder by clicking on the database `cpsc471.sqlite`. Ensure you have the
`SQLite Viewer` extension installed in VSCode.
&nbsp;
<br><br>
![ViewDatabase](https://github.com/prempreetbrar/ApliTrack/assets/89614923/8ad764dd-6dbc-4b92-80f1-81f82d262cb6)


**6. Run the Client:**

*IMPORTANT: You must run the client in a new terminal, so that the server and client can run simultaneously.

```
cd ApliTrack/client
npm install
npm run start:dev
```

When prompted with `Would you like to run the app on another port instead? › (Y/n)` type in `y`.
&nbsp;
<br><br>
![Client](https://github.com/prempreetbrar/ApliTrack/assets/89614923/ec831349-65da-4324-939b-1c03145aaab8)

**7. Interact with the Application in Your Browser!**
![Interact](https://github.com/prempreetbrar/ApliTrack/assets/89614923/c0ea74b6-d83f-4223-9252-600fa8b30d7f)
