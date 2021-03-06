var express = require('express');
var router = express.Router();
var request = require('request').defaults({ encoding: null }), 
    fs      = require('fs');
var func = require(__dirname+"/../public/javascripts/functions");
var url = 'http://upload.wikimedia.org/wikipedia/commons/8/8c/JPEG_example_JPG_RIP_025.jpg';
var images = require("images");
var http = require('http');
var easyimg = require('easyimage');
var DataUri = require('datauri').sync;

router.get('/', function(req, res, next) {

	var myAssets = [];
	var assets = func.listDirectories("/images/Assets");
	
	assets.forEach(function(asset, key){
		console.log(__dirname+"/../public/images/Assets/"+asset);
		myAssets.push({name: asset, list: func.getAllFilesPathFromFolder(__dirname+"/../public/images/Assets/"+asset)});
	});
	
	res.render('index', {assets: myAssets, assetList: assets});

});

router.get('/api', function(req, res, next) {

	var myAssets = [];
	var assets = func.listDirectories("/images/Assets");

	assets = ["bases", "eyes", "mustaches", ]; 
	
	assets.forEach(function(asset){
		myAssets.push({name: asset, list: func.getAllFilesFromFolder(__dirname+"/../public/images/Assets/"+asset)});
	});
	console.log(myAssets);

	func.generateImage(myAssets, assets, function(){
		var img = fs.readFileSync("public/images/crop.png");
		res.writeHead(200, {'Content-Type': 'image/png'});
		res.end(img, 'binary');
	});
});

router.get('/image/:idImage', function(req, res, next) {

	var idImage = req.params.idImage;
	res.render('image', {idImage: idImage});
});

module.exports = router;