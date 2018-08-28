/////Search engine functions create new, update, delete data in mongoDb
MongoClient = require('mongodb').MongoClient;
mongodb = require('mongodb');
config = require('config');

MONGO_URL = (process.env.MESSENGER_APP_SECRET) ?
	process.env.MESSENGER_APP_SECRET :
	config.get('mongoUrl');
DATA_BASE_NAME = (process.env.MESSENGER_APP_SECRET) ?
	process.env.MESSENGER_APP_SECRET :
	config.get('databasename');
SERVER_URL = (process.env.SERVER_URL) ?
	(process.env.SERVER_URL) :
	config.get('serverURL');



var dbQueryCounter = 0;
var maxDbIdleTime = 5000; 
module.exports = {
	getConnection: function (callback) {

		MongoClient.connect(MONGO_URL, function (err, client) { //conn =client;
			//console.log("Create:",client);
			if (err) {
				console.log('Unable to connect to the mongoDB server. Error:', err);
			} else {
				//console.log("Create conn 2:");
				callback(client);
			}
		});

	},
	/// Lấy danh sách tinh thành và thành phố cấp 1
	findSupport: function (query, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('Support');
		// Find some documents
		collection.find(query).toArray(function (err, results) {

			if (err) {

				console.log("err:", err);
			} else {

				callback(results);
			}
		});
	},
	findProvincialTemp: function (query, client, callback) {
		// Get the documents collection
	const db = client.db(DATA_BASE_NAME);
	const collection = db.collection('ProvincialTemp');
		// Find some documents
		collection.find(query).sort({
			"Name": 1
		}).toArray(function (err, results) {
			//    assert.equal(err, null);
			if (err) {
				//callback(results);
				console.log("err:", err);
			} else {
				//console.log("Name " +results[0]._id+ " and Name: " +results[0].Name + " and Type: " +results[0].Type);
				//	  console.log("Name " +results[0]._id+ " and Name: " +results[0].Name + " and Type: " +results[0].Type);
				results = results.sort((a, b) => a.Name.localeCompare(b.Name, 'vn', {
					ignorePunctuation: true
				}));
				callback(results);
			}
		});
	},
	findProvincial: function (query, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		collection = db.collection('Provincial');
		// Find some documents
		collection.find(query).sort({
			"Name": 1
		}).toArray(function (err, results) {
			//    assert.equal(err, null);
			if (err) {
				//callback(results);
				console.log("err:", err);
			} else {
				//console.log("Name " +results[0]._id+ " and Name: " +results[0].Name + " and Type: " +results[0].Type);
				//	  console.log("Name " +results[0]._id+ " and Name: " +results[0].Name + " and Type: " +results[0].Type);
				results = results.sort((a, b) => a.Name.localeCompare(b.Name, 'vn', {
					ignorePunctuation: true
				}));
				callback(results);
			}
		});
	},
	findDistrict: function (query, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		collection = db.collection('District');
		// Find some documents
		collection.find(query).sort({
			"Name": 1
		}).toArray(function (err, results) {
			//    assert.equal(err, null);
			if (err) {
				//callback(results);
				console.log("err:", err);
			} else {
				//console.log("Name " +results[0]._id+ " and Name: " +results[0].Name + " and Type: " +results[0].Type);
				//	  console.log("Name " +results[0]._id+ " and Name: " +results[0].Name + " and Type: " +results[0].Type);
				results = results.sort((a, b) => a.Name.localeCompare(b.Name, 'vn', {
					ignorePunctuation: true
				}));
				callback(results);
			}
		});
	},
	findWards: function (query, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		collection = db.collection('Ward');
		// Find some documents
		collection.find(query).sort({
			"Name": 1
		}).toArray(function (err, results) {
			//    assert.equal(err, null);
			if (err) {
				//callback(results);
				console.log("err:", err);
			} else {
				//console.log("Name " +results[0]._id+ " and Name: " +results[0].Name + " and Type: " +results[0].Type);
				//	  console.log("Name " +results[0]._id+ " and Name: " +results[0].Name + " and Type: " +results[0].Type);
				results = results.sort((a, b) => a.Name.localeCompare(b.Name, 'vn', {
					ignorePunctuation: true
				}));
				callback(results);
			}
		});
	},
	findBranch: function (query, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		collection = db.collection('Branch');
		// Find some documents
		collection.find(query).sort({
			"Name": 1
		}).toArray(function (err, results) {
			//    assert.equal(err, null);
			if (err) {
				//callback(results);
				console.log("Branch err:", err);
			} else {
				//console.log("Name " +results[0]._id+ " and Name: " +results[0].Name + " and Type: " +results[0].Type);
				//	  console.log("Name " +results[0]._id+ " and Name: " +results[0].Name + " and Type: " +results[0].Type);
				results = results.sort((a, b) => a.Name.localeCompare(b.Name, 'vn', {
					ignorePunctuation: true
				}));
				callback(results);
			}
		});
	},
	findPosition: function (query, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		collection = db.collection('Position');
		// Find some documents
		collection.find(query).sort({
			"Level": 1
		}).toArray(function (err, results) {

			if (err) {

				console.log("Position err:", err);
			} else {
				//results = results.sort((a, b) => a.Name.localeCompare(b.Name, 'vn', {ignorePunctuation: true}));
				callback(results);
			}
		});
	},
	findMembersByGroup: function (pipeline, options, client, callback) {

		const db = client.db(DATA_BASE_NAME);
		collection = db.collection('Members');
		collection.aggregate(pipeline, options).toArray(function (err, results) {
			if (err) {
				console.log("err:", err);
				callback(err);
			} else {
				callback(results);
			}
		});
	},
	findMembers: function (query, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		collection = db.collection('Members');
		// Find some documents
        collection.aggregate([
            {
                $lookup:
                    {
                        from: "Document",
                        localField: "_id",
                        foreignField: "psid",
                        as: "list_document"
                    }
            }
        ]).toArray(function (err, results) {
			//    assert.equal(err, null);
			if (err) {
				console.log("err:", err);
				callback(err);
			} else {
				callback(results);
			}
		});
	},
	findKycMembers: function (query, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		collection = db.collection('KycMembers');
		// Find some documents
		collection.find(query).sort({
			"Provincial": 1
		}).toArray(function (err, results) {
			//    assert.equal(err, null);
			if (err) {
				console.log("err:", err);
				callback(err);
			} else {
				callback(results);
			}
		});
	},
	findTopProduct: function (query, top, client, callback) {

		const db = client.db(DATA_BASE_NAME);
		collection = db.collection('Products');
		// Find some documents
		collection.find(query).sort({
			"InsertDate": -1
		}).limit(top).toArray(function (err, results) {
			//    assert.equal(err, null);
			if (err) {
				console.log("err:", err);
				callback(err);
			} else {
				callback(results);
			}
		});
	},
	findProduct: function (query, client, callback) {

		const db = client.db(DATA_BASE_NAME);
		collection = db.collection('Products');
		// Find some documents
		collection.find(query).sort({
			"InsertDate": -1
		}).toArray(function (err, results) {
			//    assert.equal(err, null);
			if (err) {
				console.log("err:", err);
				callback(err);
			} else {
				callback(results);
			}
		});
	},
	findGroupProductByGeoCode: function (client, callback) {

		const db = client.db(DATA_BASE_NAME);
		collection = db.collection('Products');
		// Find some documents
		var options = {};
		var pipeline = [{
			"$group": {
				"_id": {
					"GeoCodeProvincial": "$GeoCodeProvincial"
				},
				"COUNT(_id)": {
					"$sum": 1
				}
			}
		}, {
			"$project": {
				"_id": 0,
				"GeoCodeProvincial": "$_id.GeoCodeProvincial",
				"Total": "$COUNT(_id)"
			}
		}];

		collection.aggregate(pipeline, options).toArray(function (err, results) {
			if (err) {
				console.log("err:", err);
				callback(err);
			} else {
				callback(results);
			}
		});
	},
	findAiMessage: function (query, client, callback) {
		const db = client.db(DATA_BASE_NAME);
		collection = db.collection('AiMessage');
		collection.find(query).sort({
			"_id": 1
		}).toArray(function (err, results) {
			if (err) {
				console.log("findAiMessage err:", err);
				callback(err);
			} else {
				callback(results);
			}
		});
	},
	findMemberOnline: function (query, client, callback) {
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('MembersActive');
		collection.find(query).toArray(function (err, results) {
			if (err) {
				console.log("findMemberOnline err:", err);
				callback(err);
			} else {
				callback(results);
			}
		});
	},

	insertMembers: function (objMember, client, callback) {
		var mydate = new Date();
		var inputDate = new Date(mydate.toISOString());
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
	    const collection = db.collection('Members');
		//var objCallback = null;
		collection.find({
			'_id': objMember._id
		}).toArray(function (err, results) {
			//    assert.equal(err, null);
			if (err) {
				console.log("err:", err);
				//callback(err);
			} else {
				//console.log('Kiểm tra xem tồn tại hay chưa:', results.length);
				if (results.length == 0) {
					// insert documents
					collection.insertOne(objMember, function (err, res) {
						//neu xay ra loi
						if (err) throw err;
						//neu khong co loi			
						//console.log('Them thanh cong :',objMember);
						callback(null, res);
					});

				} else {
					//console.log('Thành viên đã điểm danh');
					var objMemberUpdate = {
						$set: {
							"Name": objMember.Name,
							"Birthday": objMember.Birthday,
                            "Address": objMember.Address,
                            "CMT": objMember.CMT,
							"Phone": objMember.Phone,
							"UpdateDate": inputDate
						}
					};
					collection.updateOne({
						'_id': objMember._id
					}, objMemberUpdate, function (err, res) {
						//neu xay ra loi
						if (err) throw err;
						//neu khong co loi			
						//console.log('Them thanh cong :',objMember);
						console.log("Update:", objMemberUpdate);
						callback(null, res);
					});
					//callback(null, res);
				}
			}
		});
    },
    insertDocument: function (objDocument, client, callback) {
        // Get the documents collection
        const db = client.db(DATA_BASE_NAME);
        const collection = db.collection('Document');
        //var objCallback = null;
        console.log("objDocument :", objDocument);
        collection.insertOne(objDocument, function (err, res) {
            //neu xay ra loi
            if (err) throw err;
            //neu khong co loi			
            callback(null, res);
        });
    },
	insertProduct: function (objProduct, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('Products');
		//var objCallback = null;
		console.log("objProduct :", objProduct);
		collection.insertOne(objProduct, function (err, res) {
			//neu xay ra loi
			if (err) throw err;
			//neu khong co loi			
			//console.log('Them thanh cong :',objMember);
			callback(null, res);
		});
	},
	insertBranch: function (objBracnch, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('Branch');
		//var objCallback = null;
		//console.log("objAiMessage :",objAiMessage);
		collection.insert(objBracnch, function (err, res) {
			//neu xay ra loi
			if (err) throw err;
			//neu khong co loi			
			//console.log('Them thanh cong :',objMember);
			callback(null, res);
		});
	},
	insertAiMessage: function (objAiMessage, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('AiMessage');
		//var objCallback = null;
		//console.log("objAiMessage :",objAiMessage);
		collection.insertOne(objAiMessage, function (err, res) {
			//neu xay ra loi
			if (err) throw err;
			//neu khong co loi			
			//console.log('Them thanh cong :',objMember);
			callback(null, res);
		});
	},
	insertKycMembers: function (objMember, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('KycMembers');
		//var objCallback = null;
		collection.find({
			'Phone': objMember.Phone
		}).toArray(function (err, results) {
			//    assert.equal(err, null);
			if (err) {
				console.log("err:", err);
				//callback(err);
			} else {
				//console.log('Kiểm tra xem tồn tại hay chưa:', results.length);
				if (results.length == 0) {
					// insert documents
					collection.insertOne(objMember, function (err, res) {
						//neu xay ra loi
						if (err) throw err;
						//neu khong co loi			
						//console.log('Them thanh cong :',objMember);
						callback(null, res);
					});

				} else {
					//console.log('Thành viên đã điểm danh');
					var objMemberUpdate = {
						$set: {
							"Name": objMember.Name,
							"Birthday": objMember.Birthday,
							"Provincial": objMember.Provincial,
							"Districts": objMember.Districts,
							"Position": objMember.Position,
							"Wards": objMember.Wards,
							"Email": objMember.Email,
							"Branch": objMember.Branch,
							"Phone": objMember.Phone,
							"BlockStatus": "PENDING",
							"GeoCodeProvincial": objMember.GeoCodeProvincial
						}
					};
					collection.updateOne({
						'Phone': objMember.Phone
					}, objMemberUpdate, function (err, res) {
						//neu xay ra loi
						if (err) throw err;
						//neu khong co loi			
						//console.log('Them thanh cong :',objMember);
						console.log("Update:", objMemberUpdate);
						callback(null, res);
					});
					//callback(null, res);

				}

			}
		});

	},
	insertLogs: function (objLogs, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('LogsMessage');
		//var objCallback = null;
		//console.log("objAiMessage :",objAiMessage);
		collection.insertOne(objLogs, function (err, res) {
			//neu xay ra loi
			if (err) throw err;
			//neu khong co loi			
			//console.log('Them thanh cong :',objMember);
			callback(null, res);
		});
	},
	insertDistrictTemp: function (objDistrict, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('DistrictTemp');
		//var objCallback = null;
		//console.log("objAiMessage :",objAiMessage);
		collection.insert(objDistrict, function (err, res) {
			//neu xay ra loi
			if (err) throw err;
			//neu khong co loi			
			//console.log('Them thanh cong :',objMember);
			callback(null, res);
		});
	},
	insertWardTemp: function (objWard, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('WardTemp');
		//var objCallback = null;
		//console.log("objAiMessage :",objAiMessage);
		collection.insert(objWard, function (err, res) {
			//neu xay ra loi
			if (err) throw err;
			//neu khong co loi			
			//console.log('Them thanh cong :',objMember);
			callback(null, res);
		});
	},
	insertBranchTemp: function (objBracnch, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('BranchTemp');
		//var objCallback = null;
		//console.log("objAiMessage :",objAiMessage);
		collection.insert(objBracnch, function (err, res) {
			//neu xay ra loi
			if (err) throw err;
			//neu khong co loi			
			//console.log('Them thanh cong :',objMember);
			callback(null, res);
		});
	},
	insertMembersTemp: function (objMember, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('MembersTemp');
		//var objCallback = null;
		collection.find({
			'_id': objMember._id
		}).toArray(function (err, results) {
			//    assert.equal(err, null);
			if (err) {
				console.log("err:", err);
				//callback(err);
			} else {
				//console.log('Kiểm tra xem tồn tại hay chưa:', results.length);
				if (results.length == 0) {
					// insert documents
					collection.insertOne(objMember, function (err, res) {
						//neu xay ra loi
						if (err) throw err;
						//neu khong co loi			
						//console.log('Them thanh cong :',objMember);
						callback(null, res);
					});

				} else {
					//console.log('Thành viên đã điểm danh');
					var objMemberUpdate = {
						$set: {
							"Name": objMember.Name,
							"Birthday": objMember.Birthday,
							"Provincial": objMember.Provincial,
							"District": objMember.District,
							"Position": objMember.Position,
							"Ward": objMember.Ward,
							"Branch": objMember.Branch,
							"Phone": objMember.Phone,
							"Email": objMember.Email,
							"ImgUrl": objMember.ImgUrl,
							"LevelName": objMember.LevelName,
							"Level": objMember.Level,
							"Layer": objMember.Layer,
							"Delegate": Number(0),
							"DelegateId": objMember.DelegateId,
							"DelegateName": objMember.DelegateName,
							"DelegateLevelName": objMember.DelegateLevelName,
							"DelegateImgUrl": objMember.DelegateImgUrl,
							"BlockStatus": "PENDING",
							"GeoCodeProvincial": objMember.GeoCodeProvincial
						}
					};
					collection.updateOne({
						'_id': objMember._id
					}, objMemberUpdate, function (err, res) {
						//neu xay ra loi
						if (err) throw err;
						//neu khong co loi			
						//console.log('Them thanh cong :',objMember);
						console.log("Update:", objMemberUpdate);
						callback(null, res);
					});
					//callback(null, res);

				}

			}
		});

	},
	insertMembersActive: function (psid, client, callback) {

		try
		{
			var d = new Date();
			d.setMinutes(d.getMinutes() + 15);
			const db = client.db(DATA_BASE_NAME);
			const collection = db.collection('MembersActive');
			//var objCallback = null;
			collection.find({
				'_id': psid
			}).toArray(function (err, results) {
				if (err) {
					console.log("err:", err);
				} else {

					if (results.length == 0) {

						var objMember = {
							"_id": psid,
							"ExpiredDate": d
						};
						collection.insertOne(objMember, function (err, res) {
							//neu xay ra loi
							if (err) throw err;
							//neu khong co loi
						console.log("Insert MembersActive ExpiredDate:", objMember);
							callback(null, res);
						});

					} else {

						var objUpdate = {
							$set: {
								"ExpiredDate": d
							}
						};
						collection.updateOne({
							'_id': psid
						}, objUpdate, function (err, res) {
							//neu xay ra loi
							if (err) throw err;
							//neu khong co loi			

							console.log("Update MembersActive ExpiredDate:", objUpdate);
							callback(null, res);
						});
					}

				}
			});
	  } catch(err) {
         console.error(err);
		 callback(null, null);
      }
	},

	updateAvatarMemeber: function (psid, url, client, callback) {
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('Members');
		var objMemberUpdate = {
			$set: {
				"ImgUrl": url
			}
		};
		collection.updateOne({
			'_id': psid
		}, objMemberUpdate, function (err, res) {
			//neu xay ra loi
			if (err) throw err;
			//console.log("Update status Kyc Member:", err);
			callback(null, res);
		});
	},
	updateBMemeber: function (psid, date, client, callback) {
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('Members');
		var objMemberUpdate = {
			$set: {
				"Birthday": date
			}
		};
		collection.updateOne({
			'_id': psid
		}, objMemberUpdate, function (err, res) {
			//neu xay ra loi
			if (err) throw err;
			//console.log("Update status Kyc Member:", err);
			callback(null, res);
		});
	},
	updateStatusMembers: function (psid, status, approvedId, approvedName, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('Members');
		var objMemberUpdate = {
			$set: {
				"BlockStatus": status,
				"ApprovedId": approvedId,
				"ApprovedName": approvedName
			}
		};
		collection.updateOne({
			'_id': psid,
			'BlockStatus': 'PENDING'
		}, objMemberUpdate, function (err, res) {
			//neu xay ra loi
			if (err) throw err;
			//console.log("Update status Kyc Member:", err);
			callback(null, res);
		});

	},
	cancelStatusMembers: function (psid, status, approvedId, approvedName, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('Members');
		var objMemberUpdate = {
			$set: {
				"BlockStatus": status,
				"ApprovedId": null,
				"ApprovedName": null
			}
		};
		collection.updateOne({
			'_id': psid,
			'BlockStatus': 'ACTIVE'
		}, objMemberUpdate, function (err, res) {
			//neu xay ra loi
			if (err) throw err;
			//console.log("Update status Kyc Member:", err);
			callback(null, res);
		});

	},
	updateDelegateMembers: function (psid, delegate, delegateId, delegateName, delegateLevelName, delegateImgUrl, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('Members');
		var objMemberUpdate = {
			$set: {

				"Delegate": delegate,
				"DelegateId": delegateId,
				"DelegateName": delegateName,
				"DelegateLevelName": delegateLevelName,
				"DelegateImgUrl": delegateImgUrl

			}
		};
		collection.updateOne({
			'_id': psid,
			'BlockStatus': 'ACTIVE'
		}, objMemberUpdate, function (err, res) {
			//neu xay ra loi
			if (err) throw err;
			//console.log("Update status Kyc Member:", err);
			callback(null, res);
		});

	},
	setAdminMembers: function (psid, status, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('Members');

		var objMemberUpdate = {
			$set: {
				"BlockStatus": status,
				"Level": 0,
				"Layer": 0
			}
		};
		collection.updateOne({
			'_id': psid,
			'BlockStatus': 'PENDING'
		}, objMemberUpdate, function (err, res) {
			//neu xay ra loi
			if (err) throw err;
			//console.log("Update status Kyc Member:", err);
			callback(null, res);
		});

	},
	updateStatusKycMembers: function (phone, status, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('KycMembers');

		var objMemberUpdate = {
			$set: {
				"BlockStatus": status
			}
		};
		collection.updateOne({
			'Phone': phone,
			'BlockStatus': 'PENDING'
		}, objMemberUpdate, function (err, res) {
			//neu xay ra loi
			if (err) throw err;
			//console.log("Update status Kyc Member:", err);
			callback(null, res);
		});

	},
	deleteAiMessage: function (id, client, callback) {
		// Get the documents collection
		//console.log("deleteAiMessage Con:",client)
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('AiMessage');
		//var objCallback = null;
		//console.log("objAiMessage :",objAiMessage);
		var myquery = {
			_id: new mongodb.ObjectID(id)
		};
		collection.deleteOne(myquery, function (err, res) {
			//neu xay ra loi
			if (err) throw err;
			//neu khong co loi			
			//console.log('Them thanh cong :',objMember);
			callback(null, res);
		});
	},
	//Toanva process Users
	findUsers: function (query, client, callback) {
		// Get the Users collection
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('Users');
		// Find some Users
		collection.find(query).sort({
			"_id": 1
		}).toArray(function (err, results) {
			//    assert.equal(err, null);
			if (err) {
				console.log("err:", err);
				callback(err);
			} else {
				callback(results);
			}
		});
	},
	insertUsers: function (objUser, client, callback) {

		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('Users');
		//var objCallback = null;
		collection.find({
			'UserName': objUser.UserName
		}).toArray(function (err, results) {
			if (err) {
				console.log("err:", err);
			} else {
				//console.log('Kiểm tra xem tồn tại hay chưa:', results.length);
				if (results.length == 0) {
					console.log('Them tai khoan :', objUser.UserName);
					// insert Users
					collection.insertOne(objUser, function (err, res) {
						//neu xay ra loi
						if (err) throw err;
						//neu khong co loi			
						console.log('Them thanh cong :', objUser.UserName);
						callback(null, 'SUCCESS');
					});

				} else {
					//đã tồn tại
					//console.log('Tai khoan da ton tai');
					callback('ERROR_EXIST');
				}
			}
		});
	},
	editUsers: function (objUser, client, callback) {
		// Get the Users collection
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('Users');
		collection.find({
			'UserName': objUser.UserName
		}).toArray(function (err, results) {
			if (err) {
				console.log("err:", err);
			} else {
				//console.log('Kiểm tra xem tồn tại hay chưa:', results.length);
				if (results.length > 0) {
					console.log('Update user:', objUser.UserName);
					// edit Users
					var objUserUpdate = {
						$set: {
							"UserName": objUser.UserName,
							"FullName": objUser.FullName,
							"Status": objUser.Status
						}
					};
					if (objUser.Password.length > 0) {
						objUserUpdate = {
							$set: {
								"Password": objUser.Password,
							}
						}
						console.log('Reset password');
					}
					collection.updateOne({
						'_id': results[0]._id
					}, objUserUpdate, function (err, res) {
						//neu xay ra loi
						if (err) throw err;
						//neu khong co loi			
						console.log("Update success");
						callback(null, res);
					});
				} else {
					//đã tồn tại
					console.log('Update fail. User not found');
					callback('Tài khoản không tồn tại');
				}
			}
		});
	},
	deleteUser: function (UserName, client, callback) {
		// Get the documents collection
		const db = client.db(DATA_BASE_NAME);
		const collection = db.collection('Users');
		var myquery = {
			UserName: UserName
		};
		collection.deleteOne(myquery, function (err, res) {
			//neu xay ra loi
			if (err) throw err;
			//neu khong co loi			
			callback(null, res);
		});
	},
	// Toanva process User - End

}
