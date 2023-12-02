const { DataTypes } = require("sequelize");
const sequelize = require("../server");
const {Company} = require("./companyModel");
const { Interview } = require("./interviewModel");

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
    },
    Fname: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    Lname: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
  },
  {
    timestamps: false,
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
      references: {
        model: Contact,
        key: "ContactID",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    Email: {
      type: DataTypes.STRING(64),
      primaryKey: false,
      allowNull: false,
    },
  },
  {
    uniqueKeys: {
      actions_unique: {
        fields: ["ContactID", "Email"],
      },
    },
    timestamps: false,
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
      primaryKey: false,
      allowNull: false,
    },
  },
  {
    uniqueKeys: {
      actions_unique: {
        fields: ["ContactID", "Phone"],
      },
    },
    timestamps: false,
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
  'WORKS_AT', 
{
  Role: {
    type: DataTypes.STRING(64),
  },
}, {
  timestamps: false
})
Contact.belongsToMany(Company, {through: ContactWorksAtCompany});
Company.belongsToMany(Contact, {through: ContactWorksAtCompany});

// definition of many-to-many relationship b/t Contact and Company

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
          }
      },
      InterviewID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          references: {
              model: Interview,
              key: "InterviewID",
          }
      }
  },
  {
      timestamps: false,
  }
);

Contact.belongsToMany(Interview, {
  through: ContactAttendsInterview,
  foreignKey: "ContactID",
});
Interview.belongsToMany(Contact, {
  through: ContactAttendsInterview,
  foreignKey: "InterviewID",
});


/*
  If any changes occurred to the model, sequelize.sync just ensures that they are
  applied to the database.
*/
sequelize.sync();
exports.Contact = Contact;
exports.ContactEmail = ContactEmail;
exports.ContactPhone = ContactPhone;
exports.ContactWorksAtCompany = ContactWorksAtCompany;
exports.ContactAttendsInterview = ContactAttendsInterview;
