// File: src/server.ts
// Author: Tim Richards
// Date: January 29, 2026
//
// An Express application is an HTTP application framework for Node.js.
// It simplifies the process of handling HTTP requests and responses.
// This allows us to build web servers and APIs more easily.
//
// This is the start of our Journal App server.

// This is how we import the Express library into our project:
// Note: You need to have Express and its type definitions installed
// using npm for this import to work.
// You can install them with the following commands:
//   npm install express
//   npm install --save-dev @types/express
import Express from "express";

// This is the first step in setting up our Express server. We need
// to create an instance of an Express application.
const app = Express();

// To serve static files such as HTML, CSS, and JavaScript from
// the "public" directory, we use the built-in middleware function
// `Express.static`. This allows us to host our front-end files.
// We are going to need this to serve various static assets for our
// application.
app.use(Express.static("static"));

// Now we set up a simple route to handle HTTP GET requests to the
// root URL ("/"). When someone visits this URL, the server will
// respond with a friendly message.
app.get("/", (req, res) => {
  const html = `
    <html>
      <head>
        <title>Journal App</title>
        <link rel="stylesheet" type="text/css" href="/styles.css">
      </head>
      <body>
        <h1>Welcome to the Journal App!</h1>
        <p>This is the starting point of our Journal Application.</p>
      </body>
    </html>
  `;
  res.contentType("text/html");
  res.send(html);
});

// The next important step is to define a port number for our server
// to listen on. A port is like a door through which our server
// communicates with the outside world. Port 3000 is commonly used
// for development servers.
const PORT = 3000;

// Finally, we start the server by calling the `listen` method on
// our Express application instance. This tells the server to start
// listening for incoming requests on the specified port.
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// When you run this code (either with `npx ts-node src/server.ts` for
// TypeScript or by compiling it to JavaScript and running with Node.js),
// it will listen for incoming HTTP requests on port 3000. You can visit
// `http://localhost:3000` or `http://localhost:3000/journal.html`in your
// web browser to see the start of The Journal App.
