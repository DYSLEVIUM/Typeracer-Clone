# Typeracer - Clone [![Netlify Status](https://api.netlify.com/api/v1/badges/5d0611fb-5bff-4839-b488-3f027a7a9a8d/deploy-status)](https://app.netlify.com/sites/typeracer-clone-socket/deploys)

This is the original repository which was used to **deploy** the application **to a virtual machine using azure**. 

This repository alos **contains all the demo files** used in the readme file, making the **size of the repository** around **90MB**.

##  Preface

This repository contains both the server and the client side files for the application. This application has also been split into its server-side repository and the client side repository, so as to promote separation of concerns.

This site is live at https://typeracer-clone-socket.netlify.app.

This project is a **Full - Stack** app made with **MongoDB**, **Express**, **Angular**, **NodeJs** and uses **Docker** to run the application. This app was built to get familiar with the current trending technologies in **Full - Stack** web applications. Also, this project structure and design can be used as a template for modern web apps.

##  Demo

<p align="center">
  <a href="https://github.com/Pushpakant/typeracer-clone/blob/master/demo/demo.mp4?raw=true"><img src="https://github.com/Pushpakant/typeracer-clone/blob/master/demo/demo.gif?raw=true"></a>
</p>

_Click on the **[gif](https://github.com/Pushpakant/typeracer-clone/blob/master/demo/demo.mp4?raw=true)** to download a higher resolution video._

## Screenshot

![preview](https://github.com/Pushpakant/typeracer-clone/blob/master/demo/img.png?raw=true)

## Run instructions

The project is separated into client/server directories. This project is run with `docker` & `docker-compose`. Make sure to install **docker** and **docker-compose** to run this project hassle-free.

    1.  Open terminal and type the following commands :

        $   git clone https://github.com/Pushpakant/typeracer-clone.git
        $   cd typeracer-clone
        $   docker-compose build
        $   docker-compose up -d
        $   start chrome http://localhost
        
    2.  The project is now running.
