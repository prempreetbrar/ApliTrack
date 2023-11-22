// SQLite does not have an explicit DATE datatype; we are storing dates as text

function createUserTable(database) {
  database.run(`CREATE TABLE IF NOT EXISTS USER(
    Username TEXT PRIMARY KEY NOT NULL,
    Password TEXT NOT NULL,
    Fname TEXT,
    Lname TEXT,
    IsActive BOOLEAN NOT NULL DEFAULT 1 CHECK (IsActive IN (0, 1))
  )`);
}

function dropUserTable(database) {
  database.run(`DROP TABLE USER`);
}

function createApplicantTable(database) {
  database.run(`CREATE TABLE IF NOT EXISTS APPLICANT(
    Username TEXT PRIMARY KEY NOT NULL,
    Education TEXT,
    FOREIGN KEY(Username) REFERENCES USER(Username) ON DELETE CASCADE ON UPDATE CASCADE
  )`);
}

function createApplicantExperienceTable(database) {
  database.run(`CREATE TABLE IF NOT EXISTS APPLICANT_EXPERIENCE(
    ApplicantUsername TEXT NOT NULL,
    Experience TEXT NOT NULL,
    ExperienceDesc TEXT,
    PRIMARY KEY(ApplicantUsername, Experience),
    FOREIGN KEY(ApplicantUsername) REFERENCES APPLICANT(Username) ON DELETE CASCADE ON UPDATE CASCADE
  )`);
}

function createApplicantProjectTable(database) {
  database.run(`CREATE TABLE IF NOT EXISTS APPLICANT_PROJECT(
    ApplicantUsername TEXT NOT NULL,
    Project TEXT NOT NULL,
    ProjectDesc TEXT,
    PRIMARY KEY(ApplicantUsername, Project),
    FOREIGN KEY(ApplicantUsername) REFERENCES APPLICANT(Username) ON DELETE CASCADE ON UPDATE CASCADE
  )`);
}

function createApplicantCertificationTable(database) {
  database.run(`CREATE TABLE IF NOT EXISTS APPLICANT_CERTIFICATION(
    ApplicantUsername TEXT NOT NULL,
    Certification TEXT NOT NULL,
    PRIMARY KEY(ApplicantUsername, Certification),
    FOREIGN KEY(ApplicantUsername) REFERENCES APPLICANT(Username) ON DELETE CASCADE ON UPDATE CASCADE
  )`);
}

function createApplicantSkillTable(database) {
  database.run(`CREATE TABLE IF NOT EXISTS APPLICANT_SKILL(
    ApplicantUsername TEXT NOT NULL,
    Skill TEXT NOT NULL,
    PRIMARY KEY(ApplicantUsername, Skill),
    FOREIGN KEY(ApplicantUsername) REFERENCES APPLICANT(Username) ON DELETE CASCADE ON UPDATE CASCADE
  )`);
}

function createApplicantCompetitionTable(database) {
  database.run(`CREATE TABLE IF NOT EXISTS APPLICANT_COMPETITION(
    ApplicantUsername TEXT NOT NULL,
    Competition TEXT NOT NULL,
    PRIMARY KEY(ApplicantUsername, Competition),
    FOREIGN KEY(ApplicantUsername) REFERENCES APPLICANT(Username) ON DELETE CASCADE ON UPDATE CASCADE
  )`);
}

function createApplicationTable(database) {
  database.run(`
  CREATE TABLE IF NOT EXISTS APPLICATION(
    ApplicantUsername TEXT NOT NULL,
    AName TEXT NOT NULL,
    Notes TEXT,
    DateSubmitted TEXT,
    Status TEXT,
    PRIMARY KEY(ApplicantUsername, AName),
    FOREIGN KEY(ApplicantUsername) REFERENCES APPLICANT(Username) ON DELETE CASCADE ON UPDATE CASCADE
  )`);
}

