const { DataTypes } = require("sequelize");
const sequelize = require("../server");
const { Company } = require("./companyModel");

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
      // two different people CANNOT have the same LinkedInURL
      unique: true,
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
      allowNull: false,
      primaryKey: true,
      references: {
        model: Contact,
        key: "ContactID",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      unique: "actions_unique",
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
Contact.belongsToMany(Company, {
  through: ContactWorksAtCompany,
  as: "Companies",
  foreignKey: "ContactID",
  otherKey: "CompanyName",
});
Company.belongsToMany(Contact, {
  as: "Contacts",
  through: ContactWorksAtCompany,
  foreignKey: "CompanyName",
  otherKey: "ContactID",
});

// definition of many-to-many relationship b/t Contact and Company

/*
  If any changes occurred to the model, sequelize.sync just ensures that they are
  applied to the database.
*/
sequelize.sync();
exports.Contact = Contact;
exports.ContactEmail = ContactEmail;
exports.ContactPhone = ContactPhone;
exports.ContactWorksAtCompany = ContactWorksAtCompany;
