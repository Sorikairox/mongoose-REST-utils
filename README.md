# mongoose-REST-utils


## Installation
```bash
$ npm install -g mongoose-rest-utils
```

## Usage

Utils allow you to perform basic and more or less complexe GET POST PUT and DELETE operations with mongoose !

The 4 methods (get, post, put and delete) take 4 arguments : 

- req which is the request object
- res which is the response object
- Model which is the mongoose model you want to use
- an optional success callback method that take three arguments req, res, Array || CreatedEntity || UpdatedEntity. If no callback is given, the method send a response with the new object, the updated object or the entity array returned in case of POST, PUT or GET.

###GET

####PAGINATION
The GET method can take severals parameters from the query object of the request for pagination: 

```javascript
req.query['limit'] = 5; //integer maximum number of result returned, same as SQL's limit
req.query['page'] = 5 //integer page you want to access, starting from 0, each page contains 'limit' result
```

####FILTERING

It also takes severals parameter for filtering and/or populating field on the entity you request. For example let's say I want to get people whose firstname are John, but exclude their age from the result : 


```javascript
req.query["firstname"] = "John"; //firstname being the attribut in your model
req.query["not_age"] = true;
```

####POPULATING

For now, utils provides populating up to 2 nesting.
##### 0 LEVEL DEEP (populate attribute)

Let's say I want to populate a car attribute of my entity : 


```javascript
req.query["populate_car"] = true;
```
##### 1 LEVEL DEEP (populate attribute nested inside populated attribute)
Now I want to populate the car's model attribute at the same time : 


```javascript
req.query["populate_nested_car"] = "model";
```

##### 2 LEVEL DEEP (populate attribute nested inside populated attribute nested inside populate attribute)
Because nesting never stop, I want to populate the model's brand attribute : 

```javascript
req.query["populate_nested_deep_car_model"] = "brand";
```

However I'm sure there is a recursive way to deal with nested populate, not went into it so far.


###POST

The POST just create an entity passed into a "data" attribute from body.
```javascript
req.body.data = {firstname : "John", lastname :"Doe"};
```



###PUT

The PUT just update an entity passed into a "data" attribute from body.
```javascript
req.body.data = {_id : "e654fefeacde654", firstname : "John", lastname :"Doe"};
```



###DELETE

The DELETE just delete an entity with the id given in the url params attribute
```javascript
 Model.findOneAndRemove({_id: req.params.id}, function (err) {
        if (err)
            return res.status(500).json({success: false, data: err});
        return res.status(200).json({success: true});
    });
```
