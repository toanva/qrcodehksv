const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const config = require('config');
var FormData = require('form-data');
const multer  = require('multer'); 
var formidable = require('formidable');
const upload  = multer({  storage: multer.memoryStorage(), limits: { fieldSize: 1 * 1000 * 1000 } });

var router = express.Router();
// App Secret can be retrieved from the App Dashboard
const MONGO_URL = (process.env.MESSENGER_APP_SECRET) ?
	process.env.MESSENGER_APP_SECRET :
	config.get('mongoUrl');	
const DATA_BASE_NAME = (process.env.MESSENGER_APP_SECRET) ?
	process.env.MESSENGER_APP_SECRET :
	config.get('databasename');	
// App Secret can be retrieved from the App Dashboard
const APP_SECRET = (process.env.MESSENGER_APP_SECRET) ?
	process.env.MESSENGER_APP_SECRET :
	config.get('appSecret');
// Arbitrary value used to validate a webhook
const VALIDATION_TOKEN = (process.env.MESSENGER_VALIDATION_TOKEN) ?
	(process.env.MESSENGER_VALIDATION_TOKEN) :
	config.get('validationToken');
// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
	(process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
	config.get('pageAccessToken');
const SERVER_URL = (process.env.SERVER_URL) ?
	(process.env.SERVER_URL) :
	config.get('serverURL');
const IMAGE_CLOUD_NAME = (process.env.SERVER_URL) ?
	(process.env.SERVER_URL) :
	config.get('image_cloud_name');
const IMAGE_API_KEY = (process.env.SERVER_URL) ?
	(process.env.SERVER_URL) :
	config.get('image_api_key');
const IMAGE_API_SECRET = (process.env.SERVER_URL) ?
	(process.env.SERVER_URL) :
	config.get('image_api_secret');
if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN && SERVER_URL)) {
	console.error("Missing config values");
	process.exit(1);
}


