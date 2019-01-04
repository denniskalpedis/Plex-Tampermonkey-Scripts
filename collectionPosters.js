// ==UserScript==
// @name        plex Collection Posters
// @namespace   Plex.tv
// @include     http*://<Private IP to access Plex>:32400/*
// @include     http*://app.plex.tv/*
// @version     1.1
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
const language = "en";
// posible poster sizes w92, w154, w185, w342, w500, w780, original
const posterSize = "w342";
// possible background sizes w300, w780, w1280, original
const backdropSize = "original";
let tmdbResults;
let fanartResults;
$('body').leave('.modal-dialog', function () {
    tmdbResults = undefined;
    fanartResults = undefined;
});
$('body').arrive('.artwork-options-list', function () {
    if ($('[data-pane="art"]').hasClass("selected") && $(".modal-nav-list").children().length === 6 && $.trim($(".modal-nav-list").children()[2].textContent) === "Poster") {
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

    function hitAPIs(_callback) {
        let name = encodeURI($(".modal-title").html().split("Edit ")[1]);
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://api.themoviedb.org/3/search/collection?api_key=" + tmdbAPI + "&language=" + language + "&query=" + name + "&page=1",
            "method": "GET",
            "headers": {},
            "data": "{}"
        }
        $.ajax(settings).done(function (response) {
            settings.url = "https://api.themoviedb.org/3/collection/" + response.results[0].id + "/images?api_key=" + tmdbAPI + "&language=null," + language;
            $.ajax(settings).done(function (response) {
                tmdbResults = response;
                if (fanArt) {
                    settings.url = "https://webservice.fanart.tv/v3/movies/" + response.id + "?api_key=" + fanArtAPI;
                    $.ajax(settings).done(function (response) {
                        fanartResults = response;
                        _callback();
                    });
                } else {
                    _callback();
                }
            });
        });

    }

    function updatePosters() {
        if (tmdbResults.posters.length != 0) {
            if (tmdbResults.posters[0].file_path[0] === "/") {
                let results = tmdbResults.posters.map(i => 'https://image.tmdb.org/t/p/' + posterSize + i.file_path);
                for (let i = 0; i < results.length; i++) {
                    $('.artwork-options-list').append('<span class="poster"><a class="artwork-option media-poster-container" data-rating-key="' + results[i] + '" href="#"> <div class="media-poster"><img class="media-poster-image loaded" src="' + results[i].replace(posterSize, "w154") + '"></div> </a> </span>')
                }
            }
            if (fanartResults) {
                if (fanartResults.movieposter.length != 0) {
                    let results = fanartResults.movieposter.map(i => i.url);
                    for (let i = 0; i < results.length; i++) {
                        $('.artwork-options-list').append('<span class="poster"><a class="artwork-option media-poster-container" data-rating-key="' + results[i] + '" href="#"> <div class="media-poster"><img class="media-poster-image loaded" src="' + results[i].replace("fanart/movies", "preview/movies") + '"></div> </a> </span>');
                    }
                }
            }

        }

    }

    function updateBackgrounds() {
        if (tmdbResults.backdrops.length != 0) {
            if (tmdbResults.backdrops[0].file_path[0] === "/") {
                let results = tmdbResults.backdrops.map(i => 'https://image.tmdb.org/t/p/' + backdropSize + i.file_path);
                for (let i = 0; i < results.length; i++) {
                    $('.artwork-options-list').append('<span class="art"><a class="artwork-option media-poster-container" data-rating-key="' + results[i] + '" href="#"> <div class="media-poster"><img class="media-poster-image loaded" src="' + results[i].replace(posterSize, "w300") + '"></div> </a> </span>')
                }
            }
            // can't test yet....
            if (fanartResults) {
                if (fanartResults.moviebackground.length != 0) {
                    let results = fanartResults.moviebackground.map(i => i.url);
                    for (let i = 0; i < results.length; i++) {
                        $('.artwork-options-list').append('<span class="poster"><a class="artwork-option media-poster-container" data-rating-key="' + results[i] + '" href="#"> <div class="media-poster"><img class="media-poster-image loaded" src="' + results[i].replace("fanart/movies", "preview/movies") + '"></div> </a> </span>');
                    }
                }
            }

        }

    }

});