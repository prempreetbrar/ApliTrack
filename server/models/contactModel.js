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

  // Define the foreign key relationships
  // these were causing errors for some reason...commented out for now
  /*
  Contact.hasMany(ContactEmail, {
    foreignKey: "ContactID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  
  Contact.hasMany(ContactPhone, {
    foreignKey: "ContactID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
*/

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
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  // Define the foreign key relationship
  ContactEmail.belongsTo(Contact, {
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
      },
    },
    {
      timestamps: false,
    }
  );

  // Define the foreign key relationship
  ContactPhone.belongsTo(Contact, {
    foreignKey: "ContactID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // ---

/*
  If any changes occurred to the model, sequelize.sync just ensures that they are
  applied to the database.
*/
sequelize.sync();
exports.Contact = Contact;
exports.ContactEmail = ContactEmail;
exports.ContactPhone = ContactPhone;