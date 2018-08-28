/* jshint node: true, devel: true */
// sử dụng strict mode của javascript

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
//const ZaloOA = require('zalo-sdk').ZaloOA;
const request = require('request');
const https = require('https');
const config = require('config');
const crypto = require('crypto'); // thư viện hỗ trợ mã hóa
var path = require('path');
var getDirName = require('path').dirname;
const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb')
var util = require('util');
var formidable = require('formidable');
const multer = require('multer');
var cloudinary = require('cloudinary');
var objDb = require('./object/database.js');
//Google drive
//const readline = require('readline');
//const { google } = require('googleapis');

//const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
//const TOKEN_PATH = 'token.json';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fieldSize: 2 * 1024 * 1024
    }
});
var fs = require('fs');
var FormData = require('form-data');
var t = require('./test.js');
var provincial = require('./Provincial.js');
////Toàn thêm
var Cryptojs = require("crypto-js"); //Toanva add
///// hết
//Toanva add api Message
//const { MessengerClient } = require('messaging-api-messenger');


const server = express();

server.set('port', process.env.PORT || 8080);
server.set('view engine', 'ejs');
server.use(session({
    secret: 'nsvn119',
    saveUninitialized: true,
    resave: true
}));
server.use(bodyParser.urlencoded({
    extended: false,
    limit: '10mb',
    parameterLimit: 10000
}))
server.use(bodyParser.json({
    verify: verifyRequestSignature,
    limit: '10mb'
}));

server.use(express.static('public'));
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

// URL where the app is running (include protocol). Used to point to scripts and 
// assets located at this address. 
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
//const client = MessengerClient.connect({
//	accessToken: PAGE_ACCESS_TOKEN,
//	appSecret: APP_SECRET,
//	version: '3.1'
//});
//var SERVER_URL ="https://nongsanvn.herokuapp.com";
if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN && SERVER_URL)) {
    console.error("Missing config values");
    process.exit(1);
}
cloudinary.config({
    cloud_name: IMAGE_CLOUD_NAME,
    api_key: IMAGE_API_KEY,
    api_secret: IMAGE_API_SECRET
});


////////////
/*
 * Use your own validation token. Check that the token used in the Webhook 
 * setup is the same token used here.
 *
 */

function verifyRequestSignature(req, res, buf) {
    var signature = req.headers["x-hub-signature"];
    if (!signature) {
        // For testing, let's log an error. In production, you should throw an 
        // error.
        console.error("Couldn't validate the signature.");
    } else {
        //console.error("APP_SECRET", APP_SECRET);
        //console.error("PAGE_ACCESS_TOKEN", PAGE_ACCESS_TOKEN);
        var elements = signature.split('=');
        var method = elements[0];
        var signatureHash = elements[1];
        var expectedHash = crypto.createHmac('sha1', APP_SECRET)
            .update(buf)
            .digest('hex');
        //console.error("expectedHash", expectedHash);
        //console.error("signatureHash", signatureHash);
        //if (signatureHash != expectedHash) {
        //    throw new Error("Couldn't validate the request signature.");
        //}
    }
};

const saveLogs = function (objLogs) {
    try {
        objDb.getConnection(function (client) {
            objDb.insertLogs(objLogs, client, function (err, results) {
                if (err) {
                    console.log("insertLogs err:", err);
                } else {
                    console.log("insertLogs ss:", objLogs);
                }
                client.close();
            });
        });
    } catch (err) {
        console.error("saveLogs: ", err);
    }
};

/// Dùng cho messs
var authFace = function (req, res, next) {
    //console.log("Session :",req.session);
    console.log("Session faceUser :", req.session.faceUser);
    if (req.session && req.session.faceUser)
        return next();
    else
        return res.sendStatus(401);
};
/// Dùng cho CMS
var auth = function (req, res, next) {
    if (req.session && req.session.admin)
        return next();
    else
        return res.sendStatus(401);
};
////////
var authKsv = function (req, res, next) {
    if (req.session && req.session.ksv)
        return next();
    else
        return res.sendStatus(401);
};
////////// rowter
server.get('/setup', (req, res) => {
    setupGetStartedButton(res);
    setupGreetingText(res);
});
server.post('/', function (req, res) {
});
//Toanva add getkeyCMS
server.post('/getkeyCMS', function (req, res) {
    let body = req.body;
    if (req.session.cms_key == undefined || req.session.cms_key == null || req.session.cms_key !== req.sessionID) {
        var cms_key = req.sessionID;
        req.session.cms_key = cms_key;
        res.send(cms_key);
    } else {
        res.send(req.session.cms_key);
    }
});
//Toanva add loginCMS
server.post('/loginCMS', function (req, res) {
    try {

        let body = req.body;
        var bytes = Cryptojs.AES.decrypt(body.data, req.sessionID);
        var stringByte = bytes.toString(Cryptojs.enc.Utf8);
        console.log("loginCMS Byte to string:", stringByte);
        if (stringByte != undefined && stringByte != null && stringByte != "") {
            var decryptedData = JSON.parse(bytes.toString(Cryptojs.enc.Utf8));

            if (!decryptedData.UserName || !decryptedData.Password) {
                console.log("loginCMS failed");
                res.send('Mật khẩu hoạc tài khoản không đúng');
            } else {
                console.log("loginCMS:", decryptedData.UserName);
                var query = {
                    UserName: decryptedData.UserName,
                    Password: Cryptojs.MD5(decryptedData.Password).toString()
                }
                objDb.getConnection(function (client) {
                    objDb.findUsers(query, client, function (results) {
                        client.close();
                        if (results !== null && results.length > 0) {
                            console.log("loginCMS success");
                            req.session.user = body.UserName;
                            req.session.admin = true;
                            req.session.faceUser = true;
                            res.json({
                                success: "true",
                                message: 'Đăng nhập thành công'
                            });
                        } else {
                            console.log("loginCMS failed");
                            res.json({
                                success: "false",
                                message: 'Mật khẩu hoạc tài khoản không đúng'
                            });
                        }
                    });
                });
            }
        } else {
            console.error("loginCMS failed byte string nulll");
            res.json({
                success: "false",
                message: 'Phiên làm việc không còn hiệu lực, bạn tải lại trang để đăng nhập'
            });
        }
    } catch (err) {
        console.error("loginCMS failed:", err);
        res.json({
            success: "false",
            message: 'Phiên làm việc không còn hiệu lực, bạn tải lại trang để đăng nhập'
        });
    }
});
server.get('/logoutCMS', function (req, res) {
    req.session.destroy();
    res.send("logout success!");
});

//Toanva add gui bai viet
server.get('/senddocument', (req, res, next) => {

    let referer = req.get('Referer');
    //console.log("register.bot 0",referer);
    if (referer) {
        if (referer.indexOf('www.messenger.com') >= 0) {
            res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.messenger.com/');
        } else if (referer.indexOf('www.facebook.com') >= 0) {
            res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.facebook.com/');
        } else if (referer.indexOf('staticxx.facebook.com') >= 0) {
            res.setHeader('X-Frame-Options', 'ALLOW-FROM https://staticxx.facebook.com');
        }
        //console.log("Session register:", req.session);
        //res.render('register');
        res.sendFile('views/senddocument.html', {
            root: __dirname
        });
    }
});

