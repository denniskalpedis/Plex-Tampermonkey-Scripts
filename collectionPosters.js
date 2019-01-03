// ==UserScript==
// @name        plex Collection Posters
// @namespace   Plex.tv
// @include     http*://<Private IP to access Plex>:32400/*
// @include     http*://app.plex.tv/*
// @version     1
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require     https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// ==/UserScript==

var tmdbAPI = "<TheMovieDB API KEY HERE>";
// set fanArt to false to not use it.
// I don't have a working FanART API KEY, can't test. (should work!)
var fanArt = false;
var fanArtAPI = "<FanArt API KEY HERE>";
var language = "en";
// posible poster sizes w92, w154, w185, w342, w500, w780, original
// this is the poster size it downloads to save to plex from TheMovieDB
var posterSize = "w342";
var checking = false;

$('body').arrive('.artwork-options-list', function(){
    $(this).arrive('.poster', {onceOnly:true}, function(){
        // might be overkill, but want to make sure you are in a collection edit window
        if($(".poster-btn").hasClass("selected") && $(".modal-nav-list").children().length === 6 && $.trim($(".modal-nav-list").children()[2].textContent) === "Poster"){
            let name = encodeURI($(".modal-title").html().split("Edit ")[1]);
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://api.themoviedb.org/3/search/collection?api_key=" + tmdbAPI + "&language=" + language + "&query=" + name + "&page=1",
                "method": "GET",
                "headers": {},
                "data": "{}"
            }
            // was having a weird issue where it ran multiple times this check just lets it run the api calls once.
            if(!checking){
                checking = true;
                // first call to TMDB to get collection ID
                $.ajax(settings).done(function (response) {
                    settings.url = "https://api.themoviedb.org/3/collection/" + response.results[0].id + "/images?api_key=" + tmdbAPI + "&language=" + language;
                    // second call to TMDB to get collection posters
                    $.ajax(settings).done(function (response) {
                        for(let i = 0; i < response.posters.length; i++){
                            $('.artwork-options-list').append('<span class="poster"><a class="artwork-option media-poster-container" data-rating-key="https://image.tmdb.org/t/p/' + posterSize + response.posters[i].file_path + '" href="#"> <div class="media-poster"><img class="media-poster-image loaded" src="https://image.tmdb.org/t/p/w154' + response.posters[i].file_path + '"></div> </a> </span>')
                        }
                        if(fanArt){
                           settings.url = "https://webservice.fanart.tv/v3/movies/" + response.id + "?api_key=" + fanArtAPI;
                            $.ajax(settings).done(function (response) {
                                $('.artwork-options-list').append('<span class="poster"><a class="artwork-option media-poster-container" data-rating-key="' + response.movieposter[i].url + '" href="#"> <div class="media-poster"><img class="media-poster-image loaded" src="' + response.movieposter[i].url.replace("fanart", "preview") + '"></div> </a> </span>')
                            });
                        }
                        checking = false;
                    });
                });
            }
        }
    });


});