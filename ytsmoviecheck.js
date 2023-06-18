/* globals jQuery, $ */
// ==UserScript==
// @name        check if already have movie on yts
// @namespace   yts checker
// @version     1.0
// @match     http*://yts.torrentbay.net/movies/*
// @grant       none
// @description  check if yts movie is already downloaded into plex
// @updateURL    https://raw.githubusercontent.com/dauheeIRL/Plex-Tampermonkey-Scripts/master/ytsmoviecheck.js
// @downloadURL  https://raw.githubusercontent.com/dauheeIRL/Plex-Tampermonkey-Scripts/master/ytsmoviecheck.js
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==

(function($) {
    'use strict';

    function LoadMovieLocation(){
        const PLEX_TOKEN = 'xx';
        const PLEX_SERVER = 'xx';
        var strMovieName = $('h1')[0].innerText;
        var strYear = $('h2')[0].innerText; //$('h1')[0].baseURI;

        var fetchDownloadLink = 'https://' + PLEX_SERVER + '/library/sections/4/all?X-Plex-Token=' + PLEX_TOKEN + '&year=' +strYear + '&title=' + strMovieName; //kids

        $.get( fetchDownloadLink, function( data ) {

            var strPlexData = new XMLSerializer().serializeToString(data.documentElement);

            if (strPlexData.length > 450){
                var strVideoQual = strPlexData.split('videoResolution="')[1].split('"')[0]
                $('h1').after('<h2 style="background-color:yellow;color:red">ADULTS MOVIE (' + strVideoQual + ')</h2>');
            }

        });

        fetchDownloadLink = 'https://' + PLEX_SERVER + '/library/sections/1/all?X-Plex-Token=' + PLEX_TOKEN + '&year=' +strYear + '&title=' + strMovieName; //adults

        $.get( fetchDownloadLink, function( data ) {

            var strPlexData = new XMLSerializer().serializeToString(data.documentElement);

            if (strPlexData.length > 450){
                var strVideoQual = strPlexData.split('videoResolution="')[1].split('"')[0]

                $('h1').after('<h2 style="background-color:yellow;color:red">ADULTS MOVIE (' + strVideoQual + ')</h2>');
            }

        });

    }

    $( document ).ready(function() {
        setTimeout(LoadMovieLocation, 1000);
    });


})(jQuery);
