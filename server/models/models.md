You'll notice that certain models have functions defined (such as user).
Why not put this in the controller?

Well, backend design says we should have "FAT models, THIN controllers."
In other words, the controller should be focused MAINLY on simply communicating
with the database. If possible, data validation and operations on the columns
of each table should be put in the model class.

This isn't always possible (like in the `authController`, because authentication
often requires special logic unrelated to the User's columns). But if it is,
we follow it.