function createInterviewTable(database) {
  /*
  no autoincrement on InterviewID because SQLite only allows
  autoincrementing on primary keys. We will get around this by incrementing
  ourselves when inserting.
  */
  database.run(`
  CREATE TABLE IF NOT EXISTS INTERVIEW(
    InterviewID INTEGER,
    ApplicantUsername TEXT NOT NULL,
    Stage TEXT,
    DateTime TEXT NOT NULL,
    ApplicationName TEXT NOT NULL,
    PRIMARY KEY(InterviewID, ApplicantUsername),
    FOREIGN KEY(ApplicantUsername) REFERENCES APPLICANT(Username) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(ApplicationName) REFERENCES APPLICATION(AName) ON DELETE CASCADE ON UPDATE CASCADE
  )`);
}

function createDocumentTable(database) {
  database.run(`
  CREATE TABLE IF NOT EXISTS DOCUMENT(
    ApplicantUsername TEXT NOT NULL,
    DocFileName TEXT NOT NULL,
    DocType TEXT,
    Description TEXT,
    PRIMARY KEY(ApplicantUsername, DocFileName),
    FOREIGN KEY(ApplicantUsername) REFERENCES APPLICANT(Username) ON DELETE CASCADE ON UPDATE CASCADE
  )`);
}

function createApplicationRelevantURLTable(database) {
  database.run(`
  CREATE TABLE IF NOT EXISTS APPL_RELEVANT_URL(
    ApplicantUsername TEXT NOT NULL,
    AName TEXT NOT NULL,
    RelevantURL TEXT NOT NULL,
    PRIMARY KEY(ApplicantUsername, AName, RelevantURL),
    FOREIGN KEY(ApplicantUsername) REFERENCES APPLICANT(Username) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(AName) REFERENCES APPLICATION(AName) ON DELETE CASCADE ON UPDATE CASCADE
  )`);
}

function createApplicationCategoryTable(database) {
  database.run(`
  CREATE TABLE IF NOT EXISTS APPL_CATEGORY(
    ApplicantUsername TEXT NOT NULL,
    AName TEXT NOT NULL,
    Category TEXT NOT NULL,
    PRIMARY KEY(ApplicantUsername, AName, Category),
    FOREIGN KEY(ApplicantUsername) REFERENCES APPLICANT(Username) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(AName) REFERENCES APPLICATION(AName) ON DELETE CASCADE ON UPDATE CASCADE
  )`);
}

function createCompanyTable(database) {
  database.run(`
  CREATE TABLE IF NOT EXISTS COMPANY(
    CompanyName TEXT NOT NULL,
    Industry TEXT,
    HomePageURL TEXT,
    Description TEXT,
    PRIMARY KEY(CompanyName)
  )`);
}

function createJobTable(database) {
  database.run(`
  CREATE TABLE IF NOT EXISTS JOB(
    CompName TEXT NOT NULL,
    PositionName TEXT NOT NULL,
    Description TEXT,
    JobPostFile TEXT,
    PositionType TEXT,
    ApplicationDeadline TEXT NOT NULL,
    Salary DECIMAL(10,2),
    PRIMARY KEY (CompName, PositionName)
    FOREIGN KEY (CompName) REFERENCES COMPANY(CompanyName) ON DELETE CASCADE ON UPDATE CASCADE
  )`);
}

function createJobQualificationTable(database) {
  database.run(`
  CREATE TABLE IF NOT EXISTS JOB_QUALIFICATION(
    CompanyName TEXT NOT NULL,
    PositionName TEXT NOT NULL,
    Qualification TEXT NOT NULL,
    PRIMARY KEY (CompanyName, PositionName, Qualification)
    FOREIGN KEY (CompanyName) REFERENCES COMPANY(CompanyName) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (PositionName) REFERENCES JOB(PositionName) ON DELETE CASCADE ON UPDATE CASCADE
  )`);
}

function createJobResponsibilityTable(database) {
  database.run(`
  CREATE TABLE IF NOT EXISTS JOB_RESPONSIBILITY(
    CompanyName TEXT NOT NULL,
    PositionName TEXT NOT NULL,
    Responsibility TEXT NOT NULL,
    PRIMARY KEY (CompanyName, PositionName, Responsibility)
    FOREIGN KEY (CompanyName) REFERENCES COMPANY(CompanyName) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (PositionName) REFERENCES JOB(PositionName) ON DELETE CASCADE ON UPDATE CASCADE
  )`);
}