server.get('/document', (req, res, next) => {
    let referer = req.get('Referer');
    //console.log("register.bot 0",referer);
    if (referer) {
        if (referer.indexOf('www.messenger.com') >= 0) {
            res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.messenger.com/');
        } else if (referer.indexOf('www.facebook.com') >= 0) {
            res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.facebook.com/');
        } else if (referer.indexOf('staticxx.facebook.com') >= 0) {
            res.setHeader('X-Frame-Options', 'ALLOW-FROM https://staticxx.facebook.com');
        }
        console.log("Session register:", req.session);
        res.sendFile('views/document.html', {
            root: __dirname
        });
    }
});
// Toanva login - End
server.post('/login.bot', function (req, res) {
    let body = req.body;
    console.log("login.bot:", body);
    if (!body.UserName || !body.Password) {
        console.log("login failed");
        res.send('Mật khẩu hoạc tài khoản không đúng.');
    } else if (body.UserName == "test" && body.Password == "12345") {
        req.session.user = body.UserName;
        req.session.admin = true;
        req.session.faceUser = true;
        console.log("login success");
        res.send("true");

    } else if (body.UserName == "ksv" && body.Password == "ksvThani") {
        req.session.user = body.UserName;
        req.session.ksv = true;
        res.send("true");

    } else {
        console.log("login failed");
        res.send('Mật khẩu hoạc tài khoản không đúng.!');
    }
});
server.get('/logout.bot', function (req, res) {
    req.session.destroy();
    res.send("logout success!");
});
server.post('/senddocument', upload.single('somefile'), (req, res) => {
    try {
        let body = req.body;
        res.status(200).send('Please close this window to return to the conversation thread.');
        //var dir = "./public/uploads/Avatar";
        req.session.psid = body.psid;
        var mydate = new Date();
        var inputDate = new Date(mydate.toISOString());
        console.log("registerspostback PSID", body.psid);
        var returnMessage = "Cảm ơn bạn đã tham gia chương trình. Thani sẽ thông báo cho bạn ngay khi bài viết được đăng tải. Bạn vẫn muốn trò chuyện với Thani đó chứ?";
        //console.log(returnMessage);
        var objMember = {
            "psid": body.psid,
            "LinkDocument": body.LinkDocument,
            "InsertDate": inputDate
        };
        console.log("objMember", objMember);
        objDb.getConnection(function (client) {
            objDb.insertDocument(objMember, client, function (err, results) {
                if (err) {
                    sendTextMessage(body.psid, 'Echo:' + err);
                } else {
                    client.close();
                    //sendTextMessage(body.psid, returnMessage);
                    sendMessageGuiBaiVietXong(body.psid, returnMessage);
                }
            });
        });

    } catch (err) {
        console.error("registerspostback:", err);
        res.send(null);
    }
});
server.post('/document', upload.single('somefile'), (req, res) => {
    let body = req.body;
    //console.log("body", body);
    res.status(200).send('Please close this window to return to the conversation thread.');
    var returnMessage = "Cảm ơn bạn đã cung cấp thông tin. Thani kiểm tra lại nhé: Bạn tên là " + body.Name + ", sinh ngày : " + body.Birthday + " , địa chỉ : " + body.Address + ". Số CMT của bạn là : " + body.CMT + ". Số điện thoại của bạn là : " + body.Phone + ". Chuẩn chưa nhỉ?";
    console.log(returnMessage);
    req.session.psid = body.psid;
    //var inputDate = new Date(mydate.toISOString());
    var objMember = {
        "_id": body.psid,
        "Name": body.Name,
        "Birthday": body.Birthday,
        "Address": body.Address,
        "CMT": body.CMT,
        "Phone": body.Phone
    };

    objDb.getConnection(function (client) {
        objDb.insertMembers(objMember, client, function (err, results) {
            if (err) {
                sendTextMessage(body.psid, 'Echo:' + err);
            } else {
                client.close();
                //sendTextMessage(body.psid, returnMessage);
                sendMessageGuiBaiViet(body.psid, returnMessage);
            }
        });
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
    var msg = "Bạn có muốn tiếp tục nói chuyện với Thani không ?";
    quickReplies = [{
        content_type: "text",
        title: "Có chứ",
        payload: "confirm",
        image_url: SERVER_URL + "/img/OkLike.png"
    }, {
        content_type: "text",
        title: "Hỗ trợ",
        payload: "help",
        image_url: SERVER_URL + "/img/helps.png"
    }, {
        content_type: "text",
        title: "Hướng dẫn",
        payload: "guide",
        image_url: SERVER_URL + "/img/guide.png"
    }];
    sendQuickMessage(psid, msg, quickReplies);
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
                            sendMessageWelecome(messagingEvent.sender.id, msg);
                        });
                    } else if (messagingEvent.postback && messagingEvent.postback.payload == 'confirm') {
                        msg = "";
                        sendMessageWelecome(messagingEvent.sender.id, msg);
                    }
                    else if (messagingEvent.postback && messagingEvent.postback.payload == 'tieptuc') {
                        msg = "";
                        sendMessageWelecome(messagingEvent.sender.id, msg);

                    } else if (messagingEvent.postback && messagingEvent.postback.payload == 'gddb') {
                        msg = 'Bạn biết không, trong quá khứ, những ai bị khuyết tật thì thường không được đi học.' +
                            ' Trẻ em khuyết tật thường được các thầy thuốc hay gia sư giáo dục. Những thầy thuốc ban đầu này  đã đặt ra nền móng cho giáo dục đặc biệt ngày nay.' +
                            ' Họ tập trung vào việc giảng dạy mang tính cá nhân hóa và những kỹ năng cần đến trong đời sống.' +
                            ' Giáo dục đặc biệt trước đây chỉ dành cho những người có những khuyết tật nghiêm trọng và ở độ tuổi còn nhỏ, nhưng gần đây thì mở rộng ra cho bất cứ ai cảm thấy gặp khó khăn trong học tập.' +
                            ' Một mảng giáo dục thật ý nghĩa phải không nào. Chúng ta tiếp tục tìm hiểu thêm về chương trình nhé?';
                        sendMessageGiaoDucDacBiet(messagingEvent.sender.id, msg);
                    } else if (messagingEvent.postback && messagingEvent.postback.payload == 'cuocthi') {
                        msg = "";
                        sendMessageCuocThi(messagingEvent.sender.id, msg);

                    } else if (messagingEvent.postback && messagingEvent.postback.payload == 'giaithuong') {
                        msg = ' Cơ cấu giải thưởng của cuộc thi viết: 01 giải nhất: 5.000.000 đ và bằng chứng nhận.' +
                            ' 01 giải nhì 4.000.000 đ và bằng chứng nhận.' +
                            ' 01 giải ba 2.000.000 đ và bằng chứng nhận.' +
                            ' Các phần quà đến từ nhà tài trợ Thiên Long. Bạn tham gia cùng chương trình ngay nhé!';
                        sendMessageGiaiThuong(messagingEvent.sender.id, msg);

                    } else {
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
//Toanva add getMemberCMS
server.get('/getMemberCMS', auth, (req, res) => {
    var name = req.query.name;
    var psid = req.query.psid;
    var cmt = req.query.cmt;
    var phone = req.query.phone;
    if (psid == null || psid == 'all')
        psid = "";
    if (name == null || name == 'all')
        name = "";
    if (cmt == null || cmt == 'all')
        cmt = "";
    if (phone == null || phone == 'all')
        phone = "";
    var query = {};
    if (name != "") {
        name = ".*" + name + ".*";
        Object.assign(query, {
            Name: {
                $regex: name
            }
        });
    }
    if (psid != "") {
        Object.assign(query, {
            _id: psid
        });
    }
    if (cmt != "") {
        cmt = ".*" + cmt + ".*";
        Object.assign(query, {
            CMT: {
                $regex: cmt
            }
        });
    }

    if (phone != "") {
        phone = ".*" + phone + ".*";
        Object.assign(query, {
            Phone: {
                $regex: phone
            }
        });
    }
    console.log("GetMemberCMS query", query);
    objDb.getConnection(function (client) {
        objDb.findMembers(query, client, function (results) {
            client.close();
            res.send(results);
        });
    });
});
//Toanva getMemberCMS end
server.get('/info.bot', (req, res, next) => {
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
        res.sendFile('views/info.html', {
            root: __dirname
        });
    }
});
server.get('/help.bot', (req, res, next) => {
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
        res.sendFile('views/help.html', {
            root: __dirname
        });
    }
});
server.post('/helppostback.bot', upload.single('somefile'), authFace, (req, res) => {

    let body = req.body;
    req.session.psid = body.psid;
    var psid = body.psid;
    var fullName = body.Name;
    var phone = body.Phone;
    var email = body.Email;
    var content = body.Content;
    var query = {};
    callGetProfile(psid, function (objFacebook) {
        var objFacebook = JSON.parse(objFacebook);
        console.log("helppostback callGetProfile: ", objFacebook);
        imgUrl = objFacebook.profile_pic;
        objDb.getConnection(function (client) {
            objDb.findSupport(query, client, function (results) {
                client.close();
                console.log("helppostback :", content);
                console.log("helppostback Psid:", results[0].Psid);
                sendTextMessage(results[0].Psid, "Thani nhận được yêu cầu hỗ trợ của " + fullName + ", ĐT :" + phone + " , Email:" + email + ", Tên Facebook là : " + objFacebook["last_name"] + " " + objFacebook["first_name"] + ", nội dung cần được hỗ trợ là:" + content + ". Ảnh đại diện facebook:");
                sendUrlMessage(results[0].Psid, "image", imgUrl, function (error, response, body) {
                    if (error) throw error;
                    console.log("sendUrlMessage:");
                    //sendTextMessage("1704606899576704", "Nội dung cần được hỗ trợ : "+content);
                    var button = [{
                        type: "web_url",
                        url: SERVER_URL + "/replyhelp.bot?fpsid=" + psid + "&qs=" + content,
                        title: "Trả lời",
                        messenger_extensions: true,
                        webview_height_ratio: "tall",
                        fallback_url: SERVER_URL + "/replyhelp.bot?fpsid=" + psid + "&qs=" + content
                    }];
                    sendButtonMessage(results[0].Psid, "Trả lời câu hỏi!", button);
                });
                ///////Reply member
                var msg = "Thani đã nhận được yêu cầu hỗ trợ của " + objFacebook["last_name"] + " " + objFacebook["first_name"] + ". Thani sẽ phản hồi lại bạn sớm nhất có thể. Bạn có muốn tiếp tục nói chuyện với Thani không ?";
                quickReplies = [{
                    content_type: "text",
                    title: "Có chứ",
                    payload: "confirm",
                    image_url: SERVER_URL + "/img/OkLike.png"
                }, {
                    content_type: "text",
                    title: "Hỗ trợ",
                    payload: "help",
                    image_url: SERVER_URL + "/img/helps.png"
                }, {
                    content_type: "text",
                    title: "Hướng dẫn",
                    payload: "guide",
                    image_url: SERVER_URL + "/img/guide.png"
                }];
                sendQuickMessage(body.psid, msg, quickReplies);
                res.status(200).send('Please close this window to return to the conversation thread.');
            });
        });
        /// end 1
    });

});
server.get('/replyhelp.bot', (req, res, next) => {
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
        res.sendFile('views/replyhelp.html', {
            root: __dirname
        });
    }
});
server.post('/replyhelppostback.bot', upload.single('somefile'), authFace, (req, res) => {

    let body = req.body;
    req.session.psid = body.psid;
    var fromPsid = body.fromPsid;
    var Question = body.Question;
    var content = body.Content;
    var msg = "Thani đã nhận được yêu cầu hỗ trợ của bạn như sau : " + Question + ". Thani xin được trả lời câu hỏi : " + content + " . Bạn muốn tiếp tục trò chuyện với Thani chứ ?";
    quickReplies = [{
        content_type: "text",
        title: "Có chứ",
        payload: "confirm",
        image_url: SERVER_URL + "/img/OkLike.png"
    }, {
        content_type: "text",
        title: "Hỗ trợ",
        payload: "help",
        image_url: SERVER_URL + "/img/helps.png"
    }, {
        content_type: "text",
        title: "Hướng dẫn",
        payload: "guide",
        image_url: SERVER_URL + "/img/guide.png"
    }];
    sendQuickMessage(fromPsid, msg, quickReplies);
    res.status(200).send('Please close this window to return to the conversation thread.');


});

