# Northcoders News API

Welecome to NC News, this RESTful API project emulates the backend of a news media platform, enabling interaction and manipulation of data stored in an SQL database through endpoints that encompass CRUD operations. The development process followed Test Driven Development principles, encompassing scenarios of the happy and sad path. This project requires a basic understanding of node-postgres, express and SQL.

Live Version: https://backend-project-m2ru.onrender.com/api/

Step 1:

- Fork this repo and then clone it using this url: 
https://github.com/sofefaal/backend_project

- Navigate into the repo folder using cd
- Use the following code to create a new repository with a cloned code

git remote set-url origin YOUR_NEW_REPO_URL_HERE
git branch -M main
git push -u origin main

-Open the repo inside VScode using the following
code .

Step 2

You'll need to install the following dependencies:
- npm install jest -D
- npm install supertest
- npm install
- npm install pg-format
- npm install --save-dev jest-sorted

Step 3

Create the following files: .env.test and .env.development, 

- In the .env.test file add the following to access the database: PGDATABASE=nc_news_test
- For the .env.development file add the following: PGDATABASE=nc_news

Step 4

Run the following code in the terminal:
- npm run setup-dbs 
- npm run seed
- npm run seed-prod
