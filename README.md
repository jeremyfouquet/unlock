# Unlock (Escape Game en Ligne)

Un projet d'application web reprenant le celebre jeux d'escape game Unlock. La réalisation est faite en NodeJs pour une programmation full stack et la communication se fait en temps réèl grâce à socket.io. Les modules d'interface sont eux réalisé en HTML CSS et JavaScript.

---

## Authors

Jeremy Fouquet
Thibaut Decressonniere
Georges Miot

## Technologies
- Javascript
- CSS
- Html
- Node.js
- socket.io

### A typical top-level directory layout

    .
    ├── datas                   # Json files for data base
    ├── controllers             # 
    ├── middlewares             # 
    ├── models                  # 
    ├── public                  # Assets and Javascript and Css files (Frontend/Client)
    ├── routes                  #
    ├── views                   # Html elements
    ├── .gitignore              # File specifies intentionally untracked files that Git should ignore
    ├── .env                    # config to mongodb ignoring by git
    ├── .env.example            # sample config to to mongodb
    ├── app.js                  
    ├── socket.js               # Module constructor for socket.io with all functions
    ├── server.js               # Application entry point (Backend/Server)
    ├── package.json            # This file is used to give the project's dependencies to npm
    └── README.md

## Requirements

For development, you will only need Node.js and a node global package installed in your environement.

### Node

This project requires Npm version >=8.11.0 <=9.5.0 and Node version >=16.15.1 <=18.15.0

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v18.15.0

    $ npm --version
    9.5.0

## Install

    $ git clone https://github.com/jeremyfouquet/unlock.git
    $ cd unlock
    $ npm install

## Create config

For connected the mongodb you need to create .env file on root project and place your Secret URI like .env.example

## Running the project

    $ npm start

## See project on localhost development

http://localhost:${port}

http://localhost:3000

## See project on production

[projet-unlock](https://root-carnelian-sneezeweed.glitch.me/) (https://root-carnelian-sneezeweed.glitch.me/)
