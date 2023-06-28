/* globals jQuery, $ */
// ==UserScript==
// @name        check all yts browse movies if already in plex
// @namespace   yts checker
// @version     1.0
// @match     http*://yts.torrentbay.net/browse-movies*
// @grant       none
// @description  check if yts movie is already downloaded into plex
// @updateURL    https://raw.githubusercontent.com/dauheeIRL/Plex-Tampermonkey-Scripts/master/ytsallmoviecheck.js
// @downloadURL  https://raw.githubusercontent.com/dauheeIRL/Plex-Tampermonkey-Scripts/master/ytsallmoviecheck.js
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==

(function($) {
    'use strict';

    function CheckMovie(strSection, TOKEN, SERVER, intIndex, strMovieName, strYear){

        $.get( 'https://' + SERVER + '/library/sections/' + strSection + '/all?X-Plex-Token=' + TOKEN + '&year=' +strYear + '&title=' + encodeURIComponent(strMovieName), function( data ) {

            var strPlexData = new XMLSerializer().serializeToString(data.documentElement);

            if (strPlexData.length > 450){
                var strVideoQual = strPlexData.split('videoResolution="')[1].split('"')[0]
                $('div[class="browse-movie-year"]')[intIndex].innerHTML = '<div style="background-color:red;color:black">' + $('div[class="browse-movie-year"]')[intIndex].innerText + ' - (' + strVideoQual + ')</div>'
            }

        });

       $.get( 'https://' + SERVER + '/library/sections/' + strSection + '/all?X-Plex-Token=' + TOKEN + '&year=' + parseInt(strYear) + 1 + '&title=' + encodeURIComponent(strMovieName), function( data ) {

            var strPlexData = new XMLSerializer().serializeToString(data.documentElement);

            if (strPlexData.length > 450){
                var strVideoQual = strPlexData.split('videoResolution="')[1].split('"')[0]
                $('div[class="browse-movie-year"]')[intIndex].innerHTML = '<div style="background-color:red;color:black">' + $('div[class="browse-movie-year"]')[intIndex].innerText + ' - (' + strVideoQual + ')</div>'
            }

        });

        $.get( 'https://' + SERVER + '/library/sections/' + strSection + '/all?X-Plex-Token=' + TOKEN + '&year=' + parseInt(strYear) - 1 + '&title=' + encodeURIComponent(strMovieName), function( data ) {

            var strPlexData = new XMLSerializer().serializeToString(data.documentElement);

            if (strPlexData.length > 450){
                var strVideoQual = strPlexData.split('videoResolution="')[1].split('"')[0]
                $('div[class="browse-movie-year"]')[intIndex].innerHTML = '<div style="background-color:red;color:black">' + $('div[class="browse-movie-year"]')[intIndex].innerText + ' - (' + strVideoQual + ')</div>'
            }

        });

    }

    function CheckPLEXForMovies(){
        const PLEX_TOKEN = 'yMsAwX4HJ31TEdsfNbMy';
        const PLEX_SERVER = '192.168.1.112:32400';

        for (let i=0; i < $('a[class="browse-movie-title"]').length; i++) {
            CheckMovie(1, PLEX_TOKEN, PLEX_SERVER, i, $('a[class="browse-movie-title"]')[i].innerText, $('div[class="browse-movie-year"]')[i].innerText);
            CheckMovie(4, PLEX_TOKEN, PLEX_SERVER, i, $('a[class="browse-movie-title"]')[i].innerText, $('div[class="browse-movie-year"]')[i].innerText);
        }

    }

    $( document ).ready(function() {
        setTimeout(CheckPLEXForMovies, 1000);
    });

})(jQuery);
