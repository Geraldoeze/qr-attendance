const mongodb = require('mongodb');
const { getDb } = require('../database/mongoConnect');


class Admin {
    constructor(
        firstName, lastName, email, gender, id, address, contact, password, title, accessLevel, adminType
    ) {
        this.firstName = firstName;  
        this.lastName = lastName;
        this.email = email;  
        this.gender = gender;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.address = address;
        this.contact = contact;
        this.password = password;
        this.title = title;
        this.accessLevel = accessLevel;
        this.adminType = adminType;
        this.type = "admin";
        
    }


    // the static key enables me call getAllUsers directly on the class itself
    static getAllUsers() {
        const db = getDb();
        return db.collection('admin')
        .find()
        .toArray()    
        .then(users => {
            return users;

        })
        .catch(err => {             
            console.log(err);
        });
    }

    saveToDB() {
        const db = getDb();
        return db.collection('admin').insertOne(this);
    }
    
    static findById(Id) {
        const db = getDb();
        return db.collection('admin')
        .find({_id: new mongodb.ObjectId(Id)})
        .next() 
        .then(user => {
          return user;
        })
        .catch(err => console.log(err))
    }

   
}

module.exports = Admin;