function insertMember(psid, imgUrl, objMember, returnMessage, client, res) {
    //// start insert member
    objDb.insertMembers(objMember, client, function (err, results) {
        if (err) {
            sendTextMessage(psid, 'Echo:' + err);
        } else {

            console.log("registerspostback: ", objMember);
            //writeFile(imgName,body.DataImgAvatar,dir,body.psid);
            sendTextMessage(psid, "Cảm ơn bạn đã cung cấp thông tin.");

            //sendUrlMessage(psid, "image", imgUrl, function (error, response, bd) {
            //	if (error) throw error;
            //	console.log("sendUrlMessage:");
            //	sendBackRegister(psid, returnMessage);
            //});
            client.close();
            res.status(200).send('Please close this window to return to the conversation thread.');
            //res.send(objMember);
        }

        //// enc insert member
    });
};
/// end rowter
function callSendAPI(messageData) {
    ///console.log("callSendAPI",request) ;

    //console.log("callSendAPI:",messageData.recipient.id)
    request({
        uri: 'https://graph.facebook.com/v3.1/me/messages',
        qs: {
            access_token: PAGE_ACCESS_TOKEN
        },
        method: 'POST',
        json: messageData

    },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {


                var recipientId = body.recipient_id;
                var messageId = body.message_id;
                //sendTypingOff(recipientId);
                if (messageId) {
                    console.log("Successfully sent message with id %s to recipient %s",
                        messageId, recipientId);
                } else {
                    console.log("Successfully called Send API for recipient %s",
                        recipientId);
                }

            } else {
                console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
                console.error(response.error);
            }
        });
};

function callSendAPIReg(messageData, callback) {
    ///console.log("callSendAPI",request) ;

    //console.log("callSendAPI:",messageData.recipient.id)
    request({
        uri: 'https://graph.facebook.com/v3.1/me/messages',
        qs: {
            access_token: PAGE_ACCESS_TOKEN
        },
        method: 'POST',
        json: messageData

    },
        function (error, response, body) {

            callback(error, response, body);
        });
};

function callSendAPICreatives(messageData, callback) {
    ///console.log("callSendAPI",request) ;

    //console.log("callSendAPI:",messageData.recipient.id)
    request({
        uri: 'https://graph.facebook.com/v3.0/me/message_creatives',
        qs: {
            access_token: PAGE_ACCESS_TOKEN
        },
        method: 'POST',
        json: messageData

    },
        function (error, response, body) {

            callback(error, response, body);
        });
};

function callSendAPIBroadcast(messageData, callback) {
    ///console.log("callSendAPI",request) ;

    //console.log("callSendAPI:",messageData.recipient.id)
    request({
        uri: 'https://graph.facebook.com/v3.0/me/broadcast_messages',
        qs: {
            access_token: PAGE_ACCESS_TOKEN
        },
        method: 'POST',
        json: messageData

    },
        function (error, response, body) {

            callback(error, response, body);
        });
};

function callSendAPIFile(messageData) {
    var endpoint = "https://graph.facebook.com/v3.0/me/messages?access_token=" + PAGE_ACCESS_TOKEN;
    var r = request.post(endpoint, function (err, httpResponse, body) {
        if (err) {
            return console.error("upload failed >> \n", err)
        };
        console.log("upload successfull >> \n", body); //facebook always return 'ok' message, so you need to read error in 'body.error' if any
        sendOneQuick(messageData.recipient.id, "Bạn có muốn tiếp tục trò truyện với Thani không?", "Có chứ", "confirm", "advisory.png");
    });
    var form = r.form();
    form.append('recipient', JSON.stringify(messageData.recipient));
    form.append('message', JSON.stringify(messageData.message));
    form.append('filedata', messageData.filedata); //no need to stringify!
};

function callGetProfile(psid, callback) {

    request('https://graph.facebook.com/v3.1/' + psid + '?fields=first_name,last_name,profile_pic&access_token=' + PAGE_ACCESS_TOKEN, function (error, response, body) {

        //nếu có lỗi
        if (!error && response.statusCode == 200) {
            var obj = JSON.parse(body);
            console.log("callGetProfile: ", obj.last_name + ' ' + obj.first_name + ' ' + obj.profile_pic);
            //var imgUrl = obj.profile_pic;
            //try {
            //    objDb.getConnection(function (client) {
            //        objDb.updateAvatarMemeber(psid, imgUrl, client, function (results) {
            //            console.log('updateAvatarMemeber SS:', psid);
            //            client.close();
            //        });
            //    });
            //} catch (err) {
            //    console.error("updateAvatarMemeber: ", err);
            //}
            callback(body);
        } else {
            console.error(response.error);
        }
    });
};

function sendShareContents(recipientId, objPayload) {

    var messageData = {
        recipient: {
            id: recipientId
        },
        type: "element_share",
        share_contents: {
            attachment: {
                type: template,
                payload: objPayload
            }
        }
    };
    callSendAPI(messageData);
};

function sendTypingOff(recipientId) {
    var messageData = {
        recipient: {

            id: recipientId
        },
        sender_action: "typing_off"
    };
    request({
        uri: 'https://graph.facebook.com/v3.1/me/messages',
        qs: {
            access_token: PAGE_ACCESS_TOKEN
        },
        method: 'POST',
        json: messageData

    },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {


                var recipientId = body.recipient_id;
                var messageId = body.message_id;

                if (messageId) {
                    console.log("Successfully sent message with id %s to recipient %s",
                        messageId, recipientId);
                } else {
                    console.log("Successfully called Send API for recipient %s",
                        recipientId);
                }
            } else {
                //console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
                console.error(response.error);
            }
        });
};

function sendTypingOn(recipientId) {
    var messageData = {
        recipient: {

            id: recipientId
        },
        sender_action: "typing_on"
    };

    //callSendMess(messageData);
};

function sendTextMessage(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText,
            metadata: "DEVELOPER_DEFINED_METADATA"
        }
    };

    callSendAPI(messageData);
};

function sendFileMessage(recipientId, messageText, fileType, file_loc) {
    var readStream = fs.createReadStream(file_loc);

    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: fileType,
                payload: {}
            }
        },
        filedata: readStream //+";type=image/png"
    };
    callSendAPIFile(messageData);
};

function sendFileThele(recipientId, messageText, fileType, file_loc) {
    var readStream = fs.createReadStream(file_loc);

    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: fileType,
                payload: {}
            }
        },
        filedata: readStream //+";type=image/png"
    };
    callSendAPIFileThele(messageData);
};
function callSendAPIFileThele(messageData) {
    var endpoint = "https://graph.facebook.com/v3.0/me/messages?access_token=" + PAGE_ACCESS_TOKEN;
    var r = request.post(endpoint, function (err, httpResponse, body) {
        if (err) {
            return console.error("upload failed >> \n", err)
        };
        console.log("upload successfull >> \n", body); //facebook always return 'ok' message, so you need to read error in 'body.error' if any
        sendOneQuick(messageData.recipient.id, "Bạn hiểu về chương trình rồi chứ. Cùng xem chúng ta có thể làm gì tiếp theo nhé!", "Đồng ý", "confirm", "advisory.png");
    });
    var form = r.form();
    form.append('recipient', JSON.stringify(messageData.recipient));
    form.append('message', JSON.stringify(messageData.message));
    form.append('filedata', messageData.filedata); //no need to stringify!
};

function sendUrlMessage(recipientId, fileType, url, callback) {


    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: fileType,
                payload: {
                    "url": url,
                    "is_reusable": true
                }
            }
        }
    };
    callSendAPIReg(messageData, function (error, response, body) {

        callback(error, response, body);
    });
};

function sendTextMessageWelecom(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText,
            metadata: "DEVELOPER_DEFINED_METADATA"
        }
    };

    callSendAPI(messageData);
};
//// Call Webview
function sendRegisterForm(recipientId, msg) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: msg,
                    buttons: [{
                        type: "web_url",
                        url: SERVER_URL + "/register.bot?psid=" + recipientId,
                        title: "Điểm danh",
                        messenger_extensions: true,
                        webview_height_ratio: "tall",
                        fallback_url: SERVER_URL + "/register.bot?psid=" + recipientId
                    }]
                }
            }
        }
    };
    callSendAPI(messageData);
};

