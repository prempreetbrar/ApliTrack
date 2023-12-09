const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../server");

const { AppError } = require("../utils/errorHandling");

const User = sequelize.define(
  "USER",
  {
    Username: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    Password: {
      type: DataTypes.CHAR(64),
      comment: "64 hex chars to store SHA256 hash",
    },
    PasswordConfirm: {
      type: DataTypes.CHAR(64),
      validate: {
        matchesPassword(value) {
          if (value !== this.Password) {
            throw new AppError("Please make sure your passwords match.", 401);
          }
        },
      },
      comment: "Ensuring that the entered password equals the confirmed one.",
    },
    Fname: {
      type: DataTypes.STRING(16),
    },
    Lname: {
      type: DataTypes.STRING(16),
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Setting the default value to true (or 1)
    },
    AdminFlag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    PermissionLevel: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: false, // we don't need to store the time of creation or updation
    /*
      We don't want to be returning the password through queries unless needed in specific
      cases (like checking login or authentication). In those cases, we'll manually override this.
      Why? Returning passwords from a query (even hashed) is a security risk.
    */
    defaultScope: {
      attributes: { exclude: ["Password"] },
    },
  }
);

/*
PermissionLevel attribute in User is no longer a Foreign Key. It was decided that having  
Permission and Permission_Ability tables was redundant, since combining the Admin flag and PermissionLevel 
in the User table simplified the backend while maintaining desired functionality. We also removed the Developer flag 
and Dev_Specialization table because a developer/admin's permissions and abilities are normally managed
in the GitHub repository, NOT in the actual application itself. 

Permission.hasMany(User, {
  foreignKey: 'PermissionLevel',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});
User.belongsTo(Permission, {
  foreignKey: "PermissionLevel",
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});
*/

/*
  ALL HOOKS (the following section) are applied AFTER any validate functions in the schema.
  For example, User.beforeSave FIRST checks if PasswordConfirm matches Password, BEFORE going
  ahead and hashing it.
*/
User.beforeSave(async (user, options) => {
  if (user.Password) {
    user.Password = await bcrypt.hash(user.Password, 12);
    user.PasswordConfirm = undefined;
  }
});

User.prototype.isPasswordCorrect = async function (
  candidatePassword,
  actualPassword
) {
  return await bcrypt.compare(candidatePassword, actualPassword);
};

async function createAdminUser() {
  try {
    const adminUser = await User.create({
      Username: "admin@admin.com",
      Password: "admin",
      PasswordConfirm: "admin",
      AdminFlag: true,
    });

    console.log("Admin user created:", adminUser);
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

createAdminUser();

/*
  If any changes occurred to the model, sequelize.sync just ensures that they are
  applied to the database.
*/
sequelize.sync();
exports.User = User;
