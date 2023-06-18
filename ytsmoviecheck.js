/* globals jQuery, $ */
// ==UserScript==
// @name        check if individual yts movie already in plex
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

    function CheckMovie(strSection, TOKEN, SERVER, strMovieName, strYear){

        $.get( 'https://' + SERVER + '/library/sections/' + strSection + '/all?X-Plex-Token=' + TOKEN + '&year=' +strYear + '&title=' + strMovieName, function( data ) {

            var strPlexData = new XMLSerializer().serializeToString(data.documentElement);

            if (strPlexData.length > 450){
                var strVideoQual = strPlexData.split('videoResolution="')[1].split('"')[0]
                $('h1').after('<h2 style="background-color:yellow;color:red">' + ((strSection == 4) ? 'KIDS' : 'ADULT') + ' section (' + strVideoQual + ')</h2>');
            }

        });

    }

    function CheckPLEXForMovie(){
        const PLEX_TOKEN = 'yMsAwX4HJ31TEdsfNbMy';
        const PLEX_SERVER = '192.168.1.112:32400';
        var strMovieName = $('h1')[0].innerText;
        var strYear = $('h2')[0].innerText;

        CheckMovie(1, PLEX_TOKEN, PLEX_SERVER, strMovieName, strYear);
        CheckMovie(4, PLEX_TOKEN, PLEX_SERVER, strMovieName, strYear);

    }

    $( document ).ready(function() {
        setTimeout(CheckPLEXForMovie, 1000);
    });

})(jQuery);
