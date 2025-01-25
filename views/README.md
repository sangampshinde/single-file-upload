# multer





# HTTP Status Codes

You can send different HTTP status codes to indicate the result of a request. Here are some common categories:

    Success (2xx):
        200 OK: The request was successful.
        201 Created: A resource was successfully created.
        204 No Content: The request was successful, but there is no content to send back.

    Client Errors (4xx):
        400 Bad Request: The server cannot process the request due to client error (e.g., malformed request).
        401 Unauthorized: Authentication is required and has failed or has not yet been provided.
        403 Forbidden: The server understands the request but refuses to authorize it.
        404 Not Found: The requested resource could not be found.
        409 Conflict: The request could not be completed due to a conflict with the current state of the resource.

    Server Errors (5xx):
        500 Internal Server Error: A generic error message when the server encounters an unexpected condition.
        502 Bad Gateway: The server received an invalid response from an upstream server.
        503 Service Unavailable: The server is not ready to handle the request, often due to maintenance.

# Sending Responses

You can send various types of responses using the res object in Express:

Text Response:

    res.send('Hello, World!');

JSON Response:

    res.json({ message: 'Hello, World!' });

HTML Response:

    res.send('<h1>Hello, World!</h1>');

File Response:

    res.sendFile('/path/to/file');

Redirect:

    res.redirect('/new-url');

# Error Handling Middleware

In Express, you can create custom error handling middleware to manage errors more effectively. This middleware can catch errors thrown in your application and send a standardized response.

Example of an error handling middleware:

app.use((err, req, res, next) => {
console.error(err.stack); // Log the error stack
res.status(500).send('Something broke!'); // Send a generic error response
});

#Throwing Errors

You can throw errors in your application, which can be caught by your error handling middleware. For example:

app.get('/some-route', (req, res, next) => {
try {
    // Some code that may throw an error
    throw new Error('Something went wrong!');
} catch (err) {
    next(err); // Pass the error to the error handling middleware
}
});


# Using Promises and Async/Await

When using Promises or async/await, you can handle errors using .catch() or try/catch blocks, respectively.

Example with async/await:

app.get('/async-route', async (req, res)) => {
try {
    const data = await someAsyncFunction();
    res.json(data);
} catch (err) {
    res.status(500).send('Internal Server Error');
}
}
