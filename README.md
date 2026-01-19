# Movie App

## Importent Notes
- movies.json should be imported to a mongodb collection named movies.
- the db name be in the application.properties, every collection name should be handled automatically via spring boot.
- React version is v18.2.0 because of older ui styling and i was first introduced to react it took me time to understand how those packages function with react cause i know npm but on vanila.
- i didnt create this project from the ground but i added a lot to it.
- through this readme you might see some typos but for the most part i think its readable.
## Prerequisites
- `node`: v22.17.1 or higher
- `java-jdk` : 21 
- `gradle`: 8.11.1 or higher

## Key Dependencies In Project
### *Package.json*
- `react-player` : responsible for trailer previews
- `react-bootstrap` : responsible for buttons, forms, conatainers and small interfaces mostly.
- `react-router-dom` : responsible for easy navigation between pages
- `axios` : for sending or fetching data from the spring boot server
- `react-query` : make it easy to handle promises or errors that might come from the server.
- `font awesome` : icons
- `material ui (@mui)` :  responsible for easy carousel navigation between movies and display organized movie cards
- `emotion/styled (Styled Components)`: i personally dont use styled components but material ui does styled components behind the scenes so its a crucial dependency to this project.


### *build.gradle*
- `spring security` : resonsible for routes handling(protected/unprotected routes), cors configuration, auth filters.
- `spring web` : also responsible for basic http requests that going through cors but in smaller scale
- `spring crypto` : responsible for bcrypt password encoding before hitting the database and passoword decoding to match user input with database password.
- `oauth2` : responsible for json web token generate for authentications and secret key management
- `io.jsonwebtoken` : for building the token and handling token functiabilty
- `lombok` : for easy constructor injections 

- `jakarta-validation` : validate that the data that come from frontend is good to go


## Enviorment

    as of right now i didnt mix ci/cd pipelines and is still in progress but for now theres dot env to server and a dot env for client 

### react dot-env

**react dot env relative path will be at movie-client/
in other words in root project of react*

*if you choose to run locally:*
#### .env
```bash
VITE_SPRING_BOOT=http://localhost:8080
```
#

### spring dot-env and application.properties

**spring react dot env and application.properties relative path will be at 
moviesproject/movie-server/src/main/resources
important to remmeber that the dot env inject it values to application.properties and application.properties know to communicate with springboot via spring boot default annotaions libraries*

#### application.properties
```bash
spring.application.name=movies
spring.data.mongodb.database=${MONGO_DATABASE_NAME}
spring.data.mongodb.uri=${MONGO_URI}
react.host=${REACT_HOST}
jwt.secret=${JWT_SECRET}
```
#### .env
```bash
MONGO_DATABASE_NAME=movie-api-db
MONGO_URI=mongodb://localhost:27017
REACT_HOST=http://localhost:5173
JWT_SECRET="<must-be-256-bits-secret>"
```
#
**host and port could be different if poriject uploaded to a a public domain.*
*also adding certifcate can change to https but the project is not there nor was meant to go there*
#

## Setup
### git clone
```bash
git clone https://github.com/yehiamtheone/movie-app.git
cd movie-app
```
#### springboot
```bash
cd movie-server
gradle bootRun
```
#### vite + react
```bash
cd movie-client
npm run dev
```
#
**Things aren't finalized and project is still in progress those are the first commits where i check where things stand*





