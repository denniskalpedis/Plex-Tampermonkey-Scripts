/* globals jQuery, $, waitForKeyElements */
// ==UserScript==
// @name        plex Movie IMDb Link
// @namespace   Plex.tv
// @version     1.0
// @match     http*://192.168.1.112:32400/*
// @grant       none
// @description  add click for IMDB details, also click title to copy file location
// @updateURL    https://raw.githubusercontent.com/dauheeIRL/Plex-Tampermonkey-Scripts/master/IMDbLinks.js
// @downloadURL  https://raw.githubusercontent.com/dauheeIRL/Plex-Tampermonkey-Scripts/master/IMDbLinks.js
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require     https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// ==/UserScript==

(function($) {
    'use strict';

    function getPosition(string, subString, index) {
        return string.split(subString, index).join(subString).length;
    }

    function LoadMovieLocation(){

        const strTitleHeader = 'h1[data-testid="metadata-title"]';

        var currentpagelink = $('img[style^="position: absolute; width: 100%; height: 100%; object-fit: cover; opacity: 1;"]').attr('src');
        var movieid = currentpagelink.split('metadata%2F')[1].split('%2Fthumb')[0];
        var plextoken = currentpagelink.split('&X-Plex-Token=')[1];
        var fetchDownloadLink = currentpagelink.substr(0, getPosition(currentpagelink, '/', 3)) + '/library/metadata/' + movieid + '?X-Plex-Token=' + plextoken;

        $.get( fetchDownloadLink, function( data ) {

            var strPlexData = new XMLSerializer().serializeToString(data.documentElement);
            strPlexData = strPlexData.split(' file="')[1].split(" size=")[0].slice(0, -1);

            currentpagelink = currentpagelink.substr(getPosition(currentpagelink, '/', 2) + 1); //chop off http bit
            currentpagelink = currentpagelink.substr(0, currentpagelink.indexOf(":")); //chop off the protocol bit

            strPlexData = "\\\\" + currentpagelink + "\\Media\\" + strPlexData.substr(getPosition(strPlexData, '/', 4) + 1); //SMB format for windows

            strPlexData = strPlexData.substr(0, strPlexData.lastIndexOf('/')); //just want to folder not the file as might delete

            $(strTitleHeader).on("click", function() {
                navigator.clipboard.writeText(strPlexData);
                $(strTitleHeader).css("background-color", "green");
            });

        });

        $(strTitleHeader).hover(
            function () {
                $(strTitleHeader).css("background-color", "black");
                $(strTitleHeader).css('cursor','help');
            },
            function () {
                $(strTitleHeader).css("background-color", "rgba(0, 0, 0, 0.3)");
            }
        );

    }

    function HandleRating(){

        var strRatingSection = 'div[data-testid^="metadata-ratings"]';
        var strMovieName = $('a[class^="PosterCardLink-link-"]').attr('aria-label');
        var strYear;

        if($('[title^="TMDB Rating"]').length > 0){
            strYear = $('span[data-testid^="metadata-line1"]')[0].innerText;
        } else {
            var lastpos = strMovieName.lastIndexOf(', ') + 2;
            strYear = strMovieName.slice(lastpos);
            strMovieName = strMovieName.substr(0, lastpos - 2);
        }

        //$('[title^="IMDb Rating"]' + ' span:first-child') '[title^="Rotten Tomatoes Audience Rating "]'
        $(strRatingSection).attr('onClick', 'window.open("https://www.imdb.com/search/title/?title=' + strMovieName.replaceAll(' ', '+') + '&release_date=' + (parseInt(strYear) - 1) + '-01-01,' + (parseInt(strYear) + 1) + '-01-01&adult=include&sort=year,desc", \'_blank\')');

        $(strRatingSection).hover(
            function () {
                $(strRatingSection).css("background-color", "yellow");
                $(strRatingSection).css('cursor','help');
            },
            function () {
                $(strRatingSection).css("background-color", "rgba(0, 0, 0, 0.3)");
            }
        );

        LoadMovieLocation();
    }

    $('body').arrive('button[data-testid="preplay-play"]', function () {

        $( document ).ready(function() {

            setTimeout(HandleRating, 1000);

        });

    });


})(jQuery);