function sendBasicRegisterForm(recipientId, msg) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: msg,
                    buttons: [{
                        type: "web_url",
                        url: SERVER_URL + "/basicregister.bot?psid=" + recipientId,
                        title: "Điểm danh",
                        messenger_extensions: true,
                        webview_height_ratio: "tall",
                        fallback_url: SERVER_URL + "/basicregister.bot?psid=" + recipientId
                    }]
                }
            }
        }
    };
    callSendAPI(messageData);
};

function sendRegisterTempForm(recipientId, msg) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: msg,
                    buttons: [{
                        type: "web_url",
                        url: SERVER_URL + "/registertemp.bot",
                        title: "Điểm danh",
                        messenger_extensions: true,
                        webview_height_ratio: "tall",
                        fallback_url: SERVER_URL + "/registertemp.bot"
                    }]
                }
            }
        }
    };
    callSendAPI(messageData);
};

function sendMessageDocument(recipientId, msg) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: msg,
                    buttons: [{
                        type: "web_url",
                        url: SERVER_URL + "/senddocument?psid=" + recipientId,
                        title: "Gửi bài viết",
                        messenger_extensions: true,
                        webview_height_ratio: "tall",
                        fallback_url: SERVER_URL + "/senddocument?psid=" + recipientId
                    }]
                }
            }
        }
    };
    callSendAPI(messageData);
};
function sendMessageIProducts(recipientId, msg) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: msg,
                    buttons: [{
                        type: "web_url",
                        url: SERVER_URL + "/iproducts.bot?psid=" + recipientId,
                        title: "Cung cấp thông tin",
                        messenger_extensions: true,
                        webview_height_ratio: "tall",
                        fallback_url: SERVER_URL + "/iproducts.bot?psid=" + recipientId
                    }]
                }
            }
        }
    };
    callSendAPI(messageData);
};

function sendButtonMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "Chúng ta cùng làm quen bằng thủ tục điểm danh nhé",
                    buttons: [{
                        type: "web_url",
                        url: SERVER_URL + "/register.bot",
                        title: "Điểm danh",
                        messenger_extensions: true,
                        webview_height_ratio: "tall",
                        fallback_url: SERVER_URL + "/register.bot"
                    }]
                }
            }
        }
    };
    callSendAPI(messageData);
};

function sendButtonMessage(recipientId, msg, buttons) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: msg,
                    buttons: buttons
                }
            }
        }
    };
    callSendAPI(messageData);
};

function sendGenericMessage(recipientId, elements) {
    //	console.log("Help 1",recipientId);
    var messageData = {
        recipient: {
            id: recipientId
        }, message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: elements
                }
            }
        }
    };
    //console.log("Help 2",messageData);
    callSendAPI(messageData);
};

function sendBackRegister(recipientId, mgs) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: mgs,
                    buttons: [{
                        type: "postback",
                        title: "Chuẩn",
                        "payload": "confirm"
                    }, {
                        type: "web_url",
                        url: SERVER_URL + "/register.bot?psid=" + recipientId,
                        title: "Điểm danh lại",
                        messenger_extensions: true,
                        webview_height_ratio: "tall",
                        fallback_url: SERVER_URL + "/register.bot?psid=" + recipientId
                    }]
                }
            }
        }
    };
    callSendAPI(messageData);
};

function sendBasicBackRegister(recipientId, mgs) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: mgs,
                    buttons: [{
                        type: "postback",
                        title: "Chuẩn",
                        "payload": "confirm"
                    }, {
                        type: "web_url",
                        url: SERVER_URL + "/basicregister.bot?psid=" + recipientId,
                        title: "Điểm danh lại",
                        messenger_extensions: true,
                        webview_height_ratio: "tall",
                        fallback_url: SERVER_URL + "/basicregister.bot?psid=" + recipientId
                    }]
                }
            }
        }
    };
    callSendAPI(messageData);
};

function sendBackRegisterTemp(recipientId, mgs) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: mgs,
                    buttons: [{
                        type: "postback",
                        title: "Chuẩn",
                        "payload": "confirm"
                    }, {
                        type: "web_url",
                        url: SERVER_URL + "/registertemp.bot",
                        title: "Điểm danh lại",
                        messenger_extensions: true,
                        webview_height_ratio: "tall",
                        fallback_url: SERVER_URL + "/registertemp.bot"
                    }]
                }
            }
        }
    };
    callSendAPI(messageData);
};

function sendBackProduct(recipientId, mgs) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: mgs,
                    buttons: [{
                        type: "postback",
                        title: "Chuẩn",
                        "payload": "cfp"
                    }]
                }
            }
        }
    };
    callSendAPI(messageData);
};

function sendOneQuick(recipientId, msg, tile, payload, img) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: msg,
            quick_replies: [{
                content_type: "text",
                title: tile,
                payload: payload,
                image_url: SERVER_URL + "/img/" + img
            }]
        }

    };
    callSendAPI(messageData);
};

function sendQuickMessage(recipientId, msg, quickReplies) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: msg,
            quick_replies: quickReplies
        }

    };
    callSendAPI(messageData);
};

function sendBroadcast(recipientId, msg) {

    var messageData = {
        "dynamic_text": {
            "text": msg,
            "fallback_text": msg
        }
    };

};

function sendMessageWelecome(recipientId, msg) {
    msg = msg + ' Mình là Thani - đại diện quản lý Chương trình "Viết về thầy cô Giáo dục đặc biệt".' +
        ' Bạn biết không, để gắn bó với nghề, nhiều thầy cô đã phải hy sinh rất nhiều thứ để ở bên các con - những mảnh đời không hoàn hảo, để hoàn thành tâm nguyện một đời đó là các con, gia đình các con không bao giờ đơn độc trên hành trình này.' +
        ' Giờ bạn muốn tìm hiểu về vấn đề gì nào ?';
    var button = [{
        type: 'postback',
        title: 'Giáo dục đặc biệt',
        payload: 'gddb',
    }, {
        type: 'postback',
        title: 'Cuộc thi',
        payload: 'cuocthi',
    }, {
        type: 'postback',
        title: "Giải thưởng",
        payload: 'giaithuong',
    }];
    sendButtonMessage(recipientId, msg, button);
};
function sendMessageGiaoDucDacBiet(recipientId, msg) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: msg,
            quick_replies: [{
                content_type: "text",
                title: "Tiếp tục",
                payload: "gddb2",
                image_url: SERVER_URL + "/img/ok.png"
            }, {
                content_type: "text",
                title: "Quay lại",
                payload: "backStart",
                image_url: SERVER_URL + "/img/back2.png"
            }]
        }
    };
    callSendAPI(messageData);
};
function sendMessageGiaiThuong(recipientId, msg) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: msg ,
            quick_replies: [{
                content_type: "text",
                title: "Thể lệ",
                payload: "thele",
                image_url: SERVER_URL + "/img/thele.png"
            }, {
                content_type: "text",
                title: "Gửi bài viết",
                payload: "guibaiviet",
                image_url: SERVER_URL + "/img/guibaiviet.png"
            }, {
                content_type: "text",
                title: "Bài viết hay",
                payload: "baiviethay",
                image_url: SERVER_URL + "/img/baiviethay.png"
            }, {
                content_type: "text",
                title: "Bình chọn",
                payload: "binhchon",
                image_url: SERVER_URL + "/img/binhchon.png"
            }]
        }
    };
    callSendAPI(messageData);
};

function sendMessageCuocThi(recipientId, msg) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: msg + " Bạn muốn chia sẻ gì cùng Thani nào?",
            quick_replies: [{
                content_type: "text",
                title: "Thể lệ",
                payload: "thele",
                image_url: SERVER_URL + "/img/thele.png"
            }, {
                content_type: "text",
                title: "Gửi bài viết",
                payload: "guibaiviet",
                image_url: SERVER_URL + "/img/guibaiviet.png"
            }, {
                content_type: "text",
                title: "Bài viết hay",
                payload: "baiviethay",
                image_url: SERVER_URL + "/img/baiviethay.png"
            }, {
                content_type: "text",
                title: "Bình chọn",
                payload: "binhchon",
                image_url: SERVER_URL + "/img/binhchon.png"
            }]
        }
    };
    callSendAPI(messageData);
};