function createOfferTable(database) {
  database.run(`
  CREATE TABLE IF NOT EXISTS OFFER(
    ApplicantUsername TEXT NOT NULL,
    OfferFileName TEXT NOT NULL,
    ResponseDeadline TEXT NOT NULL,
    Compensation DECIMAL(10,2),
    StartDate DATE,
    Notes TEXT,
    CompName TEXT,
    PosName TEXT,
    
    PRIMARY KEY (ApplicantUsername, OfferFileName),
    FOREIGN KEY (CompName) REFERENCES COMPANY (CompanyName) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (PosName) REFERENCES JOB(PositionName) ON DELETE CASCADE ON UPDATE CASCADE
 )`);
}

function createContactTable(database) {
  database.run(`
  CREATE TABLE IF NOT EXISTS CONTACT(
    ContactID INTEGER PRIMARY KEY AUTOINCREMENT,
    LinkedInURL TEXT NULL,
    Fname TEXT NOT NULL,
    Lname TEXT NOT NULL
  )`);
}

function createContactEmailTable(database) {
  database.run(`
  CREATE TABLE IF NOT EXISTS CONTACT_EMAIL(
    ContactID INTEGER NOT NULL,
    Email TEXT NOT NULL,
    PRIMARY KEY(ContactID, Email),
    FOREIGN KEY (ContactID) REFERENCES CONTACT (ContactID) ON DELETE CASCADE ON UPDATE CASCADE
  )`);
}

function createContactPhoneTable(database) {
  database.run(`
  CREATE TABLE IF NOT EXISTS CONTACT_PHONE(
    ContactID INTEGER NOT NULL,
    Phone TEXT NOT NULL,
    PRIMARY KEY(ContactID, Phone),
    FOREIGN KEY (ContactID) REFERENCES CONTACT (ContactID) ON DELETE CASCADE ON UPDATE CASCADE
  )`);
}

function createReferralTable(database) {
  database.run(`
  CREATE TABLE IF NOT EXISTS CONTACT_PHONE(
    ReferralID INTEGER NOT NULL,
    ContID INT NOT NULL,
    Date TEXT,
    Notes TEXT,
    ApplicantUsername TEXT NOT NULL,
    CompName TEXT NOT NULL,
    PosName TEXT NOT NULL,

    PRIMARY KEY (ReferralID, ContID),
    FOREIGN KEY (ContID) REFERENCES CONTACT (ContactID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ApplicantUsername) REFERENCES APPLICANT (Username) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (CompName) REFERENCES COMPANY (CompanyName) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (PosName) REFERENCES JOB (PositionName) ON DELETE CASCADE ON UPDATE CASCADE
  )`);
}

function createMentionsTable(database) {
  database.run(`
  CREATE TABLE IF NOT EXISTS MENTIONS(
    ApplicantUsername TEXT NOT NULL,
    InterID INT NOT NULL,
    CompName TEXT NOT NULL,
    PosName TEXT NOT NULL,
    PRIMARY KEY (ApplicantUsername, InterID, CompName, PosName),
    FOREIGN KEY (InterID) REFERENCES INTERVIEW (InterviewID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ApplicantUsername) REFERENCES APPLICANT (Username) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (CompName) REFERENCES COMPANY (CompanyName) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (PosName) REFERENCES JOB (PositionName) ON DELETE CASCADE ON UPDATE CASCADE
  )`);
}

function createCorrespondsToTable(database) {
  database.run(`
  CREATE TABLE IF NOT EXISTS MENTIONS(
    ApplicantUsername TEXT NOT NULL,
    ApplicationName TEXT NOT NULL,
    CompName TEXT NOT NULL,
    PosName TEXT NOT NULL,
    JobPostURL TEXT,
    PRIMARY KEY (ApplicantUsername, ApplicationName, CompName, PosName),
    FOREIGN KEY (ApplicationName) REFERENCES APPLICATION (AName) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ApplicantUsername) REFERENCES APPLICANT (Username) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (CompName) REFERENCES COMPANY (CompanyName) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (PosName) REFERENCES JOB (PositionName) ON DELETE CASCADE ON UPDATE CASCADE
  )`);
}

