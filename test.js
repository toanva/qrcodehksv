const  MongoClient = require('mongodb').MongoClient;
var databaseName='heroku_g41d98gw';
var urlmg='mongodb://nsvn:nsvn6688@ds251849.mlab.com:51849/'+databaseName;


class MyClass {

    constructor() {}

    findProvincial(req, res, next) {
        var re;
		var db
			MongoClient.connect(urlmg, function(err, client) 
			{	
				//console.log("client:",client.db);
				//console.log("client 2:",client.db(databaseName));
				if (err) 
				{
				  re ='Unable to connect to the mongoDB server. Error:'+ err;
				}else
				{
					 db = client.db(databaseName);
					 db.collection('Provincial').find({}).toArray(
					 function(err, results)
					 {
						if(err)
						{						
						  //console.log("err:", err);
						}else
						{						  
						   
						    re ="Code " +results[0]._id+ " and Name: " +results[0].Name + " and Type: " +results[0].Type;
							console.log(re);							   
						}
					 });
				   
				}
			    if(client)
			    {
				   client.close();
			    }
			
			});       
		return re;
    }

    bar(req, res, next) {
        this.findProvincial();
    }
}

module.exports = new MyClass();