function sendMessageDienThongTin(recipientId, msg) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: msg,
            quick_replies: [{
                content_type: "text",
                title: "Thể lệ",
                payload: "thele",
                image_url: SERVER_URL + "/img/thele.png"
            }, {
                content_type: "text",
                title: "Gửi bài viết",
                payload: "dienthongtin",
                image_url: SERVER_URL + "/img/guibaiviet.png"
            }]
        }
    };
    callSendAPI(messageData);
};
function sendBaiVietHay(recipientId, mgs) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: mgs,
                    buttons: [{
                        type: "web_url",
                        url: SERVER_URL + "/baiviethay.html",
                        title: "Xem ngay",
                        messenger_extensions: true,
                        webview_height_ratio: "tall",
                        fallback_url: SERVER_URL + "/baiviethay.html"
                    }
                        , {
                        type: "postback",
                        title: "Tiếp tục",
                        "payload": "tieptuc"
                    }]
                }
            }
        }
    };
    callSendAPI(messageData);
};
function sendMessageGuiBaiVietXong(recipientId, msg) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: msg,
            quick_replies: [{
                content_type: "text",
                title: "Tiếp tục",
                payload: "tieptuc",
                image_url: SERVER_URL + "/img/HoiMin.png"
            },
            {
                content_type: "text",
                title: "Dừng lại",
                payload: "dunglai",
                image_url: SERVER_URL + "/img/HoiMin.png"
            }
            ]
        }
    };
    callSendAPI(messageData);
};
function sendMessageGuiBaiViet(recipientId, msg) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: msg,
            quick_replies: [{
                content_type: "text",
                title: "Chính xác",
                payload: "guibai",
                image_url: SERVER_URL + "/img/HoiMin.png"
            },
            {
                content_type: "text",
                title: "Điền lại",
                payload: "dienthongtin",
                image_url: SERVER_URL + "/img/HoiMin.png"
            }
            ]
        }
    };
    callSendAPI(messageData);
};
function sendMessageAccept(recipientId, msg) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: msg,
            quick_replies: [{
                content_type: "text",
                title: "Thể lệ",
                payload: "thele",
                image_url: SERVER_URL + "/img/thele.png"
            }, {
                content_type: "text",
                title: "Gửi bài viết",
                payload: "guibaiviet",
                image_url: SERVER_URL + "/img/guibaiviet.png"
            }, {
                content_type: "text",
                title: "Bài viết hay",
                payload: "baiviethay",
                image_url: SERVER_URL + "/img/baiviethay.png"
            }, {
                content_type: "text",
                title: "Bình chọn",
                payload: "binhchon",
                image_url: SERVER_URL + "/img/binhchon.png"
            }]
        }
    };
    callSendAPI(messageData);
};
function sendMessageConfimRegister(recipientId) {
    var query = {
        _id: recipientId
    };
    objDb.getConnection(function (client) {
        objDb.findMembers(query, client, function (results) {
            if (results.length == 1) {

                var messageData = {
                    recipient: {
                        id: recipientId
                    },
                    message: {
                        text: "Cảm ơn " + results[0].Name + ". Bạn là một " + results[0].Position + " gương mẫu đấy. Thani là chuyên gia làm kinh tế trong lĩnh vực nông sản đấy. Hãy nói cho Thani biết vấn đề bạn quan tâm nào.",
                        quick_replies: [{
                            content_type: "text",
                            title: "Xây dựng thương hiệu",
                            payload: "xdth",
                            image_url: SERVER_URL + "/img/star.png"
                        }, {
                            content_type: "text",
                            title: "Bán nông sản",
                            payload: "bns",
                            image_url: SERVER_URL + "/img/salle.png"
                        }, {
                            content_type: "text",
                            title: "Vay vốn SX",
                            payload: "vvsx",
                            image_url: SERVER_URL + "/img/vv1.png"
                        }, {
                            content_type: "text",
                            title: "Hướng dẫn làm DA",
                            payload: "hdlda",
                            image_url: SERVER_URL + "/img/helps.png"
                        }]
                    }
                };
                callSendAPI(messageData);

            }
            client.close();
        });
    });

};

function setAdmin(recipientId) {
    objDb.getConnection(function (client) {
        objDb.setAdminMembers(recipientId, "ACTIVE", client, function (err, results) {

            if (err) {
                //sendTextMessage(body.psid, 'Echo:' + err);
                console.log("setAdminMembers ERR:", err);
                client.close();
                //res.send(err);
            } else {
                console.log("set Admin is id:", recipientId);
                client.close();
                //res.send(err);
            }

            ////  end  findProvincial
        });

        /// end con
    });
};

function getAnswer(question, callback) {
    question = question.toLowerCase().replace('?', '').replace('.', '').replace(',', '').replace(/\s\s/g, " ").trim();
    question = question.replace('/', '').replace(';', '').replace('[', '').replace(']', '').replace('!', '');
    question = question.replace(/[-\/\\^$*+?.()|[\]{}]/g, "").replace(/\s\s/g, " ");
    //question= str.replace(new RegExp(searchStr, 'gi'), replaceStr);
    var query = {
        Question: question
    };
    //{Question: {$regex: question}}
    console.log("GetAnswer query:", query);
    objDb.getConnection(function (client) {
        objDb.findAiMessage(query, client, function (results) {
            //res.send(results);
            console.log("GetAnswer :", results);
            client.close();
            callback(results);

        });
    });
};

function sendInfo(recipientId) {

    var query = {
        _id: recipientId
    };
    //console.log("sendKSV findMembers", query);
    objDb.getConnection(function (client) {
        objDb.findMembers(query, client, function (results) {
            if (results.length == 1) {
                results = results[0];
                //console.log("findMembers:",results);
                var date = new Date(results.Birthday);
                var birthday = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                var msg = "Mời " + results.Name + " xem hồ sơ chi tiết";
                //				var msg="Bạn tên là : "+results.Name +" sinh ngày "+birthday+ ", số điện thoại : 	"+results.Phone+", email: " +results.Email+", chức vụ " +results.Position + ", chi hội "+ results.Branch +" ,Tỉnh/TP :"+results.Provincial+" Quận/Huyện : "+results.District +" , Phường/Xã : " +results.Ward +". Bạn chọn có để xem chi tiết?";

                var button = [{
                    type: "web_url",
                    url: SERVER_URL + "/info.bot?l=",
                    title: "Hồ sơ chi tiết",
                    messenger_extensions: true,
                    webview_height_ratio: "tall",
                    fallback_url: SERVER_URL + "/info.bot?l="
                }];
                //msg="Rất hân hạnh được làm việc cùng một "+results.Position+" như "+results.Name +", chọn 'Có' để xem danh sách các Hội viên mà bạn cần xét duyệt. ";
                sendButtonMessage(recipientId, msg, button);
                //				sendUrlMessage(recipientId,"image",results.ImgUrl,function(error, response, bd){
                //						   if (error) throw error;
                //						   console.log("sendUrlMessage:");
                //					
                //					       quickReplies=[{
                //										content_type: "text",
                //										title: "Có chứ",
                //										payload: "confirm",
                //										image_url: SERVER_URL+"/img/OkLike.png"
                //									},
                //									{
                //										content_type: "text",
                //										title: "Hỗ trợ",
                //										payload: "help",
                //										image_url: SERVER_URL+"/img/helps.png"
                //									}];
                //							sendQuickMessage(recipientId,msg,quickReplies);					 
                //
                //						});

            } else {
                callGetProfile(recipientId, function (profile) {
                    console.log("Get profile: ", profile);
                    var obj = JSON.parse(profile);
                    msg = obj["last_name"] + " " + obj["first_name"] + " chưa là thành viên của hội hoạc bạn chưa thực hiện việc điểm danh, vậy chúng ta hãy làm quen bằng thủ tục điểm danh nhé.";
                    sendRegisterForm(recipientId, msg);
                    //objLog.Answer=msg;
                    ///saveLogs(objLog);
                    //sendMessageWelecome(senderID,msg);
                });
            }
            client.close();
            //res.send(results);

        });
    });
};

function sendNoReply(recipientId) {

    var query = {
        _id: recipientId
    };
    //console.log("sendKSV findMembers", query);
    objDb.getConnection(function (client) {
        objDb.findMembers(query, client, function (results) {
            if (results.length == 1) {
                results = results[0];
                //console.log("findMembers:",results);
                var msg = "Bạn tên là : " + results.Name + ", chức vụ " + results.Position + ", trạng thái " + results.BlockStatus + " ,Tỉnh/TP :" + results.Provincial + " Quận/Huyện : " + results.District + " , Phường/Xã : " + results.Ward;

                var provincial = results.Provincial;
                var districts = results.District;
                var wards = results.Ward;

                if (results.BlockStatus == "ACTIVE") {
                    msg = "Câu hỏi này để Thani suy nghĩ đã. Bạn có muốn thảo luận với Thani các vấn đề khác không ? ";
                    quickReplies = [{
                        content_type: "text",
                        title: "Có chứ",
                        payload: "confirm",
                        image_url: SERVER_URL + "/img/OkLike.png"
                    }, {
                        content_type: "text",
                        title: "Hỗ trợ",
                        payload: "help",
                        image_url: SERVER_URL + "/img/helps.png"
                    }, {
                        content_type: "text",
                        title: "Hướng dẫn",
                        payload: "guide",
                        image_url: SERVER_URL + "/img/guide.png"
                    }];
                    sendQuickMessage(recipientId, msg, quickReplies);
                } else {
                    msg = "Câu hỏi này để Thani suy nghĩ đã. Bạn có muốn thảo luận với Thani các vấn đề khác không ? ";
                    quickReplies = [{
                        content_type: "text",
                        title: "Có chứ",
                        payload: "confirm",
                        image_url: SERVER_URL + "/img/OkLike.png"
                    }, {
                        content_type: "text",
                        title: "Hỗ trợ",
                        payload: "help",
                        image_url: SERVER_URL + "/img/helps.png"
                    }, {
                        content_type: "text",
                        title: "Hướng dẫn",
                        payload: "guide",
                        image_url: SERVER_URL + "/img/guide.png"
                    }];
                    sendQuickMessage(recipientId, msg, quickReplies);
                }
            } else {
                callGetProfile(recipientId, function (profile) {
                    console.log("Get profile: ", profile);
                    var obj = JSON.parse(profile);
                    msg = obj["last_name"] + " " + obj["first_name"] + " chưa là thành viên của hội hoạc bạn chưa thực hiện việc điểm danh, vậy chúng ta hãy làm quen bằng thủ tục điểm danh nhé.";
                    sendRegisterForm(recipientId, msg);
                    //objLog.Answer=msg;
                    ///saveLogs(objLog);
                    //sendMessageWelecome(senderID,msg);
                });
            }
            client.close();
            //res.send(results);

        });
    });
};

