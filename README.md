# Unlock (Escape Game en Ligne)

Un projet d'application web reprenant le célèbre jeu d'escape game Unlock a été réalisé en utilisant Node.js pour une programmation full stack, avec une communication en temps réel grâce à Socket.IO. Les modules d'interface ont été développés en HTML, CSS et JavaScript.

---

## Authors

- Jeremy Fouquet
- Thibaut Decressonniere
- Georges Miot

## Technologies
- Javascript
- CSS
- Html
- Node.js
- Socket.io
- Mongoose
- Express

### A typical top-level directory layout

    .
    ├── controllers             # Controller function files directory for HTTP request handling and application-specific functionalities
    ├── datas                   # Directory containing Json files for the games datas
    ├── middlewares             # Defines middleware functions for handling CORS (Cross-Origin Resource Sharing) headers in HTTP requests
    ├── models                  # Directory containing the user model schema and methods for interacting with the user data in the database
    ├── public                  # Directory containing assets, javascript and css files for the Frontend/Client
    ├── routes                  # Directory containing files for defining and handling HTTP request routes in the application
    ├── tests                   # Directory where test files and resources for validating the application's functionality are grouped
    ├── views                   # Directory containing HTML files
    ├── .gitignore              # File specifies intentionally untracked files that Git should ignore
    ├── .env                    # config to mongodb ignoring by git
    ├── .env.example            # sample config to mongodb
    ├── .npmrc                  # A configuration file enforcing strict compatibility checks for the specified package's runtime engines.
    ├── app.js                  # Main app file handling Express configuration, routes, and MongoDB connection
    ├── socket.js               # File handling real-time client communication via WebSockets, defining socket events and actions
    ├── server.js               # File managing the HTTP server, port definition, and error handling
    ├── package.json            # This file is used to give the project's dependencies to npm
    └── README.md               # A concise document providing essential information and instructions about the project.

## Requirements

For development, you will only need Node.js and a node global package installed in your environment.

### Node

This project requires Npm version >=7.20.6 <=9.5.0 and Node version >=16.14.2 <=18.15.0

- #### Node installation on Windows

  Just go [official Node.js website](https://nodejs.org/) and download the installer.

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm
      
  But it is recommended to use nvm to have the latest versions : https://github.com/nvm-sh/nvm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    # Sample output
    $ node --version
    v18.15.0

    $ npm --version
    9.5.0

## Install

    $ git clone https://github.com/jeremyfouquet/unlock.git
    $ cd unlock
    $ npm install

## Create config

For connected the mongodb you need to create .env file on root project and place the personal information like .env.example

## Running the project

    $ npm run start

## Running the project on development with nodemon

    $ npm run dev

## Running the tests

    $ npm test

## Generate documentation

    # https://www.youtube.com/watch?v=FrUQnR4GTpQ
    $ npm run doc

## See project on localhost development

http://localhost:${port}

http://localhost:3000

## See project on production

[projet-unlock](https://pebble-scalloped-entrance.glitch.me/) (https://pebble-scalloped-entrance.glitch.me/)
