const { DataTypes } = require("sequelize");
const sequelize = require("../server");

const Contact = sequelize.define(
  "CONTACT",
  {
    ContactID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    LinkedInURL: {
      type: DataTypes.STRING(64),
      unique: "actions_unique",
    },
    Fname: {
      type: DataTypes.STRING(16),
      allowNull: false,
      unique: "actions_unique",
    },
    Lname: {
      type: DataTypes.STRING(16),
      allowNull: false,
      unique: "actions_unique",
    },
  },
  {
    uniqueKeys: {
      actions_unique: {
        fields: ["LinkedInURL", "Fname", "Lname"],
      },
    },
    timestamps: false,
    id: false,
  }
);

// ---

const ContactEmail = sequelize.define(
  "CONTACT_EMAIL",
  {
    ContactID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: "actions_unique",
      references: {
        model: Contact,
        key: "ContactID",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    Email: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false,
      unique: "actions_unique",
    },
  },
  {
    uniqueKeys: {
      actions_unique: {
        fields: ["ContactID", "Email"],
      },
    },
    timestamps: false,
    id: false,
  }
);

// Define the foreign key relationship
ContactEmail.belongsTo(Contact, {
  foreignKey: "ContactID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Contact.hasMany(ContactEmail, {
  as: "Emails",
  foreignKey: "ContactID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// ---

const ContactPhone = sequelize.define(
  "CONTACT_PHONE",
  {
    ContactID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: Contact,
        key: "ContactID",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    Phone: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      allowNull: false,
      unique: "actions_unique",
    },
  },
  {
    uniqueKeys: {
      actions_unique: {
        fields: ["ContactID", "Phone"],
      },
    },
    timestamps: false,
    id: false,
  }
);

// Define the foreign key relationship
ContactPhone.belongsTo(Contact, {
  foreignKey: "ContactID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Contact.hasMany(ContactPhone, {
  as: "Phones",
  foreignKey: "ContactID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// ---
const ContactWorksAtCompany = sequelize.define(
  "WORKS_AT",
  {
    Role: {
      type: DataTypes.STRING(64),
    },
  },
  {
    timestamps: false,
    foreignKey: "ContactID",
    otherKey: "CompanyName",
  }
);

// definition of many-to-many relationship b/t Contact and Company

const { Company } = require("./companyModel");
const { Interview } = require("./interviewModel");

Contact.belongsToMany(Company, {
  through: ContactWorksAtCompany,
  as: "Companies",
  foreignKey: "ContactID",
  otherKey: "CompanyName",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Company.belongsToMany(Contact, {
  as: "Contacts",
  through: ContactWorksAtCompany,
  foreignKey: "CompanyName",
  otherKey: "ContactID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

//contact has a many-to-many relationship with interview
const ContactAttendsInterview = sequelize.define(
  "ATTENDS",
  {
    ContactID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: Contact,
        key: "ContactID",
      },
    },
    InterviewID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: Interview,
        key: "InterviewID",
      },
    },
  },
  {
    timestamps: false,
  }
);

Contact.belongsToMany(Interview, {
  as: "Interviews",
  through: ContactAttendsInterview,
  foreignKey: "ContactID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Interview.belongsToMany(Contact, {
  as: "Contacts",
  through: ContactAttendsInterview,
  foreignKey: "InterviewID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
exports.Contact = Contact;
exports.ContactEmail = ContactEmail;
exports.ContactPhone = ContactPhone;
exports.ContactWorksAtCompany = ContactWorksAtCompany;
exports.ContactAttendsInterview = ContactAttendsInterview;

/*
  If any changes occurred to the model, sequelize.sync just ensures that they are
  applied to the database.
*/
sequelize.sync();
