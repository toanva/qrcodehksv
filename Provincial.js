const  MongoClient = require('mongodb').MongoClient;
var databaseName='heroku_g41d98gw';
var urlmg='mongodb://nsvn:nsvn6688@ds251849.mlab.com:51849/'+databaseName;
 var re;
module.exports  = 
{ 
 findProvincial : function() {  
       
		 
			MongoClient.connect(urlmg, function(err, client) 
			{	
				//console.log("client:",client.db);
				//console.log("client 2:",client.db(databaseName));
				if (err) 
				{
				  re ='Unable to connect to the mongoDB server. Error:'+ err;
				}else
				{
					 var db = client.db(databaseName);
					 db.collection('Provincial').find({}).toArray(
					 function(err, results)
					 {
						if(err)
						{						
						  if(client)
							{
							   client.close();
							}
						}else
						{						  
						   
						    re ="Code " +results[0]._id+ " and Name: " +results[0].Name + " and Type: " +results[0].Type;
							console.log(re);
							if(client)
							{
							   client.close();
							}
							return re;					
						}
					 });
				   
				}
			    
			
			});       
		 re;
  },
  getConnection : function() 
  {  
     var conn=null;
     MongoClient.connect(urlmg, function(err, client) 
	 {          conn =client;
				console.log("Create:",client);
				if (err) 
				{
				  console.log('Unable to connect to the mongoDB server. Error:', err);				  
				}else
				{
				 console.log("Create conn 2:",conn);
				
				}				
			});
	console.log("return conn:",conn);
	return conn;
   },
closeConnection : function(client) 
   {  
		 if(client)
		 {
			client.close();
		 }
   },
 SayHello : function(client) 
   {  
         //this._client=client;
		 return  client;
   }
   
   
};
// = methods;
