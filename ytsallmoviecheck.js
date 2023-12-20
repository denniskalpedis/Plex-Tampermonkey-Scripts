/* globals jQuery, $ */
// ==UserScript==
// @name        check all yts browse movies if already in plex
// @namespace   yts_checker
// @version     1.2
// @match     http*://yts.torrentbay.net/browse-movies*
// @match     http*://yts.torrentbay.net/trending-movies*
// @match     http*://yts.mx/browse-movies*
// @match     http*://yts.mx/trending-movies*
// @grant       none
// @description  check if yts movie is already downloaded into plex
// @updateURL    https://raw.githubusercontent.com/dauheeIRL/Plex-Tampermonkey-Scripts/master/ytsallmoviecheck.js
// @downloadURL  https://raw.githubusercontent.com/dauheeIRL/Plex-Tampermonkey-Scripts/master/ytsallmoviecheck.js
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// ==/UserScript==

(function($) {
    'use strict';

    function htmlEncode(value) {
        var encodedValue = $('<div />').text(value).html();
        return encodedValue;
    }

    function CheckMovie(strSection, TOKEN, SERVER, intIndex, strMovieName, strYear){

        $.get( 'https://' + SERVER + '/library/sections/' + strSection + '/all?X-Plex-Token=' + TOKEN + '&year>=' + (parseInt(strYear) - 1) + '&year<=' + (parseInt(strYear) + 1) + '&title=' + encodeURIComponent(strMovieName), function( data ) {

            var strPlexData = new XMLSerializer().serializeToString(data.documentElement);

            if ((strPlexData.length > 450)&&(strPlexData.toLowerCase().includes('"' + htmlEncode(strMovieName.toLowerCase()) + '"'))){//&&(strPlexData.includes($('h1')[0].innerText))){
                var strVideoQual = ' (unknown video quality)';
                if(strPlexData.includes('videoResolution="')){
                    strVideoQual = ' (' + strPlexData.split('videoResolution="')[1].split('"')[0] + ')';
                }
                $('div[class="browse-movie-year"]')[intIndex].innerHTML = '<div style="background-color:red;color:black">' + $('div[class="browse-movie-year"]')[intIndex].innerText + strVideoQual + '</div>';
            }

        });

    }

    function CheckPLEXForMovies(){
        const PLEX_TOKEN = 'xxxx';
        const PLEX_SERVER = '192.16xxxxx:32400';

        //https://192.168.1.112:32400/library/sections?X-Plex-Token=xxxx to get what sections you want
        for (let i=0; i < $('a[class="browse-movie-title"]').length; i++) {
            CheckMovie(1, PLEX_TOKEN, PLEX_SERVER, i, $('a[class="browse-movie-title"]')[i].innerText, $('div[class="browse-movie-year"]')[i].innerText);
            CheckMovie(4, PLEX_TOKEN, PLEX_SERVER, i, $('a[class="browse-movie-title"]')[i].innerText, $('div[class="browse-movie-year"]')[i].innerText);
        }

    }

    $( document ).ready(function() {
        setTimeout(CheckPLEXForMovies, 1000);
    });

})(jQuery);
