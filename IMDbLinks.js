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
            if($('[title^="IMDb Rating"]').length > 0){
                var strDetails = $('a[class^="PosterCardLink-link-"]').attr('aria-label');
                var astrDetails = strDetails.split(', ');

                $('[title^="IMDb Rating"] span:first-child').attr('onClick', 'window.open("https://www.imdb.com/search/title/?title=' + astrDetails[0] + '&year=' + astrDetails[1] + '&adult=include", \'_blank\')');

            }

        });


        $('span[title^="IMDb Rating "]').hover(
            function () {
                $('span[title^="IMDb Rating "]').css("background-color", "yellow");
                $('span[title^="IMDb Rating "]').css('cursor','help');
            },
            function () {
                $('span[title^="IMDb Rating "]').css("background-color", "rgba(0, 0, 0, 0.3)");
            }
        );



    });


})(jQuery);