function createSubmitWithTable(database) {
  database.run(`
  CREATE TABLE IF NOT EXISTS SUBMIT_WITH(
    ApplicantUsername TEXT NOT NULL,
    ApplicationName TEXT NOT NULL,
    DocFile TEXT NOT NULL,
    PRIMARY KEY (ApplicantUsername, ApplicationName, DocFile),
    FOREIGN KEY (ApplicationName) REFERENCES APPLICATION (AName) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ApplicantUsername) REFERENCES APPLICANT (Username) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (DocFile) REFERENCES DOCUMENT (DocFileName) ON DELETE CASCADE ON UPDATE CASCADE
  )`);
}

function createTracksTable(database) {
  database.run(`
  CREATE TABLE IF NOT EXISTS TRACKS(
    ApplicantUsername TEXT NOT NULL,
    CompName TEXT NOT NULL,
    PosName TEXT NOT NULL,
    Notes TEXT,
    DateToApply TEXT,
    PRIMARY KEY (ApplicantUsername, CompName, PosName),
    FOREIGN KEY (ApplicantUsername) REFERENCES APPLICANT (Username) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (CompName) REFERENCES COMPANY (CompanyName) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (PosName) REFERENCES JOB (PositionName) ON DELETE CASCADE ON UPDATE CASCADE
  )`);
}

function createWorksAtTable(database) {
  database.run(`
  CREATE TABLE IF NOT EXISTS WORKS_AT(
    CompName TEXT NOT NULL,
    ContID INT NOT NULL,
    Role TEXT,
    PRIMARY KEY (CompName, ContID),
    FOREIGN KEY (CompName) REFERENCES COMPANY (CompanyName) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ContID) REFERENCES CONTACT (ContactID) ON DELETE CASCADE ON UPDATE CASCADE
  )`);
}

function createKnowsTable(database) {
  database.run(`
  CREATE TABLE IF NOT EXISTS WORKS_AT(
    ContID INT NOT NULL,
    ApplicantUsername TEXT NOT NULL,
    Relationship TEXT,
    Notes TEXT,
    LastContactDate TEXT,
    PRIMARY KEY (ContID, ApplicantUsername),
    FOREIGN KEY (ApplicantUsername) REFERENCES APPLICANT (Username) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ContID) REFERENCES CONTACT (ContactID) ON DELETE CASCADE ON UPDATE CASCADE
  )`);
}

function createAttendsTable(database) {
  database.run(`
  CREATE TABLE IF NOT EXISTS ATTENDS(
    ContID INT NOT NULL,
    ApplicantUsername TEXT NOT NULL,
    InterID INT NOT NULL,
    PRIMARY KEY (ContID, ApplicantUsername, InterID),
    FOREIGN KEY (ApplicantUsername) REFERENCES APPLICANT (Username) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ContID) REFERENCES CONTACT (ContactID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (InterID) REFERENCES INTERVIEW (InterviewID) ON DELETE CASCADE ON UPDATE CASCADE
  )`);
}

function createAllTables(database) {
  createUserTable(database);
  createApplicantTable(database);
  createApplicantExperienceTable(database);
  createApplicantProjectTable(database);
  createApplicantCertificationTable(database);
  createApplicantSkillTable(database);
  createApplicantCompetitionTable(database);
  createApplicationTable(database);
  createInterviewTable(database);
  createDocumentTable(database);
  createApplicationRelevantURLTable(database);
  createApplicationCategoryTable(database);
  createCompanyTable(database);
  createJobTable(database);
  createJobQualificationTable(database);
  createJobResponsibilityTable(database);
  createOfferTable(database);
  createContactTable(database);
  createContactEmailTable(database);
  createContactPhoneTable(database);
  createReferralTable(database);
  createMentionsTable(database);
  createCorrespondsToTable(database);
  createSubmitWithTable(database);
  createTracksTable(database);
  createWorksAtTable(database);
  createKnowsTable(database);
  createAttendsTable(database);
}

function dropAllTables(database) {
  dropUserTable(database);
}

exports.createAllTables = createAllTables;
exports.dropAllTables = dropAllTables;