function sendKSV(recipientId) {

    var query = {
        _id: recipientId
    };
    //console.log("sendKSV findMembers", query);
    objDb.getConnection(function (client) {
        objDb.findMembers(query, client, function (results) {
            if (results.length == 1) {
                results = results[0];
                //console.log("findMembers:",results);
                var msg = "Bạn tên là : " + results.Name + ", chức vụ " + results.Position + ", trạng thái " + results.BlockStatus + " ,Tỉnh/TP :" + results.Provincial + " Quận/Huyện : " + results.District + " , Phường/Xã : " + results.Ward;

                //				var provincial = results.Provincial;
                //				var districts = results.District;
                //				var wards = results.Ward;
                ///// layerDelegatelayer- Delegate , được ủy quyền để tăng 1 cấp layer
                if (results.Delegate == null) {
                    results.Delegate = 0;
                }
                var layerDelegate = Number(results.Layer) - Number(results.Delegate);
                if (layerDelegate < 0) {
                    layerDelegate = 0; // chỉ cho Ủy quyền đến cấp admin
                }


                if (results.BlockStatus == "ACTIVE" && layerDelegate == results.Level) {
                    ///// layer = layerDelegate+1 để thấy dưới 1 cấp
                    //					var layer = layerDelegate + 1;
                    //					if (results.Level == 1 || results.Level == 0) {
                    //						provincial = 'NA';
                    //						districts = 'NA';
                    //						wards = 'NA';
                    //
                    //					}
                    //console.log("test","/botksv.bot?p="+provincial+"&d="+districts+"&w="+wards);
                    var button;
                    if (results.Level == 1 && results.Position == "Chủ tịch") {
                        button = [{
                            type: "web_url",
                            url: SERVER_URL + "/botnoksv.bot",
                            title: "Có",
                            messenger_extensions: true,
                            webview_height_ratio: "tall",
                            fallback_url: SERVER_URL + "/botnoksv.bot"
                        }];

                    } else {
                        button = [{
                            type: "web_url",
                            url: SERVER_URL + "/botksv.bot",
                            title: "Có",
                            messenger_extensions: true,
                            webview_height_ratio: "tall",
                            fallback_url: SERVER_URL + "/botksv.bot"
                        }];
                    }
                    msg = "Rất hân hạnh được làm việc cùng một " + results.Position + " như " + results.Name + ", chọn 'Có' để xem danh sách các Hội viên mà bạn cần xét duyệt. ";
                    sendButtonMessage(recipientId, msg, button);

                } else {
                    msg = "Tính năng xác thực Hội viên chỉ mở cho chức danh chủ tịch và đã được xác thực trước đó, nếu " + results.Name + " là chủ tịch mà chưa được xác thực vui lòng liên hệ cán bộ Hội cấp trên để được xác thực nhé! " + results.Name + " có muốn tiếp tục trò chuyện cùng Thani không?";
                    quickReplies = [{
                        content_type: "text",
                        title: "Có chứ",
                        payload: "confirm",
                        image_url: SERVER_URL + "/img/OkLike.png"
                    }, {
                        content_type: "text",
                        title: "Hỗ trợ",
                        payload: "help",
                        image_url: SERVER_URL + "/img/helps.png"
                    }, {
                        content_type: "text",
                        title: "Hướng dẫn",
                        payload: "guide",
                        image_url: SERVER_URL + "/img/guide.png"
                    }];
                    sendQuickMessage(recipientId, msg, quickReplies);
                }
            } else {
                callGetProfile(recipientId, function (profile) {
                    console.log("Get profile: ", profile);
                    var obj = JSON.parse(profile);
                    msg = obj["last_name"] + " " + obj["first_name"] + " chưa là thành viên của hội hoạc bạn chưa thực hiện việc điểm danh, vậy chúng ta hãy làm quen bằng thủ tục điểm danh nhé.";
                    sendRegisterForm(recipientId, msg);
                    //objLog.Answer=msg;
                    ///saveLogs(objLog);
                    //sendMessageWelecome(senderID,msg);
                });
            }
            client.close();
            //res.send(results);

        });
    });
};

function sendSellProduct(recipientId) {

    var query = {
        _id: recipientId
    };

    objDb.getConnection(function (client) {
        objDb.findMembers(query, client, function (results) {
            if (results.length == 1) {
                results = results[0];
                var provincial = results.Provincial;
                var districts = results.District;
                var wards = results.Ward;

                if (results.BlockStatus == "ACTIVE" && results.Level > 2) {
                    var msgSell = "Đầu ra cho sản phẩm luôn là một vấn đề phức tạp. Để nhận được sự tư vấn về đầu ra cho nông sản bạn hãy cung cấp thông tin vào form dưới nhé!";
                    sendMessageIProducts(recipientId, msgSell);

                } else {
                    var msg = "Tính năng bán nông sản chỉ mở cho những Hội viên cấp quận/huyện, phường/xã, chi hội đã được xác thực trước đó, " + results.Name + " vui lòng liên hệ cán bộ Hội cấp trên để được xác thực nhé! Bạn có muốn tiếp tục trò chuyện cùng Thani không?";
                    quickReplies = [{
                        content_type: "text",
                        title: "Có chứ",
                        payload: "confirm",
                        image_url: SERVER_URL + "/img/OkLike.png"
                    }, {
                        content_type: "text",
                        title: "Hỗ trợ",
                        payload: "help",
                        image_url: SERVER_URL + "/img/helps.png"
                    }, {
                        content_type: "text",
                        title: "Hướng dẫn",
                        payload: "guide",
                        image_url: SERVER_URL + "/img/guide.png"
                    }];
                    sendQuickMessage(recipientId, msg, quickReplies);
                    //endTextMessage(recipientId,msg);
                }
            } else {
                callGetProfile(recipientId, function (profile) {
                    console.log("Get profile: ", profile);
                    var obj = JSON.parse(profile);
                    msg = obj["last_name"] + " " + obj["first_name"] + " chưa là thành viên của hội hoạc bạn chưa thực hiện việc điểm danh, vậy chúng ta hãy làm quen bằng thủ tục điểm danh nhé.";
                    sendRegisterForm(recipientId, msg);

                });
            }
            client.close();
        });
    });
};

