# Teeny Tiny Mini Reddit

* CPSC 473 - Web Programming and Data Management
* Spring 2014
* Implement a Teeny-Tiny-Mini reddit site.

---

## Demo

[View live demo](https://cpsc-473-reddit.herokuapp.com)


## Setup

```
# install node modules
npm install

# (manually) initialize `reddit` collection
# mongoimport -h <hostname><:port> -d <database> -c <collection> -u <user> -p <password> --file reddit.json

# start app
npm start
```


## Credits

**JS Libraries**

* [Express](http://expressjs.com/)
* [Jade](http://jade-lang.com/)
* [jQuery](https://jquery.com/)
* [underscore.js](http://underscorejs.org/)
* [Bootstrap](http://getbootstrap.com/)
* [Font Awesome](http://fortawesome.github.io/Font-Awesome/)


**Databases**

* [MongoDB](https://www.mongodb.org/)


**Services**

* [Heroku](https://www.heroku.com/)
* [MongoLab](https://mongolab.com/)
* [Disqus](https://disqus.com/)