server.get('/setup', (req, res) => {
   
	
	setupGetStartedButton(res);
	//setupPersistentMenu(res);
	setupGreetingText(res);


});
server.post('/', function (req, res) {



});
server.post('/login.bot', function (req, res) {
	let body = req.body;
	console.log("login.bot:",body);
	if (!body.UserName || !body.Password) {
		console.log("login failed");
		res.send('Mật khẩu hoạc tài khoản không đúng.!');    
	  } else if(body.UserName == "test" && body.Password == "12345") {
		req.session.user = body.UserName;
		req.session.admin = true;
		req.session.faceUser = true;
		console.log("login success");
		res.send("true");
		//res.writeHead(30, {'Location': '/be/index.html'});
		//res.end();
		//res.redirect(301,'/be/index.html');
	  }else if(body.UserName == "ksv" && body.Password == "ksvnosa") {
		req.session.user = body.UserName;
		req.session.ksv = true;	
		res.send("true");
		//res.writeHead(30, {'Location': '/be/index.html'});
		//res.end();
		//res.redirect(301,'/be/index.html');
	  } else
		  {
			 console.log("login failed");
			 res.send('Mật khẩu hoạc tài khoản không đúng.!');     
		  }
});
server.get('/logout.bot', function (req, res) {
  req.session.destroy();
  res.send("logout success!");
});
server.get('/getGroupProduct', authFace,(req, res) => {
	res.setHeader('X-Frame-Options', 'ALLOW-FROM '+SERVER_URL);
	console.log("getGroupProduct");
	getConnection(function (client) {
		findGroupProductByGeoCode(client, function (results) {
			client.close();
			res.send(results);
			
		});
	});
});
server.get('/getTopProduct', authFace,(req, res) => {
	res.setHeader('X-Frame-Options', 'ALLOW-FROM '+SERVER_URL);
	var top = req.query.Top;	
	var query = {};
	if(top==undefined)
		top=10;
	//console.log("Top Product query", query);
	getConnection(function (client) {
		findTopProduct(query,Number(top), client, function (results) {
			client.close();
			res.send(results);
			
		});
	});
});
server.get('/getProduct', authFace,(req, res) => {
	res.setHeader('X-Frame-Options', 'ALLOW-FROM '+SERVER_URL);
	var name = req.query.name;
	var provincial = req.query.provincial;
	var districts = req.query.districts;
	var wards = req.query.wards;
	var position = req.query.position;
	//var reqQuery=  req.query.strQuery
	var query = {};
	if (name != "") {
		//{ "Name": {'$regex': '.*nam.*'}}
		name = ".*" + name + ".*";
		Object.assign(query, {
			Name: {
				$regex: name
			}
		});
	}
	if (provincial != "") {
		Object.assign(query, {
			Provincial: provincial
		});
	}
//	if (districts != "") {
//		Object.assign(query, {
//			District: districts
//		});
//	}
//	if (wards != "") {
//		Object.assign(query, {
//			Ward: wards
//		});
//	}
//	if (position != "") {
//		Object.assign(query, {
//			Position: position
//		});
//	}
	console.log("Product query", query);
	getConnection(function (client) {
		findProduct(query, client, function (results) {
			client.close();
			res.send(results);
			
		});
	});
});
server.get('/getProvincial', (req, res) => {
	var query={};
	getConnection(function (client) {
		findProvincial(query,client, function (results) {
			client.close();
			res.send(results);
			
		});
	});
});
server.get('/getDistrict', (req, res) => {
	var query
	if (req.query.idProvincial == 'ALL') {
		query = {};

	} else {
		query = {
			"IdProvince": req.query.idProvincial
		};
	}
	getConnection(function (client) {
		findDistrict(query, client, function (results) {
			client.close();
			res.send(results);
			
		});
	});
	//res.send(req.query.idProvincial);
});
server.get('/getWards', (req, res) => {

	var query;
	if (req.query.idDistrict == 'ALL') {
		query = {};

	} else {
		query = {
			"IdDistrict": req.query.idDistrict
		};
	}
	getConnection(function (client) {
		findWards(query, client, function (results) {
			console.log("getWards");
			client.close();
			res.send(results);
			
		});
	});
	//res.send(req.query.idProvincial);
});
server.get('/getBranch', (req, res) => {


	var query;
	if (req.query.idWards == 'ALL') {
		query = {};

	} else {
		query = {
			"IdWards": req.query.idWards
		};
	}
	console.log("getBranch query:",query);
	getConnection(function (client) {
		findBranch(query, client, function (results) {
			console.log("getBranch");
			client.close();
			res.send(results);
			
		});
	});
	//res.send(req.query.idProvincial);
});
server.get('/ipg.bot', (req, res, next) => {
	let referer = req.get('Referer');
	//console.log("register.bot 0",referer);
	if (referer) {
		if (referer.indexOf('www.messenger.com') >= 0) {
			console.log("register.bot 1", referer);
			res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.messenger.com/');
		} else if (referer.indexOf('www.facebook.com') >= 0) {
			console.log("register.bot 2", referer);
			res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.facebook.com/');
		} else if (referer.indexOf('staticxx.facebook.com') >= 0) {
			console.log("register.bot 3", referer);
			res.setHeader('X-Frame-Options', 'ALLOW-FROM https://staticxx.facebook.com');
		}
		//res.render('register');
		req.session.faceUser = true;
		res.sendFile('views/ipg.html', {
			root: __dirname
		});
	}
});
server.get('/iproducts.bot', (req, res, next) => {
	let referer = req.get('Referer');
	//console.log("register.bot 0",referer);
	if (referer) {
		if (referer.indexOf('www.messenger.com') >= 0) {
			console.log("register.bot 1", referer);
			res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.messenger.com/');
		} else if (referer.indexOf('www.facebook.com') >= 0) {
			console.log("register.bot 2", referer);
			res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.facebook.com/');
		} else if (referer.indexOf('staticxx.facebook.com') >= 0) {
			console.log("register.bot 3", referer);
			res.setHeader('X-Frame-Options', 'ALLOW-FROM https://staticxx.facebook.com');
		}
		//res.render('register');
		req.session.faceUser = true;
		res.sendFile('views/iproducts.html', {
			root: __dirname
		});
	}
});
server.get('/iproductspostback.bot', authFace,(req, res) => {
	//res.setHeader('Content-Type', 'application/json');
	let body = req.query;
	var mydate = new Date();
	var inputDate = new Date(mydate.toISOString());
	var imgName=body.psid+inputDate;
    req.session.psid = body.psid;
	
	
	
	//console.log("body : ",body);	
	res.status(200).send('Please close this window to return to the conversation thread.');
	console.log(body.cboProvincial);
	var returnMessage = "Cảm ơn bạn đã cung cấp thông tin. Nosa kiểm tra lại nhé: sản phẩm tên là " + body.txtName + ", sản lượng dữ kiến : " + body.txtQuantity +" , giá bán dự kiến : " + body.txtPrice +  " , số diện tích canh tác : " + body.txtAcreage + ", hợp tác xã " + body.cboIsCooperative + ". Chuẩn chưa nhỉ?";
	console.log(returnMessage);
	
//	    findMembers(query, client, function (results) {
//			res.send(results);
//			client.close();
//		});
		//console.log("Date", inputDate);
		var query = {_id : body.psid};
	    var provincial ="NA";
	    var district ="NA";
	    var Ward ="NA";
	    var postName=" ";
		getConnection(function (client) {
			findMembers(query, client, function (results) { 
				if(results.length==1)
				{
					provincial =results[0].Provincial;
					district  =results[0].District;
					ward  =results[0].Ward;
					postName  =results[0].Name;
				}
				var objProduct = {
				"IdPost": body.psid,		
				"Name": body.txtName,
				"Quantity": body.txtQuantity,
				"Price": body.txtPrice,
				"Acreage": body.txtAcreage,
				"Cooperative": body.cboIsCooperative,
				"ImageData": imgName,
				"InsertDate": inputDate,
				"Provincial": provincial,
				"District": district,
				"Ward": ward ,
				"PostName":postName 
				};
				insertProduct(objProduct, client, function (err, results) {
					//	   res.send(results);
					//console.log(results);
					if (err) {
						sendTextMessage(body.psid, 'Echo:' + err);
					} else {
						console.log("insertProduct:",results.ops[0]._id);
						sendBackProduct(body.psid, returnMessage);
					}
					client.close();
				});

		 });
		});

});
server.post('/iproductspostback.bot', upload.single('somefile'), authFace,(req, res) => {
	// console.log("start");
     //console.log(__dirname);
    // Prints: /Users/mjr
    //console.log(path.dirname(__filename)); 
	//const testFolder = './public/uploads/';
	//fs.readdirSync(testFolder).forEach(file => {
	//  console.log(file);
	///});
	let body = req.body;
	
	var mydate = new Date();
	var inputDate = new Date(mydate.toISOString());
	var imgName=body.psid+mydate.getFullYear()+mydate.getMonth()+mydate.getDate()+mydate.getHours()+mydate.getMinutes()+mydate.getSeconds()+body.ImgName;
	var dir = "./public/uploads";	

	res.status(200).send('Please close this window to return to the conversation thread.');
	//console.log(body.cboProvincial);
	var returnMessage ;
	//console.log(returnMessage);
	var imgUrl=imgName;
	writeFileProduct(imgName,body.DataImg,dir,body.psid,function (err, results) {
				//	   res.send(results);
				//console.log(results);
				if (results) {
					//console.log("Cloudinary :",results);
					imgUrl=results.secure_url;
					var query = {_id : body.psid};
					var provincial ="NA";
					var district ="NA";
					var Ward ="NA";
					var postName=" ";
					var geoCodeProvincial="NA";
					getConnection(function (client) {
						findMembers(query, client, function (results) { 
							if(results.length==1)
							{
								provincial =results[0].Provincial;
								district  =results[0].District;
								ward  =results[0].Ward;
								postName  =results[0].Name;
								geoCodeProvincial =results[0].GeoCodeProvincial;
							};
							returnMessage = " Sản phẩm tên là " + body.Name + ", sản lượng dữ kiến : " + body.Quantity +" "+body.QuantityUnit+" , giá bán dự kiến : " + body.Price +" "+body.PriceUnit+"  , số diện tích canh tác : " + body.Acreage +" "+body.AcreageUnit+ " và thời vụ từ tháng "+body.ToMonth +" đến tháng "+body.FromMonth+", hợp tác xã " + body.IsCooperative + ", thông tin thêm về sản phẩm: "+body.Description+" . Chuẩn chưa nhỉ?";
							var objProduct = {
							"IdPost": body.psid,
							"Type": body.Type,	
							"Name": body.Name,
							"Quantity": body.Quantity,
							"QuantityUnit": body.QuantityUnit,
							"Price": body.Price,
							"PriceUnit": body.PriceUnit,
							"Acreage": body.Acreage,
							"AcreageUnit": body.AcreageUnit,
							"Cooperative": body.IsCooperative,
							"ToMonth": body.ToMonth,
							"FromMonth": body.FromMonth,
							"ImageData": imgName,
							"ImgUrl": imgUrl,
							"InsertDate": inputDate,
							"Provincial": provincial,
							"District": district,
							"Ward": ward ,
							"PostName":postName,
							"Description":body.Description,
							"GeoCodeProvincial":geoCodeProvincial 
							};
							insertProduct(objProduct, client, function (err, results) {
								//	   res.send(results);
								//console.log(results);
								if (err) {
									sendTextMessage(body.psid, 'Echo:' + err);
								} else {
									console.log("insertProduct : ",returnMessage);
									
									sendTextMessage(body.psid,"Cảm ơn "+postName+" đã cung cấp thông tin. Nosa kiểm tra lại nhé : Ảnh của sản phẩm ");
									sendUrlMessage(body.psid,"image",imgUrl,function(error, response, bd){
									   if (error) throw error;
									   console.log("sendUrlMessage:");								   sendOneQuick(body.psid,returnMessage,"Chuẩn","cfp","OkLike.png");	
									  // sendBackProduct(body.psid, returnMessage);
									});
								}
								client.close();
							});

					 	});
					});
			} 
	});	
});
server.get('/register.bot', (req, res, next) => {
	let referer = req.get('Referer');
	//console.log("register.bot 0",referer);
	if (referer) {
		if (referer.indexOf('www.messenger.com') >= 0) {
			console.log("register.bot 1", referer);
			res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.messenger.com/');
		} else if (referer.indexOf('www.facebook.com') >= 0) {
			console.log("register.bot 2", referer);
			res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.facebook.com/');
		} else if (referer.indexOf('staticxx.facebook.com') >= 0) {
			console.log("register.bot 3", referer);
			res.setHeader('X-Frame-Options', 'ALLOW-FROM https://staticxx.facebook.com');
		}
		req.session.faceUser = true;		
		//res.render('register');
		res.sendFile('views/register.html', {
			root: __dirname
		});
	}
});
server.get('/rgg.bot', (req, res, next) => {
	let referer = req.get('Referer');
	//console.log("register.bot 0",referer);
	if (referer) {
		if (referer.indexOf('www.messenger.com') >= 0) {
			console.log("register.bot 1", referer);
			res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.messenger.com/');
		} else if (referer.indexOf('www.facebook.com') >= 0) {
			console.log("register.bot 2", referer);
			res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.facebook.com/');
		} else if (referer.indexOf('staticxx.facebook.com') >= 0) {
			console.log("register.bot 3", referer);
			res.setHeader('X-Frame-Options', 'ALLOW-FROM https://staticxx.facebook.com');
		}
		req.session.faceUser = true;		
		//res.render('register');
		res.sendFile('views/rgg.html', {
			root: __dirname
		});
	}
});
server.post('/registerspostback.bot', upload.single('somefile'), authFace,(req, res) => {
	//let body = req.query;
	let body = req.body;
	var dir = "./public/uploads/Avatar";
//	console.log("Test:",req.files.path);
	//console.log("body : ",body);
	var dateBrithDay= new Date(body.Birthday);
	console.log("body : ",dateBrithDay);
	imgName=body.psid+body.ImgName;
	
	//res.status(200).send('Please close this window to return to the conversation thread.');
	//console.log(body.cboProvincial);
	if(body.Level=='1')	
	{
			body.Provincial='Hà Nội';
			body.Districts='Hoàn Kiếm';
			body.Wards='Trần Hưng Đạo';
			body.Branch="NA";

	};
	var level=9999;
//	if(body.Position=='CB TƯ Hội LHTN Việt Nam' || body.Position=='CB TƯ Đoàn TNCS HCM')	
//	{
//			level=1;
//
//	}else if(body.Position=='TV Ban thư ký HLHTN Tỉnh' || body.Position=='TV Ban CM Tỉnh/Thành Đoàn' || body.Position=='CB khác thuộc Tỉnh/Thành Đoàn')	
//	{
//			level=2;
//		
//	}else if(body.Position=='BT Quận/Huyện Đoàn' || body.Position=='CTH LHTN Quận/Huyện' || body.Position=='PCTH LHTN Quận/Huyện' || body.Position=='Ủy viên HLHTN Quận/Huyện')
//	{
//			level=3;
//		
//	}else if(body.Position=='PBT Đoàn Xã/Phường/Thị Trấn' || body.Position=='CTH LHTN Xã/Phường/Thị Trấn' || body.Position=='PCTH LHTN Xã/Phường/Thị Trấn')
//	{
//			level=4;
//	}else		
//	{
//			level=5;
//	}
	console.log("registerspostback PSID", body.psid);
	var returnMessage = "Bạn tên là " + body.Name + ", sinh ngày : " + dateBrithDay.getDate() + "/" +(dateBrithDay.getMonth()+1) + "/" + dateBrithDay.getFullYear() + " . là cán bộ "+body.LevelName +" đang giữ chức vụ " + body.Position + ", địa chỉ : chi hội "+body.Branch +", " + body.Wards + " , quận / huyện " + body.Districts + ", Tỉnh / TP " + body.Provincial + " . Số điện thoại của bạn là : " + body.Phone + ", Email "+body.Email + ". Chuẩn chưa nhỉ?";
	console.log(returnMessage);
	//var mydate = new Date(parseInt(body.Year), parseInt(body.Month) - 1, parseInt(body.Day));
	var imgUrl= imgName;
	req.session.psid = body.psid;
	writeFile(imgName,body.DataImgAvatar,dir,body.psid,function (err, results) {
			//	   res.send(results);
			//console.log(results);
			if (results) {
				imgUrl=results.secure_url;
				var objMember = {
				"_id": body.psid,
				"Name": body.Name,
				"Birthday": body.Birthday,
				"Position": body.Position,
				"Provincial": body.Provincial,
				"District": body.Districts,		
				"Ward": body.Wards,
				"Branch": body.Branch,
				"Phone": body.Phone,
				"Email": body.Email,
				"ImgUrl": imgUrl,
				"LevelName": body.LevelName,
				"Level": Number(body.Level),
				"Layer": Number(body.Layer),
				"BlockStatus": "PENDING"
			};
			if(objMember.Provincial==undefined)
				objMember.Provincial='NA';
			if(objMember.District==undefined)
				objMember.District='NA';
			if(objMember.Ward==undefined)
				objMember.Ward='NA';
			if(objMember.Branch==undefined)
				objMember.Branch='NA';
			
			var query = {
				"Name": objMember.Provincial
			};
			getConnection(function (client) {
				findProvincial(query,client, function (results) {			
					if(results.length==1)
					{
						objMember.GeoCodeProvincial =results[0].GeoCode;
					}
					else
					{
						objMember.GeoCodeProvincial='VN-HN';
					}
					insertMembers(objMember, client, function (err, results) {
						//	   res.send(results);
						//console.log(results);
						if (err) {
							client.close();
							sendTextMessage(body.psid, 'Echo:' + err);
						} else {

							console.log("registerspostback: ",objMember);
							//writeFile(imgName,body.DataImgAvatar,dir,body.psid);
							sendTextMessage(body.psid,"Cảm ơn bạn đã cung cấp thông tin. Nosa kiểm tra lại nhé. Dưới đây là ảnh đại diện của bạn :");
							sendUrlMessage(body.psid,"image",imgUrl,function(error, response, bd){
							   if (error) throw error;
							   console.log("sendUrlMessage:");
							   sendBackRegister(body.psid, returnMessage);
							
							});
							
							client.close();
							res.send(objMember);
						}

					//// enc insert member
					});
				////  end  findProvincial
				 });
			/// end con
			});
		} 
	});
	//var inputDate = new Date(mydate.toISOString());
	

});
server.get('/registerspostback.bot', authFace,(req, res) => {
	let body = req.query;

	//console.log("body : ",body);
	//var dateBrithDay= body.txtBrithDay;
	res.status(200).send('Please close this window to return to the conversation thread.');
	var level=9999;
	if(body.cboPosition=='CB TƯ Hội LHTN Việt Nam' || body.cboPosition=='CB TƯ Đoàn TNCS HCM')	
	{
		level=1;

	}else if(body.cboPosition=='TV Ban thư ký HLHTN Tỉnh' || body.cboPosition=='TV Ban CM Tỉnh/Thành Đoàn' || body.cboPosition=='CB khác thuộc Tỉnh/Thành Đoàn')	
	{
		level=2;
		
	}else if(body.cboPosition=='BT Quận/Huyện Đoàn' || body.cboPosition=='CTH LHTN Quận/Huyện' || body.cboPosition=='PCTH LHTN Quận/Huyện' || body.cboPosition=='Ủy viên HLHTN Quận/Huyện')
	{
			level=3;
		
	}else if(body.cboPosition=='PBT Đoàn Xã/Phường/Thị Trấn' || body.cboPosition=='CTH LHTN Xã/Phường/Thị Trấn' || body.cboPosition=='PCTH LHTN Xã/Phường/Thị Trấn')
	{
			level=4;
	}else		
	{
			level=5;
	}
	
	
	
	
	var returnMessage = "Cảm ơn bạn đã cung cấp thông tin. Nosa kiểm tra lại nhé: Bạn tên là " + body.txtFullName + ", sinh ngày : " + body.txtDay + "/" + body.txtMonth + "/" + body.txtYear + " . Hiện bạn đang giữ chức vụ " + body.cboPosition + ", địa chỉ : " + body.txtWards + " , quận / huyện " + body.txtDistricts + ", Tỉnh / TP " + body.txtProvincial + " . Số điện thoại của bạn là : " + body.txtPhone + " Chuẩn chưa nhỉ?";
	//console.log(returnMessage);
	var mydate = new Date(parseInt(body.txtYear), parseInt(body.txtMonth) - 1, parseInt(body.txtDay));
	//console.log("Date", mydate);
	req.session.psid = body.psid;
	var inputDate = new Date(mydate.toISOString());
	var objMember = {
		"_id": body.psid,
		"Name": body.txtFullName,
		"Birthday": inputDate,
		"Provincial": body.txtProvincial,
		"District": body.txtDistricts,
		"Position": body.cboPosition,
		"Ward": body.txtWards,
		"Phone": body.txtPhone,
		"BlockStatus": "Active"
	};
	if(objMember.District==undefined)
		objMember.District='NA';
	if(objMember.Ward==undefined)
		objMember.Ward='NA';
	var query = {
		"Name": objMember.Provincial
	};
	getConnection(function (client) {
		findProvincial(query,client, function (results) {			
			if(results.length==1)
			{
				objMember.GeoCodeProvincial =results[0].GeoCode;
			}
			else
			{
				objMember.GeoCodeProvincial='NA';
			}
			insertMembers(objMember, client, function (err, results) {
				//	   res.send(results);
				//console.log(results);
				if (err) {
					sendTextMessage(body.psid, 'Echo:' + err);
				} else {

					sendBackRegister(body.psid, returnMessage);
				}
				client.close();
			//// enc insert member
			});
		////  end  findProvincial
		 });
	/// end con
	});

});
server.get('/botksv.bot', (req, res, next) => {
	let referer = req.get('Referer');
	//console.log("register.bot 0",referer);
	if (referer) {
		if (referer.indexOf('www.messenger.com') >= 0) {
			console.log("register.bot 1", referer);
			res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.messenger.com/');
		} else if (referer.indexOf('www.facebook.com') >= 0) {
			console.log("register.bot 2", referer);
			res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.facebook.com/');
		} else if (referer.indexOf('staticxx.facebook.com') >= 0) {
			console.log("register.bot 3", referer);
			res.setHeader('X-Frame-Options', 'ALLOW-FROM https://staticxx.facebook.com');
		}
		req.session.faceUser = true;		
		//res.render('register');
		res.sendFile('views/botksv.html', {
			root: __dirname
		});
	}
});
server.get('/ksv.bot', (req, res, next) => {
	res.sendFile('views/ksv.html', {
			root: __dirname
		});
});
server.get('/ksvd.bot', (req, res, next) => {
	res.sendFile('views/ksvd.html', {
			root: __dirname
		});
});
server.get('/rg.bot', (req, res, next) => {
	res.sendFile('views/rg.html', {
			root: __dirname
		});
});
server.post('/rgpostback.bot', upload.single('somefile'), (req, res) => {
	
	let body = req.body;
	var returnMessage = "Cảm ơn bạn đã cung cấp thông tin. Nosa kiểm tra lại nhé: Bạn tên là " + body.Name + ", sinh ngày : " + body.Birthday  +" . Hiện bạn đang giữ chức vụ " + body.Position + ", địa chỉ : " + body.Wards + " , quận / huyện " + body.Districts + ", Tỉnh / TP " + body.Provincial + " các chi hội :"+body.Branch+". Số điện thoại của bạn là : " + body.Phone + " Chuẩn chưa nhỉ?";
	console.log(returnMessage);
	//var mydate = new Date(parseInt(body.txtYear), parseInt(body.txtMonth) - 1, parseInt(body.txtDay));
	//console.log("Date", mydate);
	//req.session.psid = body.psid;
//	var inputDate = new Date(mydate.toISOString());
	if(body.Name!=undefined)
	{
		
		var objBranch;
		if(body.Branch!=undefined && body.Branch!='NA' && body.Branch!='')
		{
			var arr =body.Branch.split(',');
			objBranch=arr;
			console.log(arr);
			//var objBranch[arr.length];
			for (var  i=0; i<arr.length; i++)
			{   obj={
					"IdWards":body.IdWards,
					 "Name":arr[i].toString()
				};
				objBranch[i]=obj;
			}
		}else
		{
			objBranch=undefined;
		};
		
		if(body.Position!='CTH LHTN xã')
			objBranch="NA";
		if(body.Position=='CTH LHTN Tỉnh')
		{
			objBranch=undefined;
			body.Districts='NA';
			body.Wards='NA';
		};
		if(body.Position=='CTH LHTN huyện')
		{
			objBranch=undefined;			
			body.Wards='NA';
		};
			
		var objMember = {		
			"Name": body.Name,
			"Birthday": body.Birthday,
			"Position": body.Position,
			"Provincial": body.Provincial,
			"Districts": body.Districts,		
			"Wards": body.Wards,
			"Branch": objBranch,
			"Phone": body.Phone,
			"Email": body.Email,
			"BlockStatus": "PENDING"
		};
		console.log("objMember:",objMember);
		var query = {
			"Name": objMember.Provincial
		};
		getConnection(function (client) {
			findProvincial(query,client, function (results) {			
				if(results.length==1)
				{
					objMember.GeoCodeProvincial =results[0].GeoCode;
				}
				else
				{
					objMember.GeoCodeProvincial='NA';
				}
					insertKycMembers(objMember, client, function (err, results) {
					//	   res.send(results);
					//console.log(results);
					if (err) {
						//sendTextMessage(body.psid, 'Echo:' + err);
						client.close();
						res.send(err);
					} else {
						
						if(objBranch && objBranch!=undefined && objBranch!="NA")
						{
							insertBranch(objBranch, client,function (err, results) {
							if (err) {
							//sendTextMessage(body.psid, 'Echo:' + err);
								client.close();
								res.send(err);
							}else {
								client.close();
								res.send(returnMessage);
							   }
							});
						}else
						{
							client.close();
							res.send(returnMessage);
						}
						///sendBackRegister(body.psid, returnMessage);
					}
					client.close();
				//// enc insert member
				});
			////  end  findProvincial
			 });
		/// end con
		});
	}
});
server.post('/updateStatusKycMember.bot', authKsv,(req, res) => {
	
	  	let body = req.body;
		var returnMessage ="";
		console.log(body.BlockStatus);
		if(body.BlockStatus=='ACTIVE')
			returnMessage = "Bạn đã duyệt thành công hội viên có số ĐT: "+body.Phone;
	    else
			returnMessage = "Bạn đã từ chối phê duyệt thành công hội viên có số ĐT: "+body.Phone;
	
		
		
		getConnection(function (client) {
			updateStatusKycMembers(body.Phone,body.BlockStatus,client, function (err,results) {			
				
				if (err) {
				//sendTextMessage(body.psid, 'Echo:' + err);
					console.log("updateStatusKycMember ERR:",err);
					client.close();
					res.send(err);
				}else {
					console.log("updateStatusKycMember:",returnMessage);
					client.close();
					res.send(returnMessage);
				   }
			
			////  end  findProvincial
			 });			
			
		/// end con
		});
	
});
server.post('/updateStatusMember.bot', authFace,(req, res) => {
	
	  	let body = req.body;
		var returnMessage ="";
		console.log(body.BlockStatus);
		if(body.BlockStatus=='ACTIVE')
			returnMessage = "Bạn đã duyệt thành công hội viên có số ĐT: "+body.Phone;
	    else
			returnMessage = "Bạn đã từ chối phê duyệt thành công hội viên có số ĐT: "+body.Phone;
	
		
		
		getConnection(function (client) {
			updateStatusMembers(body.psid,body.BlockStatus,client, function (err,results) {			
				
				if (err) {
				//sendTextMessage(body.psid, 'Echo:' + err);
					console.log("updateStatusMember ERR:",err);
					client.close();
					res.send(err);
				}else {
					console.log("updateStatusMember:",returnMessage);
					if(body.BlockStatus=='ACTIVE')
					{
						msg= "Chúc mừng "+body.Name+" đã được xác thực tài khoản, ngay từ bây giờ bạn đã có thể sử dụng tính năng KSV rồi đấy. Bạn có muốn sử dụng tính năng KSV ngay không ?";
						quickReplies=[{
									content_type: "text",
									title: "Có",
									payload: "ksvyes",
									image_url: SERVER_URL+"/img/OkLike.png"
								}];
						sendQuickMessage(body.psid,msg,quickReplies);
						client.close();
						res.send(returnMessage);					
					}
					else
						{
						msg = body.Name+" không được xác thực tài khoản, bạn vui lòng liên hệ cán bộ hội cấp trên để biết thêm chi tiết nhé. Bạn có muốn tiếp tục nói chuyện với Nosa không ?";				
						quickReplies=[{
									content_type: "text",
									title: "Có",
									payload: "confirm",
									image_url: SERVER_URL+"/img/OkLike.png"
								}];
						sendQuickMessage(body.psid,msg,quickReplies);		
						client.close();
						res.send(returnMessage);
					}
				  }
			
			////  end  findProvincial
			 });			
			
		/// end con
		});
	
});
///Lấy thông tin ID từ điểm danh về và tạo webView điểm danh
server.get('/checkin.bot', (req, res) => {

	var fromId = req.param('fromid');
	var data = req.param('data');
	//var geo = req.param('geo'); 
	console.log("Get Id From : ", fromId);
	res.render('index');
	//res.send('Get Id From : '+ fromId + " = "+ data);
});

