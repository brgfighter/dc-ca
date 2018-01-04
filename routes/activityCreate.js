'use strict';
var https = require('https');
var activityUtils = require('./activityUtils');
/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {
  // Data from the req and put it in an array accessible to the main app.
  //console.log( req.body );
  activityUtils.logData(req);
  res.send(200, 'Edit');
};
/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
  // Data from the req and put it in an array accessible to the main app.
  //console.log( req.body );
  activityUtils.logData(req);
  res.send(200, 'Save');
};
/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {
  // Data from the req and put it in an array accessible to the main app.
  //console.log( req.body );
  activityUtils.logData(req);
  res.send(200, 'Publish');
};
/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {
  // Data from the req and put it in an array accessible to the main app.
  // console.log( req.body );
  activityUtils.logData(req);
  res.send(200, 'Validate');
};
/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {
  // Data from the req and put it in an array accessible to the main app.
  activityUtils.logData(req);

　var aArgs = req.body.inArguments;
  var oArgs = {};
  for (var i = 0; i < aArgs.length; i++) {
    for (var key in aArgs[i]) {
      oArgs[key] = aArgs[i][key];
    }
  }
  //エントリソースのコンタクトキーを取得
　var ckey = req.body.keyValue;
  var uid;
  //JB上で設定したシナリオIDを取得
  var priority = oArgs.priority;
  var FuelSoap = require('fuel-soap');
  var options = {
    auth: {
      clientId: '15viko9owr33w8clp268l5c7',
      clientSecret: 'J90FCA4OKh1zaRe9vZn4NYTL'
    },
  //エンドポイントはスタックによって変える
    soapEndpoint: 'https://webservice.s10.exacttarget.com/Service.asmx'
  };
  var SoapClient = new FuelSoap(options);
  var op = {
    filter: {
      leftOperand: 'Sub_key',
      operator: 'equals',
      rightOperand: ckey
    }
  };
  SoapClient.retrieve(
    //DEの構成通りに配列を記述すること。DEのカスタムキーをDE名と同じにしておくこと、
    'DataExtensionObject[TEST_GDO_DE]', ["Sub_key", "uid", "ScenarioID"], op,
    function (err, response) {
      if (err) {
        console.log(err);
      } else {
        var prop = response.body.Results[0].Properties.Property[1];
        for (key in prop) {
          uid = prop[key];　　　　
          if (uid != "uid") {　　　　　　
            var webclient = require("request");　
            webclient.get({　　
              url: "https://master.laborot.com/api/push",
              qs: {
                uid: uid,
                scenarioid: priority
              }
            }, function (error, response, body) {
              console.log(body);
            });
          }
        }
      }
    });
　//サンプルのためケースIDは偽装
  res.send(200, {
    "caseID": "12345"
  });
};