function sendUqKsv(recipientId) {

    var query = {
        _id: recipientId
    };
    //console.log("sendKSV findMembers", query);
    objDb.getConnection(function (client) {
        objDb.findMembers(query, client, function (results) {
            if (results.length == 1) {
                results = results[0];
                //console.log("findMembers:",results);

                if (results.BlockStatus == "ACTIVE" && results.Layer == results.Level) {
                    //var date= new Date(results.Birthday);
                    //var birthday = date.getDate()+'/'+(date.getMonth() + 1)+'/'+date.getFullYear();
                    var msg = "Mời " + results.Name + " sử dụng chức năng Ủy quyền KSV";

                    var button = [{
                        type: "web_url",
                        url: SERVER_URL + "/uqksv.bot?l=",
                        title: "Uỷ quyền KSV",
                        messenger_extensions: true,
                        webview_height_ratio: "tall",
                        fallback_url: SERVER_URL + "/uqksv.bot?l="
                    }];
                    //msg="Rất hân hạnh được làm việc cùng một "+results.Position+" như "+results.Name +", chọn 'Có' để xem danh sách các Hội viên mà bạn cần xét duyệt. ";
                    sendButtonMessage(recipientId, msg, button);
                } else {
                    callGetProfile(recipientId, function (profile) {
                        console.log("Get profile: ", profile);
                        var obj = JSON.parse(profile);
                        msg = obj["last_name"] + " " + obj["first_name"] + " không được cấp quyền KSV hoạc bạn chưa thực hiện việc điểm danh vậy nên bạn không có quyền dùng chức năng uỷ quyền KSV, vậy chúng ta hãy làm quen bằng thủ tục điểm danh nhé.";
                        sendRegisterForm(recipientId, msg);
                        //objLog.Answer=msg;
                        ///saveLogs(objLog);
                        //sendMessageWelecome(senderID,msg);
                    });
                }
            } else {
                callGetProfile(recipientId, function (profile) {
                    console.log("Get profile: ", profile);
                    var obj = JSON.parse(profile);
                    msg = obj["last_name"] + " " + obj["first_name"] + " không được cấp quyền KSV hoạc bạn chưa thực hiện việc điểm danh vậy nên bạn không có quyền dùng chức năng uỷ quyền KSV, vậy chúng ta hãy làm quen bằng thủ tục điểm danh nhé.";
                    sendRegisterForm(recipientId, msg);
                    //objLog.Answer=msg;
                    ///saveLogs(objLog);
                    //sendMessageWelecome(senderID,msg);
                });
            }
            client.close();
            //res.send(results);

        });
    });
};
function sendGuide(recipientId) {

    var elements = [{
        title: "Hướng dẫn ScanCode!",
        image_url: SERVER_URL + "/images/ns1.jpg",
        subtitle: "Hướng dẫn ScanCode để trò chuyện với Thani.",
        default_action: {
            type: "web_url",
            url: SERVER_URL + "/single.html?vid=AiN3rcsLnJQ&t",
            messenger_extensions: true,
            webview_height_ratio: "tall",
            fallback_url: SERVER_URL + "/single.html?vid=AiN3rcsLnJQ&t"
        },
        buttons: [{
            type: "web_url",
            url: SERVER_URL + "/single.html?vid=AiN3rcsLnJQ&t",
            title: "Xem ngay"
        }]
    }, {
        title: "Hướng dẫn điểm danh!",
        image_url: SERVER_URL + "/images/ns5.jpg",
        subtitle: "Hướng dẫn điền Form Điểm danh - Thani.",
        default_action: {
            type: "web_url",
            url: SERVER_URL + "/single.html?vid=vOLdysL32NU&t",
            messenger_extensions: true,
            webview_height_ratio: "tall",
            fallback_url: SERVER_URL + "/single.html?vid=vOLdysL32NU&t"
        },
        buttons: [{
            type: "web_url",
            url: SERVER_URL + "/single.html?vid=vOLdysL32NU&t",
            title: "Xem ngay"
        }]
    }, {
        title: "Hướng dẫn KSV!",
        image_url: SERVER_URL + "/images/ns2.jpg",
        subtitle: "Hướng dẫn sử dụng tính năng KSV - Thani.",
        default_action: {
            type: "web_url",
            url: SERVER_URL + "/single.html?vid=XwMqLYd5Qeg&t=2s",
            messenger_extensions: true,
            webview_height_ratio: "tall",
            fallback_url: SERVER_URL + "/single.html?vid=XwMqLYd5Qeg&t=2s"
        },
        buttons: [{
            type: "web_url",
            url: SERVER_URL + "/single.html?vid=XwMqLYd5Qeg&t=2s",
            title: "Xem ngay"
        }]
    }, {
        title: "Hướng dẫn đăng nông sản!",
        image_url: SERVER_URL + "/images/ns3.jpg",
        subtitle: "Hướng dẫn điền Form Nông sản - Thani.",
        default_action: {
            type: "web_url",
            url: SERVER_URL + "/single.html?vid=k3OENdwLHVI&t",
            messenger_extensions: true,
            webview_height_ratio: "tall",
            fallback_url: SERVER_URL + "/single.html?vid=k3OENdwLHVI&t"
        },
        buttons: [{
            type: "web_url",
            url: SERVER_URL + "/single.html?vid=k3OENdwLHVI&t",
            title: "Xem ngay"
        }]
    }, {
        title: "Hướng dẫn UQKSV!",
        image_url: SERVER_URL + "/images/ns4.jpg",
        subtitle: "Hướng dẫn sử dụng tính năng UQKSV - Thani.",
        default_action: {
            type: "web_url",
            url: SERVER_URL + "/single.html?vid=u9uSoX-T8hY",
            messenger_extensions: true,
            webview_height_ratio: "tall",
            fallback_url: SERVER_URL + "/single.html?vid=u9uSoX-T8hY"
        },
        buttons: [{
            type: "web_url",
            url: SERVER_URL + "/single.html?vid=u9uSoX-T8hY",
            title: "Xem ngay"
        }]
    }

    ];
    //console.log("HElp",elements);
    sendGenericMessage(recipientId, elements);

};

function receivedMessage(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;
    let response;
    console.log("Received message for user %d and page %d at %d with message:",
        senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));
    var isEcho = message.is_echo;
    var messageId = message.mid;
    var appId = message.app_id;
    var metadata = message.metadata;
    // You may get a text or attachment but not both
    var messageText = message.text;
    var messageAttachments = message.attachments;
    var quickReply = message.quick_reply;
    var msg = "x";

    if (isEcho) {
        // Just logging message echoes to console
        console.log("Received echo for message %s and app %d with metadata %s",
            messageId, appId, metadata);
        return;
    } else if (quickReply) {
        var quickReplyPayload = quickReply.payload;
        console.log("Quick reply for message %s with payload %s",
            messageId, quickReplyPayload);
        switch (quickReplyPayload.toLowerCase()) {
            case 'gddb2':
                msg = 'Hiện nay, Việt Nam đang thiếu hàng nghìn giáo viên Giáo dục đặc biệt, một phần do tính chất nghề nghiệp vất vả, một phần do thiếu sự chung tay của xã hội. ' +
                      'Chương trình "Viết về thầy cô giáo dục đặc biệt" được tổ chức nhằm tôn vinh các Thầy cô giáo đang ngày ngày âm thầm chăm sóc học sinh khuyết tật. Đồng thời truyền cảm hứng để kêu gọi sự chung tay giúp đỡ của trong xã hội. Bạn sẽ tham gia ngay chứ ?';
                quick_replies = [{
                    content_type: "text",
                    title: "Tham gia",
                    payload: "confirm",
                    image_url: SERVER_URL + "/img/ok.png"
                }, {
                    content_type: "text",
                    title: "Để sau",
                    payload: "desau",
                    image_url: SERVER_URL + "/img/cancel2.png"
                }];
                sendQuickMessage(senderID, msg, quick_replies);
                break;
            case 'desau':
                sendMessageWelecome(senderID, "");
                break;
            case 'thele':
                msg = "Dưới đây là thể lệ cuộc thi, bạn hãy xem qua để có thể viết một bài viết tuyệt vời nhé!";
                sendTextMessage(senderID, msg);
                file_loc = __dirname + "/public/img/thele.jpg";
                sendFileThele(senderID, msg, "image", file_loc);
                break;
            case 'guibaiviet':
                msg = "Thật tuyệt khi vẫn luôn có những tấm lòng quan tâm đến giáo dục đặc biệt. Chúng ta bắt đầu ngay nhé!";
                sendMessageDienThongTin(senderID, msg);
                break;
            case 'dienthongtin':
                msg = "Bạn vui lòng cho cung cấp thông tin cá nhân để Chương trình có thể tri ân vào trao giải nhé";
                var button = [{
                    type: "web_url",
                    url: SERVER_URL + "/document?psid=" + senderID,
                    title: "Thông tin",
                    messenger_extensions: true,
                    webview_height_ratio: "tall",
                    fallback_url: SERVER_URL + "/document?psid=" + senderID
                }];
                sendButtonMessage(senderID, msg, button);
                break;
            case 'guibai':
                msg = "Giờ bạn vui lòng gửi bài viết tại đây nhé! Lưu ý: Không giới hạn số lượng bài viết gửi về. Có thể viết ra Google Doc và đính kèm link. Khuyến khích có hình ảnh minh họa";
                var button = [{
                    type: "web_url",
                    url: SERVER_URL + "/senddocument?psid=" + senderID,
                    title: "Gửi bài viết",
                    messenger_extensions: true,
                    webview_height_ratio: "tall",
                    fallback_url: SERVER_URL + "/senddocument?psid=" + senderID
                }];
                sendButtonMessage(senderID, msg, button);
                break;
            case 'baiviethay':
                msg = "Cùng Thani xem qua bài viết gây được nhiều chú ý trong thời gian qua nhé!";
                //sendBaiVietHay(senderID, msg);
                var button = [{
                    type: "web_url",
                    url: SERVER_URL + "/baiviethay.html",
                    title: "Xem ngay",
                    messenger_extensions: true,
                    webview_height_ratio: "tall",
                    fallback_url: SERVER_URL + "/baiviethay.html"
                }, {
                    type: 'postback',
                    title: 'Quay lại',
                    payload: 'tieptuc',
                }];
                sendButtonMessage(senderID, msg, button);
                break;
            case 'binhchon':
                msg = "Tính năng bình chọn đang được hoàn thiện. Thani sẽ liên hệ lại với bạn trong thời gian sớm nhất.";
                quick_replies = [{
                    content_type: "text",
                    title: "Thể lệ",
                    payload: "thele",
                    image_url: SERVER_URL + "/img/thele.png"
                }, {
                    content_type: "text",
                    title: "Gửi bài viết",
                    payload: "guibaiviet",
                    image_url: SERVER_URL + "/img/guibaiviet.png"
                }, {
                    content_type: "text",
                    title: "Bài viết hay",
                    payload: "baiviethay",
                    image_url: SERVER_URL + "/img/baiviethay.png"
                }, {
                    content_type: "text",
                    title: "Bình chọn",
                    payload: "binhchon",
                    image_url: SERVER_URL + "/img/binhchon.png"
                }];
                sendQuickMessage(senderID, msg, quick_replies);
                break;
            case 'tieptuc':
                msg = "";
                sendMessageWelecome(senderID, msg);
                break;
            case 'dunglai':
                msg = "Ohh! Thật tiếc khi không được tiếp tục trò chuyện cùng bạn. Thani sẽ đưa các thông tin về chương trình tới bạn sau nhé. Chúc bạn một ngày vui vẻ! Form Thani with Love <3";
                sendTextMessage(senderID, msg);
                break;
            case 'confirm':
                msg = "Chúng ta tiếp tục nhé";
                sendMessageAccept(senderID, msg);
                break;
            //case 'guide':
            //    sendGuide(senderID);
            //    break;
            default:
                sendMessageWelecome(senderID, "");
                break;
        }
        return;
    }
    if (messageText) {
        // If we receive a text message, check to see if it matches any special
        // keywords and send back the corresponding example. Otherwise, just echo
        // the text we received.	
        var mydate = new Date();
        var inputDate = new Date(mydate.toISOString());
        var objLog = {
            "SenderID": senderID,
            "Question": messageText,
            "Answer": msg,
            "InsertDay": inputDate
        };
        switch (messageText.toLowerCase()) {
            case 'restart':
                callGetProfile(senderID, function (profile) {
                    console.log("Get profile: ", profile);
                    var obj = JSON.parse(profile);
                    msg = "Chúc mừng " + obj["last_name"] + " " + obj["first_name"] + " đã kết nối vào hệ thống!";
                    objLog.Answer = msg;
                    //saveLogs(objLog);
                    sendMessageWelecome(senderID, msg);
                });
                break;
            case 'bắt đầu':
                callGetProfile(senderID, function (profile) {
                    //console.log("Res Post facebook 3", profile);
                    var obj = JSON.parse(profile);
                    msg = "Chúc mừng " + obj["last_name"] + " " + obj["first_name"] + " đã kết nối vào hệ thống!";
                    objLog.Answer = msg;
                    //saveLogs(objLog);
                    sendMessageWelecome(senderID, msg);
                });
                break;
            case 'help':
                callGetProfile(senderID, function (profile) {
                    //console.log("Res Post facebook 3", profile);
                    var obj = JSON.parse(profile);
                    msg = obj["last_name"] + " " + obj["first_name"] + " đã liên hệ !";
                    objLog.Answer = msg;
                    //saveLogs(objLog);
                    sendMessageWelecome(senderID, msg);
                });
                break;
            case 'giúp đỡ':
                callGetProfile(senderID, function (profile) {
                    //console.log("Res Post facebook 3", profile);
                    var obj = JSON.parse(profile);
                    msg = obj["last_name"] + " " + obj["first_name"] + " đã liên hệ!";
                    objLog.Answer = msg;
                    //saveLogs(objLog);
                    sendMessageWelecome(senderID, msg);
                });
                break;
            case 'tiếp tục':
                sendMessageWelecome(senderID, "");
                break;
            default:
                sendMessageWelecome(senderID, "");
                break;
            //getAnswer(messageText, function (aiMes) {
            //    if (aiMes.length > 0) {
            //        //console.log("GetAnswer 2:", aiMes[0].Answer);
            //        //var obj = JSON.parse(profile);
            //        //var msg = "Chúc mừng " + obj["last_name"] + " " + obj["first_name"] + " đã kết nối vào hệ thống!";
            //        //sendTextMessage(senderID, 'Echo:' + messageText);
            //        msg = aiMes[0].Answer;
            //        objLog.Answer = msg;
            //        saveLogs(objLog);
            //        //sendTextMessage(senderID,msg);
            //        msg = msg + ". Bạn có muốn tiếp tục nói chuyện với Thani không ?";
            //        quickReplies = [{
            //            content_type: "text",
            //            title: "Có chứ",
            //            payload: "confirm",
            //            image_url: SERVER_URL + "/img/OkLike.png"
            //        }];
            //        sendQuickMessage(senderID, msg, quickReplies);
            //    } else {
            //        sendNoReply(senderID);
            //    }
            //});
            //break;
        }
    } else if (messageAttachments) {
        sendTextMessage(senderID, "Message with attachment received");
    }
}

