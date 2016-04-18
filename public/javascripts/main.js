var voicelist = responsiveVoice.getVoices();

$(document).ready(function() {
    $("body").attr("class", "loaded");

    var speeches = [];
    readTextFile("/speech.txt", function(lines){
        lines.forEach(function(line){
            speeches.push(line);
        });
    });

    function getDataUri(url, callback) {
        var image = new Image();

        image.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.width = this.naturalWidth;
            canvas.height = this.naturalHeight;

            canvas.getContext('2d').drawImage(this, 0, 0);

            callback(canvas.toDataURL('image/png'));
        };

        image.src = url;
    }

    setTimeout( 
        function(){
            assetList.forEach(function(assetName, key){
                assets[assetName].forEach(function(value, index){
                    src = value;
                    if(value.split(".").pop() != "gif"){
                        getDataUri(src, function(dataUri) {
                            assets[assetName][index] = dataUri;
                        });
                    }
                });
            });
        }, 0 );
    
    
    
/*
    
        $("a span").bind("click", function() {
            //$(".overlay").fadeOut(500);
            $("body").attr("class", "loaded");
        });
    */

    $(function() {

          $.each(voicelist, function() {
            $(".languages").append($("<option />").val(this.name).text(this.name));
          });

        possibilities = 0;
        assetList.forEach(function(value, index) {
            length = assets[value].length;
            if (possibilities == 0) {
                possibilities = length;
            } else {
                possibilities *= length;
            }
        });
        $("#possibilities").html(possibilities + " possibilities !!!");

        $("#accordion").accordion();

        new clipboard('.btn');

        $(".draggable").draggable();
/*
        $("#hue-slider").slider({
            range: "max",
            min: 0,
            max: 360,
            value: 1,
            slide: function(event, ui) {
                $(".imgContainer").css({
                    "filter": "hue-rotate(" + ui.value + "deg)",
                    "-webkit-filter": "hue-rotate(" + ui.value + "deg)",
                    "-moz-filter": "hue-rotate(" + ui.value + "deg)",
                })
            }
        });
        */
    });

    //var audio = new Audio('/sounds/pwet.mp3');

    $(".controller button").bind("click", function() {
        /*
            audio.pause();
            audio.currentTime = 0;
            audio.play();
        */

        attrClass = $(this).attr("class").split("-").pop()
        id = $("." + attrClass).attr("id").split("-").pop();
        container = $("." + attrClass + "Container");
        img = $("." + attrClass + "Container img");
        type = $(this).attr("class").split("-").shift();
        array = assets[attrClass];
        flip = container.attr("flipped");
        transform = "";
        rotation = parseInt(img.attr("rotate"));

        switch(type){
        	case "next":
            	id = getNextIndex(array, id);
            break;
        	case "prev":
            	id = getPreviousIndex(array, id);
            break;
        	case "up":
            	img.css("margin-top", '-=3');
            break;
        	case "down":
            	img.css("margin-top", '+=3');
            break;
        	case "left":
            	img.css("margin-left", '-=2');
            break;
        	case "right":
            	img.css("margin-left", '+=2');
            break;
        	case "zoom":
            	img.css("width", '+=7');
            break;
        	case "unzoom":
            	img.css("width", '-=7');
            break;
        	case "rotClock":
            	rotation += 1;
            break;
        	case "rotAnt":
            	rotation -= 1;
            break;
        	case "front":
	            zIndex = parseInt(container.css("z-index"));
	            zIndex += 1;
	            container.css("z-index", zIndex);
            break;
            case "back":
	            zIndex = parseInt(container.css("z-index"));
	            zIndex -= 1;
	            container.css("z-index", zIndex);
            break;
            case "random":
	            length = array.length;
	            id = Math.floor((Math.random() * length) + 0);
            break;
            case "flipX":
	            if (!container.attr("flipped") || container.attr("flipped") == "false") {
	                flip = "true";
	            } else {
	                flip = "false";
	            }
	            container.attr("flipped", flip);
            break;
        }

        transform = "rotate(" + rotation + "deg)";
        if (flip == "true") {
            transform += " scaleX(-1)";
        }
        container.css("transform", transform);

        draw(img, attrClass, array, id, rotation);
    });

    $("#save").bind("click", function() {

        swal({
                title: "You are about to get kanker!",
                text: "Is that what you really want ?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#A5DC86",
                confirmButtonText: "Yes, kankerize me please",
                closeOnConfirm: false,
                imageUrl: "images/Reinold.png"
            },
            function() {
                html2canvas($('.imgContainer'), {
                    onrendered: function(canvas) {
                        image = canvas.toDataURL("application/octet-stream");
                        var a = $("<a>")
                            .attr("href", image)
                            .attr("download", makeid(10) + ".png")
                            .appendTo("body");
                        a[0].click();
                        a.remove();
                    }
                });
                swal("Congratulation!", "You are now the proud owner of your very own kankerous kanker!", "success");
            });
    });

    $("#upload").bind("click", function() {
        swal({
            title: "Do you wish to upload this on Imgur ?",
            text: "Do you really want to share you kanker you cold-hearted bastard ?",
            type: "info",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
        }, function() {

            html2canvas($('.imgContainer'), {
                onrendered: function(canvas) {
                    image = canvas.toDataURL("image/png");
                    data = image.split(",").pop()
                    name = makeid(10) + ".png";


                    $.ajax({
                        url: 'https://api.imgur.com/3/image',
                        method: 'POST',
                        headers: {
                            Authorization: 'Client-ID ' + '0e2db3dc0e718a5',
                            Accept: 'application/json'
                        },
                        data: {
                            image: data,
                            type: "base64"
                        },
                        success: function(result) {
                            var url = 'https://imgur.com/gallery/' + result.data.id;
                            swal({
                                title: "Upload complete!",
                                text: "<a id='link' href='" + url + "' target='_blank'>" + url + "</a><button class='btn' data-clipboard-target='#link'>Copy</button>",
            					closeOnConfirm: false,
                                html: true
                            });
                        },
                        error: function(result) {
                            swal("Error", "Ded.json", "error");
                        },
                    });
                }
            });
        });
    });

    function readTextFile(file, callback)
    {
        $.ajax({
            url: file,
            type: "GET", 
            success: function(data){
                lines = data.split('\n');
                callback(lines);
            }
        });
    }

    $(".shuffle").bind("click", function() {
        idSpeech = Math.floor((Math.random() * speeches.length) + 0);
        text = speeches[idSpeech];

        idLang = Math.floor((Math.random() * voicelist.length) + 0);
        lang = voicelist[idLang].name;
        speak(text, lang);

        assetList.forEach(function(value, index) {
            length = assets[value].length;
            id = Math.floor((Math.random() * length) + 0);
            attrClass = value;
            container = $("." + attrClass + "Container");
            img = $("." + attrClass + "Container img");
            rotation = 0;

            container.css({
                "transform": "rotate(0deg)"
            })
            img.css({
                "width": "500px",
                "margin": "0",
                "left": "0",
                "right": "0"
            })

            draw(img, attrClass, assets[value], id, rotation);

        });
    });

    $("#speak").bind("click", function(){
        var lang = $('select.languages option:selected').text();
        var text = $(".textsContainer p").text();
        if(text != ""){
            text = text;
            lang = lang;
            speak(text, lang);
        }
    });

    function speak(text, lang){
        responsiveVoice.cancel();
        responsiveVoice.speak(text, lang);
    }

    function makeid(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function getNextIndex(array, id) {
        if (id == array.length - 1) {
            id = 0;
        } else {
            id++;
        }
        return id;
    }

    function getPreviousIndex(array, id) {
        if (id == 0) {
            id = array.length - 1;
        } else {
            id--;
        }
        return id;
    }

    function draw(img, attrClass, array, id, rotation) {
        img
            .attr("src", array[id])
            .attr("id", attrClass + '-' + id)
            .attr("class", attrClass)
            .attr("rotate", rotation);
    }

});
