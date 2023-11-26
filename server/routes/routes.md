Each route must have SOMETHING that occurs when the user
accesses the route. For example, if the user goes to
"insert prefix"/signup, we want to do something.

The "something" is done by the controller (which is just
a fancy name for a function). For example, when the user
goes to "insert prefix"/signup using a POST request, the
authController.signUpUser function will run.

The router.METHODNAME matters (for readability); use POST
for creating something new, GET for retrieving info from the
database (no creation), PUT for updating an existing entry
in the database, and DELETE for removing something from the
database.
