var fs = require('fs');
var path = require('path');
var images = require('images');
var easyimg = require('easyimage');
var DataUri = require('datauri').sync;

var getAllFilesFromFolder = function(dir) {

    var filesystem = require("fs");
    var results = [];

    filesystem.readdirSync(dir).forEach(function(file) {

        file = dir+'/'+file;
        extension = file.split('.').pop();
        var stat = filesystem.statSync(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(getAllFilesFromFolder(file))
        }
        else{
            if( extension == "png" ){
               // var file = file.split("/").pop();

                results.push(DataUri(file));
            }
        }

    });

    return results;

};

var listDirectories = function(srcpath) {
    srcpath = __dirname+"/../"+srcpath;
    return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}

var makeId = function(length)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var generateImage = function(assets, assetList, callback){

    image = images(__dirname+"/../images/Assets/backgrounds/1.png");

    assets.forEach(function(asset){
        length = asset.list.length;
        id = Math.floor((Math.random() * length) + 0);
        image = image.draw(images(__dirname+"/../images/Assets/"+asset.name+"/"+asset.list[id]),0,0);
    });

    image.save("public/images/kanker.png");

    easyimg.crop({
        src: "public/images/kanker.png",
        dst: "public/images/crop.png",
        cropwidth: 230,
        cropheight: 310
    });
    callback();
}

exports.generateImage = generateImage;
exports.getAllFilesFromFolder = getAllFilesFromFolder;
exports.listDirectories = listDirectories;
exports.makeId = makeId;