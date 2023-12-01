Each route must have SOMETHING that occurs when the user
accesses the route. For example, if the user goes to
`"insert prefix"/signup`, we want to do something.

The "something" is done by the controller (which is just
a fancy name for a function). For example, when the user
goes to `"insert prefix"/signup` using a POST request, the
`authController.signUpUser` function will run.

The `router.METHODNAME` matters (for readability); use POST
for creating something new, GET for retrieving info from the
database (no creation), PUT for updating an existing entry
in the database, and DELETE for removing something from the
database.

Normally, a route is of the form /ResourceNameS. For example, if it
was a route dealing with interviews, you would do
`router.route("/interviews")` to register the route, and then do

```
router.route("/interviews")
.post(createInterview)
.get(getAllInterviews)
```

If it is peforming an operation on an already existing entry in the database
(such as a single interview), you would include the ID as part of the queryString.
For example, you would do

```
router.route("/interviews/:id")
.get(getInterview)
.patch(updateInterview)
```

The `":id"` in the queryString ensures that ExpressJS can take it and handle it as a parameter.

If you wanted to put in multiple "handler" functions (maybe you need to do something before
your controller "deals" with the request), it is of the form

`router.route(routeName).httpMethod(middleware1, middleware2)`. Inside of the `middleware1` function,
you will have to take request, response, next as arguments, and then call `next()` at the end
of the function. This "signals" to express to go to the next middleware (which in this case is
`middleware2`).