server.get('/closeForm', (req, res) => {

	var psid = req.query.psid;
	//var name = req.query.Name;
	var msg = "Bạn có muốn tiếp tục nói chuyện với Nosa không ?";
	quickReplies=[{
						content_type: "text",
						title: "Có chứ",
						payload: "confirm",
						image_url: SERVER_URL+"/img/OkLike.png"
					}];
	sendQuickMessage(psid,msg,quickReplies);
	res.send("Is Close");
	//res.send('Get Id From : '+ fromId + " = "+ data);
});

server.get('/webhook', function (req, res) {
	console.log("get facebook")
	if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === VALIDATION_TOKEN) {
		console.log("Validating webhook facebook : ", req.query['first_name']);
		res.status(200).send(req.query['hub.challenge']);
	} else {
		console.log("Không xác nhận. Đảm bảo rằng token hợp lệ phù hợp.");
		res.sendStatus(403);
	}
});
server.post('/webhook', (req, res) => {
	var data = req.body;
	console.log("Res Post facebook");

	// Checks this is an event from a page subscription
	if (data.object === 'page') {

		// Iterates over each entry - there may be multiple if batched
		data.entry.forEach(function (pageEntry) {
			var pageID = pageEntry.id;
			var timeOfEvent = pageEntry.time;
			if (pageEntry.messaging) {
				pageEntry.messaging.forEach(function (messagingEvent) {

					//console.log("face event", messagingEvent.postback.payload);
					if (messagingEvent.message) {
						//console.log("Res Post facebook 1");
						receivedMessage(messagingEvent);


					} else if (messagingEvent.delivery) {
						console.log("Res Post delivery");
						////receivedDeliveryConfirmation(messagingEvent);
					} else if (messagingEvent.postback && messagingEvent.postback.payload == 'getstarted') {
						//present user with some greeting or call to action

						callGetProfile(messagingEvent.sender.id, function (profile) {
							//console.log("Res Post facebook 3", profile);
							var obj = JSON.parse(profile);
							var msg = "Chúc mừng " + obj["last_name"] + " " + obj["first_name"] + " đã kết nối vào hệ thống!";
							//sendTextMessage(messagingEvent.sender.id, msg)
							
							sendMessageWelecome(messagingEvent.sender.id,msg);
						});
					}else if (messagingEvent.postback && messagingEvent.postback.payload == 'confirm') {
						//present user 'confirm':				
						sendMessageConfimRegister(messagingEvent.sender.id);
						
					}					
					else {
						console.log("Facebook Webhook received unknown messagingEvent: ", messagingEvent);
					}
				});
			} else {
				console.log("Messaging undefined");
			}

		});

		// Returns a '200 OK' response to all requests
		res.status(200).send('EVENT_RECEIVED');
	} else {
		// Returns a '404 Not Found' if event is not from a page subscription
		res.sendStatus(404);
	}

});
server.post('/sendbroadcast.bot', auth,(req, res) => {
	let body = req.body;	
	
	//var mydate = new Date();	
	//var inputDate = new Date(mydate.toISOString());
	var msg= body.Msg;
	//console.log("strQuestion: ",strQuestion);	
	var query = {};
	var mess={} ;
	getConnection(function (client) {
		findMembers(query, client, function (results) {
			//	   res.send(results);
			//console.log(results);
			console.log('Total Broadcast send: ' , results.length);
			client.close();
			for(var i=0;i<results.length;i++)
			{
				sendTextMessage(results[i]._id,msg)
			}
			mess.ss="Gửi thành công "+ results.length + " tin";
		});
	});
	res.send(mess);

});
server.get('/getMemberByGroup', auth,(req, res) => {
	res.setHeader('X-Frame-Options', 'ALLOW-FROM '+SERVER_URL);
	var code = req.query.code;
	var options = {}; 
	var pipeline=[] ;
	if(code=="BlockStatus")
	{		
	   pipeline = [
			 {
            "$group": {
                "_id": {
                    "BlockStatus": "$BlockStatus"
                },
                "COUNT(_id)": {
                    "$sum": 1
                }
            }
			}, 
			{
				"$project": {
					"_id": 0,
					"Total": "$COUNT(_id)",
					"BlockStatus": "$_id.BlockStatus"
				}
			}
		];
	
	}else if(code=="GeoCode")
	{
	   pipeline = [
		{
				"$group": {
					"_id": {
						"Provincial": "$Provincial",
						"GeoCodeProvincial": "$GeoCodeProvincial"
					},
					"COUNT(_id)": {
						"$sum": 1
					}
				}
			}, 
			{
				"$project": {
					"_id": 0,
					"Total": "$COUNT(_id)",
					"Provincial": "$_id.Provincial",
					"GeoCodeProvincial": "$_id.GeoCodeProvincial"
				}
			}
		];
		
	}else if(code=="Position")
	{
	   pipeline = [
			{
				"$group": {
					"_id": {
						"Position": "$Position"
					},
					"COUNT(_id)": {
						"$sum": 1
					}
				}
			}, 
			{
				"$project": {
					"_id": 0,
					"Total": "$COUNT(_id)",
					"Position": "$_id.Position"
				}
			}
    	];
	}
	console.log("getMemberByGroup", code);
	getConnection(function (client) {
		findMembersByGroup(pipeline,options, client, function (results) {
				client.close();
			res.send(results);
		
		});
	});
});
server.get('/getMember', authFace,(req, res) => {
	//res.setHeader('X-Frame-Options', 'ALLOW-FROM '+SERVER_URL);
	var name = req.query.name;
	var provincial = req.query.provincial;
	var districts = req.query.districts;
	var wards = req.query.wards;
	var position = req.query.position;
	var level = req.query.level;
	var layer = req.query.layer;
	console.log("getMember layer: ",layer);
	if(name==null || name=='all')
		name="";
	if(provincial==null || provincial=='all' || provincial=='NA')
		provincial="";
	if(districts==null || districts=='all' || districts=='NA')
		districts="";
	if(wards==null || wards=='all' || wards=='NA')
		wards="";
	if(position==null || position=='all' || position=='NA')
		position="";
	if(level==null || level=='all' || level=='NA')
		level="";
	if(layer==null || layer=='all' || layer=='NA')
		layer="";
	//var reqQuery=  req.query.strQuery
	var query = {};
	if (name != "") {
		//{ "Name": {'$regex': '.*nam.*'}}
		name = ".*" + name + ".*";
		Object.assign(query, {
			Name: {
				$regex: name
			}
		});
	}
	if (layer !=undefined & layer != "" & Number(layer)!=1 && Number(layer)!=0 ) {
		Object.assign(query, {
			Layer: Number(layer)
		});
	}
	if (Number(layer)!=1 && Number(layer)!=0)
	{
		if (provincial != "") {
			Object.assign(query, {
				Provincial: provincial
			});
		}
		if (districts != "") {
			Object.assign(query, {
				District: districts
			});
		}
		if (wards != "") {
			Object.assign(query, {
				Ward: wards
			});
		}
		if (position != "") {
			Object.assign(query, {
				Position: position
			});
		}
	}
	console.log("GetMember query", query);
	getConnection(function (client) {
		findMembers(query, client, function (results) {
			client.close();
			res.send(results);
			
		});
	});
});
server.get('/getKycMembers', authKsv,(req, res) => {
	res.setHeader('X-Frame-Options', 'ALLOW-FROM '+SERVER_URL);
	var query = {};
//	var name = req.query.name;
	var provincial = req.query.provincial;
	var districts = req.query.districts;
	var wards = req.query.wards;
	
	if(provincial==null || provincial=='all')
		provincial="";
	if(districts==null || districts=='all')
		districts="";
	if(wards==null || wards=='all')
		wards="";
//	var position = req.query.position;
//	//var reqQuery=  req.query.strQuery
//	
//	if (name != "") {
//		//{ "Name": {'$regex': '.*nam.*'}}
//		name = ".*" + name + ".*";
//		Object.assign(query, {
//			Name: {
//				$regex: name
//			}
//		});
//	}
	if (provincial != "") {
		Object.assign(query, {
			Provincial: provincial
		});
	}
	if (districts != "") {
		Object.assign(query, {
			Districts: districts
		});
	}
	if (wards != "") {
		Object.assign(query, {
			Wards: wards
		});
	}
//	if (position != "") {
//		Object.assign(query, {
//			Position: position
//		});
//	}
	console.log("getKycMembers query", query);
	getConnection(function (client) {
		findKycMembers(query, client, function (results) {
			client.close();
			res.send(results);
			
		});
	});
});
server.post('/insertAiMessage.bot', auth,(req, res) => {
	let body = req.body;	
	console.log('Re insertAiMessage: ' , body);
	var mydate = new Date();	
	var inputDate = new Date(mydate.toISOString());
	var strQuestion= body.Question.toLowerCase().replace('?','').replace('.','').replace(',','').trim();
	strQuestion=strQuestion.replace('/','').replace(';','').replace('[','').replace(']','').replace('!','');
	console.log("strQuestion: ",strQuestion);
	var objAi = {		
		"Question": strQuestion,	
		"Answer": body.Answer,
		"BlockStatus": body.BlockStatus,
	    "InsertDay": inputDate,		
		"Status": body.Status
	};
	mess ={};
	getConnection(function (client) {
		insertAiMessage(objAi, client, function (err, results) {
			//	   res.send(results);
			//console.log(results);
			if (err) {
				mess.err=err;
				console.log("insertAiMessage Err", err);
			} else {
				mess.ss="Thêm mới thành công!";
				console.log("insertAiMessage SS");
				//sendBackRegister(body.psid, returnMessage);
			}
			console.log("insertAiMessage: Close Connction")
			client.close();
		});
	});
	res.send(mess);

});
server.post('/deleteAiMessage.bot', auth,(req, res) => {
	let body = req.body;	
	console.log('Re deleteAiMessage: ' , body);	
	mess ={};
	if(body.Id)
	{
		var id=body.Id;
		getConnection(function (client) {
			deleteAiMessage(id, client, function (err, results) {
				//	   res.send(results);
				//console.log(results);
				if (err) {
					mess.err=err;
					console.log("deleteAiMessage Err", err);
				} else {
					mess.ss="Xóa thành công!";
					console.log("deleteAiMessage SS");
					//sendBackRegister(body.psid, returnMessage);
				}
				client.close();
			});
		});
	}
	res.send(mess);

});
server.get('/getAiMessage', auth,(req, res) => {

	var query= {};
	getConnection(function (client) {
		findAiMessage(query, client, function (results) {
			client.close();
			res.send(results);
			
		});
	});
	//res.send(req.query.idProvincial);
});
////Bản đồ phân bổ nông ngiệp
server.get('/map.bot', (req, res) => {
	console.log("Call map.bot");
	res.render('map');
	//res.send('Get Id From : '+ fromId + " = "+ data);
});