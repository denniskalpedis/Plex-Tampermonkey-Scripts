/* globals jQuery, $, waitForKeyElements */
// ==UserScript==
// @name        plex Movie IMDb Link
// @namespace   Plex.tv
// @version     1.0
// @match     http*://192.168.1.112:32400/*
// @grant       none
// @description  add click for IMDB details
// @updateURL    https://raw.githubusercontent.com/dauheeIRL/Plex-Tampermonkey-Scripts/master/IMDbLinks.js
// @downloadURL  https://raw.githubusercontent.com/dauheeIRL/Plex-Tampermonkey-Scripts/master/IMDbLinks.js
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require     https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// ==/UserScript==

(function($) {
    'use strict';

    $('body').arrive('button[data-testid="preplay-trailer"]', function () {

        $( document ).ready(function() {

            var strDetails = $('a[class^="PosterCardLink-link-"]').attr('aria-label');
            if($('[title^="IMDb Rating"]').length > 0){

                var lastpos = strDetails.lastIndexOf(', ') + 2;
                //var strPlexToken = $('a[target^="downloadFileFrame"]').attr('href').split('?download=1&')[1];

                $('[title^="IMDb Rating"] span:first-child').attr('onClick', 'window.open("https://www.imdb.com/search/title/?title=' + strDetails.substr(0, lastpos - 2).replaceAll(' ', '+') + '&year=' + strDetails.slice(lastpos) + '&adult=include", \'_blank\')');

                $('span[title^="IMDb Rating "]').hover(
                    function () {
                        $('span[title^="IMDb Rating "]').css("background-color", "yellow");
                        $('span[title^="IMDb Rating "]').css('cursor','help');
                    },
                    function () {
                        $('span[title^="IMDb Rating "]').css("background-color", "rgba(0, 0, 0, 0.3)");
                    }
                );

                //var strPlexLink = $('a[target^="downloadFileFrame"]').attr('href').split('?download=1&').split('/library/parts/')[0] + '&' + strPlexToken;
                //let strPlexPage = fetch(strPlexLink);
                //alert(strPlexPage.split(' file="')[1].split(" size=")[0]);



            }else if($('[title^="TMDB Rating"]').length > 0){

                $('[title^="TMDB Rating"] span:first-child').attr('onClick', 'window.open("https://www.imdb.com/search/title/?title=' + strDetails + '&year=' + $('span[class^="ineka90 ineka9v ineka99 _1duebfhfy"]')[0].innerText + '&adult=include", \'_blank\')');

                $('span[title^="TMDB Rating "]').hover(
                    function () {
                        $('span[title^="TMDB Rating "]').css("background-color", "yellow");
                        $('span[title^="TMDB Rating "]').css('cursor','help');
                    },
                    function () {
                        $('span[title^="TMDB Rating "]').css("background-color", "rgba(0, 0, 0, 0.3)");
                    }
                );

            }

        });

    });


})(jQuery);