//////WebView Facebook

function setupGreetingText(res) {
    var messageData = {
        "greeting": [{
            "locale": "default",
            "text": "Chúc mừng bạn đã kết nối vào hệ thống !"
        }, {
            "locale": "en_US",
            "text": "Welecom"
        }]
    };
    request({
        url: 'https://graph.facebook.com/v3.0/me/messenger_profile?access_token=' + PAGE_ACCESS_TOKEN,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        form: messageData
    },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log("setupGreetingText:", body);

            } else {
                // TODO: Handle errors
                console.log("setupGreetingText:", body);
            }
        });

}

function setupPersistentMenu(res) {
    var messageData = {
        "persistent_menu": [{
            "locale": "default",
            composer_input_disabled: false,
            "call_to_actions": [{
                "title": "Hỗ trợ",
                "type": "nested",
                "call_to_actions": [{
                    "title": "Điểm danh",
                    "type": "postback",
                    "payload": "Điểm danh"
                }, {
                    "type": "web_url",
                    "title": "Trang chủ",
                    "url": "https://www.kyc.net.vn",
                    "webview_height_ratio": "full"
                }]
            }]
        }]
    };
    // Start the request
    request({
        url: "https://graph.facebook.com/v3.0/me/messenger_profile?access_token=" + PAGE_ACCESS_TOKEN,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        form: messageData
    },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                res.send(body);

            } else {
                // TODO: Handle errors
                res.send(body);
            }
        });

};

function setupGetStartedButton(res) {
    var messageData = {
        "get_started": {
            "payload": "getstarted"
        }
    };
    // Start the request
    request({
        url: "https://graph.facebook.com/v3.0/me/messenger_profile?access_token=" + PAGE_ACCESS_TOKEN,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        form: messageData
    },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log("setupGetStartedButton:", body);

            } else {
                // TODO: Handle errors
                console.log("setupGetStartedButton:", body);
            }
        });
};

function writeFileToGoogleDrive(fileName, data, newPath, psid, callback) {
    console.log("writeFileProduct: writeFile", newPath + "/" + fileName);
    try {
        var buf = new Buffer(data, 'base64');
        console.log("writeFileProduct: read buf");
        var res;
        fs.writeFile(newPath + "/" + fileName, buf, function (err) {
            if (err) {
                console.log("writeFileProduct error :", err);
                callback(err, res);
            } else {

                console.log('File is uploaded :', newPath + "/" + fileName);
                cloudinary.v2.uploader.upload(newPath + "/" + fileName, {
                    public_id: "Product/" + fileName.replace('.', '')
                },
                    function (error, result) {

                        fs.unlink(newPath + "/" + fileName, function (error) {
                            if (error) {
                                console.log("writeFileProduct cloudinary.v2.uploader error :", error);
                            }
                            console.log('Deleted : ', newPath + "/" + fileName);
                        });
                        callback(error, result);
                        console.log("Cloudinary:", result)
                    });
            }
        });
    } catch (err) {

        console.error("writeFileProduct:", err);
    }
};
function writeFile(fileName, data, newPath, psid, callback) {

    console.log("writeFile: writeFile : ", newPath + "/" + fileName);
    try {
        var buf = new Buffer(data, 'base64');
        console.log("writeFile: read buf");
        var res;
        fs.writeFile(newPath + "/" + fileName, buf, function (err) {
            if (err) {
                console.log("writeFile error :", err);
                callback(err, res);
            } else {
                console.log('File is uploaded :', newPath + "/" + fileName);
                cloudinary.v2.uploader.upload(newPath + "/" + fileName, {
                    public_id: "Avatar/" + psid
                },
                    function (error, result) {

                        fs.unlink(newPath + "/" + fileName, function (error) {
                            if (error) {
                                console.log("cloudinary.v2.uploader :", error);
                            }
                            console.log('Deleted : ', newPath + "/" + fileName);
                        });
                        callback(error, result);
                        console.log("Cloudinary:", result)
                    });
            }
        });
    } catch (err) {

        console.error("writeFile:", err);
    }

};

function writeFileProduct(fileName, data, newPath, psid, callback) {
    console.log("writeFileProduct: writeFile", newPath + "/" + fileName);
    try {
        var buf = new Buffer(data, 'base64');
        console.log("writeFileProduct: read buf");
        var res;
        fs.writeFile(newPath + "/" + fileName, buf, function (err) {
            if (err) {
                console.log("writeFileProduct error :", err);
                callback(err, res);
            } else {

                console.log('File is uploaded :', newPath + "/" + fileName);
                cloudinary.v2.uploader.upload(newPath + "/" + fileName, {
                    public_id: "Product/" + fileName.replace('.', '')
                },
                    function (error, result) {

                        fs.unlink(newPath + "/" + fileName, function (error) {
                            if (error) {
                                console.log("writeFileProduct cloudinary.v2.uploader error :", error);
                            }
                            console.log('Deleted : ', newPath + "/" + fileName);
                        });
                        callback(error, result);
                        console.log("Cloudinary:", result)
                    });
            }
        });
    } catch (err) {

        console.error("writeFileProduct:", err);
    }

};
////// Mở port lắng nghe 
// Start server
// Webhooks must be available via SSL with a certificate signed by a valid 
// certificate authority.
server.listen(server.get('port'), function () {
    console.log('Node app is running on port ', server.get('port'));
});

module.exports = server;
