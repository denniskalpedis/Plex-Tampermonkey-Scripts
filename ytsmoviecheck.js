/* globals jQuery, $ */
// ==UserScript==
// @name        check if already have movie on yts
// @namespace   yts_checker
// @version     1.2
// @match     http*://yts.torrentbay.net/movies*
// @match     http*://yts.mx/movies*
// @grant       none
// @description  check if yts movie is already downloaded into plex
// @updateURL    https://raw.githubusercontent.com/dauheeIRL/Plex-Tampermonkey-Scripts/master/ytsmoviecheck.js
// @downloadURL  https://raw.githubusercontent.com/dauheeIRL/Plex-Tampermonkey-Scripts/master/ytsmoviecheck.js
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// ==/UserScript==

(function($) {
    'use strict';

    function UpdateH1Tag(data, strMovieName){

        var strPlexData = new XMLSerializer().serializeToString(data.documentElement);

        if ((strPlexData.length > 450)&&(strPlexData.includes($('h1')[0].innerText))&&(strPlexData.toLowerCase().includes('"' + strMovieName.toLowerCase() + '"'))){
            var strVideoQual = ' (unknown video quality)';
            if(strPlexData.includes('videoResolution="')){
                strVideoQual = ' (' + strPlexData.split('videoResolution="')[1].split('"')[0] + ')';
            }
            var strFolder = strPlexData.split('librarySectionTitle="')[1].split('"')[0];
            $('em[class="pull-left"]').after('<h2 style="background-color:yellow;color:red">' + strFolder + strVideoQual + '</h2>');
            //$('h1').after('<h2 style="background-color:yellow;color:red">' + strFolder + strVideoQual + '</h2>');
        }

    }

    function CheckMovie(strSection, TOKEN, SERVER, strMovieName, strYear){

        //get year before and after as there can be a slight mismatch sometimes
        $.get( 'https://' + SERVER + '/library/sections/' + strSection + '/all?X-Plex-Token=' + TOKEN + '&year>=' + (parseInt(strYear) - 1) + '&year<=' + (parseInt(strYear) + 1) + '&title=' + encodeURIComponent(strMovieName), function( data ) {
            UpdateH1Tag(data, strMovieName);
        });

    }

    function CheckPLEXForMovie(){
        const PLEX_TOKEN = 'dfsdfdsfsdfs';
        const PLEX_SERVER = '177.77.7.7.7.:55';
        var strMovieName = $('h1')[0].innerText;
        var strYear = $('h2')[0].innerText;

        //https://198.88.8.5.4:5555/library/sections?X-Plex-Token=xxxx to get what sections you want
        CheckMovie(1, PLEX_TOKEN, PLEX_SERVER, strMovieName, strYear);
        CheckMovie(4, PLEX_TOKEN, PLEX_SERVER, strMovieName, strYear);

    }

    $( document ).ready(function() {
        setTimeout(CheckPLEXForMovie, 1000);
    });

})(jQuery);
