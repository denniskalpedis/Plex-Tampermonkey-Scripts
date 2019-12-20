// ==UserScript==
// @name        plex Collection Posters
// @namespace   Plex.tv
// @include     http*://<Private IP to access Plex>:32400/*
// @include     http*://app.plex.tv/*
// @version     1.5
// @grant       none
// @updateURL    https://raw.githubusercontent.com/denniskalpedis/Plex-Tampermonkey-Scripts/master/collectionPosters.js
// @downloadURL  https://raw.githubusercontent.com/denniskalpedis/Plex-Tampermonkey-Scripts/master/collectionPosters.js
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require     https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// ==/UserScript==

const tmdbAPI = "<TheMovieDB API KEY HERE>";
// set fanArt to false to not use it.
const fanArt = false;
const fanArtAPI = "<FanArt API KEY HERE>";
const thePosterDB = true;
const language = "en";
// posible poster sizes w92, w154, w185, w342, w500, w780, original
const posterSize = "w342";
// possible background sizes w300, w780, w1280, original
const backdropSize = "original";
let tmdbResults;
let fanartResults;
let TPDBResults = [];
let summary;
$('body').leave('.modal-dialog', function () {
    tmdbResults = undefined;
    fanartResults = undefined;
    summary = undefined;
});
$('body').arrive('.modal-body-pane .edit-metadata-form', function () {
    if($('.edit-metadata-form').children().length == 3 && $('.edit-metadata-form label').last().html() == "Summary"){
        if (summary && $('#text-summary').html() == '') {
            updateSummary();
        } else if($('#text-summary').html() == '') {
            hitAPIs(updateSummary);
        } else if (!tmdbResults){
            hitAPIs(function(){});
        }
        function updateSummary(){
            $('#text-summary').html(summary);
        }
    }
});
$('body').arrive('.artwork-options-list', function () {
    if ($('.art-btn').hasClass("selected") && $(".modal-nav-list").children().length === 6 && $.trim($(".modal-nav-list").children()[2].textContent) === "Poster") {
        if (tmdbResults) {
            updateBackgrounds();
        } else {
            hitAPIs(updateBackgrounds);
        }
    }
    $(this).arrive('.poster [data-rating-key="default://"]', function () {
        if ($(".poster-btn").hasClass("selected") && $(".modal-nav-list").children().length === 6 && $.trim($(".modal-nav-list").children()[2].textContent) === "Poster") {
            if (tmdbResults) {
                updatePosters();
            } else {
                hitAPIs(updatePosters);
            }
        }
    });
    

    function updatePosters() {
        if (tmdbResults != "nope" && !tmdbResults.results && tmdbResults.posters.length != 0) {
            if (tmdbResults.posters[0].file_path[0] === "/") {
                let results = tmdbResults.posters.map(i => 'https://image.tmdb.org/t/p/' + posterSize + i.file_path);
                for (let i = 0; i < results.length; i++) {
                    $('.artwork-options-list').append('<span class="poster"><a class="artwork-option media-poster-container" data-rating-key="' + results[i] + '" href="#"> <div class="media-poster"><img class="media-poster-image loaded" src="' + results[i].replace(posterSize, "w154") + '"></div> </a> </span>')
                }
            }
            if (fanartResults && fanartResults.movieposter){
                if (fanartResults.movieposter.length != 0) {
                    let results = fanartResults.movieposter.map(i => i.url);
                    for (let i = 0; i < results.length; i++) {
                        $('.artwork-options-list').append('<span class="poster"><a class="artwork-option media-poster-container" data-rating-key="' + results[i] + '" href="#"> <div class="media-poster"><img class="media-poster-image loaded" src="' + results[i].replace("fanart/movies", "preview/movies") + '"></div> </a> </span>');
                    }
                }
            }
            if(TPDBResults.length > 0){
                for (let i = 0; i < TPDBResults.length; i++) {
                    $('.artwork-options-list').append('<span class="poster"><a class="artwork-option media-poster-container" data-rating-key="' + TPDBResults[i] + '" href="#"> <div class="media-poster"><img class="media-poster-image loaded" src="' + TPDBResults[i] + '"></div> </a> </span>');
                }
            }
        }

    }

    function updateBackgrounds() {
        if (tmdbResults != "nope" && !tmdbResults.results && tmdbResults.backdrops.length != 0) {
            if (tmdbResults.backdrops[0].file_path[0] === "/") {
                let results = tmdbResults.backdrops.map(i => 'https://image.tmdb.org/t/p/' + backdropSize + i.file_path);
                for (let i = 0; i < results.length; i++) {
                    $('.artwork-options-list').append('<span class="art"><a class="artwork-option media-poster-container" data-rating-key="' + results[i] + '" href="#"> <div class="media-poster"><img class="media-poster-image loaded" src="' + results[i].replace(posterSize, "w300") + '"></div> </a> </span>')
                }
            }
            if(fanartResults && fanartResults.moviebackground){
                if (fanartResults.moviebackground.length != 0) {
                    let results = fanartResults.moviebackground.map(i => i.url);
                    for (let i = 0; i < results.length; i++) {
                        $('.artwork-options-list').append('<span class="art"><a class="artwork-option media-poster-container" data-rating-key="' + results[i] + '" href="#"> <div class="media-poster"><img class="media-poster-image loaded" src="' + results[i].replace("fanart/movies", "preview/movies") + '"></div> </a> </span>');
                    }
                }
            }

        }

    }

});
function hitAPIs(_callback, name = null) {
    if (!name){
        name = encodeURI($(".modal-title").html().split("Edit ")[1]);
    }
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.themoviedb.org/3/search/collection?api_key=" + tmdbAPI + "&language=" + language + "&query=" + name + "&page=1",
        "method": "GET",
        "headers": {}
    }
    $.ajax(settings).done(function (response) {
        if(response.results.length > 0){
            summary = response.results[0].overview;
            if(response.results.length > 0){
                settings.url = "https://api.themoviedb.org/3/collection/" + response.results[0].id + "/images?api_key=" + tmdbAPI + "&language=null," + language;
                $.ajax(settings).done(function (response) {
                    tmdbResults = response;
                    if (fanArt) {
                        settings.url = "https://webservice.fanart.tv/v3/movies/" + response.id + "?api_key=" + fanArtAPI;
                        $.ajax(settings).done(function (response) {
                            fanartResults = response;
                            _callback();
                        }).fail(function(xhr, status, error){
                            alert("ERROR! FanART API key giving error: " + xhr.status + "\nCheck key and if issue persists you might want to disable it.");
                            _callback();
                        });
                    }
                    if(thePosterDB){
                        baseUrl = "https://cors-anywhere.herokuapp.com/https://theposterdb.com/search?page=1&term=";
                        $.ajax({
                            url: baseUrl + name + encodeURIComponent(" Collection"),
                            type: "get",
                            dataType: "",
                            success: function(data) {
                                id = $(data).find('button[data-poster-type="Collection"]')[0].dataset['posterId'];
                                $.ajax({
                                    url: "https://cors-anywhere.herokuapp.com/https://theposterdb.com/posters/" + id,
                                    type: "get",
                                    dataType: "",
                                    success: function(imgData) {
                                        $(imgData).find('picture:not([class]) img').each(function(){TPDBResults.push($(this).attr('src'));});
                                    }
                                });
                            }
                        });
                    }else {
                        _callback();
                    }
                });
            } else {
                tmdbResults = response;
            }
        } else {
            var newName = prompt("Collection name not found. Enter name of collection to try again or cancel to not search again.", name);
            if (newName == "" || newName === null) {
                tmdbResults = "nope";
                summary = " ";
            } else {
                hitAPIs(_callback, newName);
            }
        }
    }).fail(function(xhr, status, error){
        alert("ERROR! TheMovieDB API key giving error: " + xhr.status + "\nYou need a valid key to get posters.");
    });

}