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

        const strTitleHeader = 'h1[class^="ineka90 ineka9v ineka96 ineka9z _1duebfhfy"]';

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

    function HandleMovie(strType, strMovieName){

        var lastpos = strMovieName.lastIndexOf(', ') + 2;

        $(strType + ' span:first-child').attr('onClick', 'window.open("https://www.imdb.com/search/title/?title=' + strMovieName.substr(0, lastpos - 2).replaceAll(' ', '+') + '&release_date=' + (strMovieName.slice(lastpos) - 1) + '-01-01,' + (parseInt(strMovieName.slice(lastpos)) + 1) + '-01-01&adult=include&sort=year,desc", \'_blank\')');

        $('span' + strType).hover(
            function () {
                $('span' + strType).css("background-color", "yellow");
                $('span' + strType).css('cursor','help');
            },
            function () {
                $('span' + strType).css("background-color", "rgba(0, 0, 0, 0.3)");
            }
        );

        setTimeout(LoadMovieLocation, 1500);
    }

    $('body').arrive('button[data-testid="preplay-trailer"]', function () {

        $( document ).ready(function() {

            var strMovieName = $('a[class^="PosterCardLink-link-"]').attr('aria-label');
            var lastpos;
            if($('[title^="IMDb Rating"]').length > 0){
                //we are looking at movie
                HandleMovie('[title^="IMDb Rating"]', strMovieName);

            }else if($('[title^="Rotten Tomatoes Audience Rating "]').length > 0){
                //we are looking at movie

                HandleMovie('[title^="Rotten Tomatoes Audience Rating "]', strMovieName);

            }else if($('[title^="TMDB Rating"]').length > 0){
                //we are looking at TV series

                $('[title^="TMDB Rating"] span:first-child').attr('onClick', 'window.open("https://www.imdb.com/search/title/?title=' + strMovieName + '&year=' + $('span[class^="ineka90 ineka9v ineka99 _1duebfhfy"]')[0].innerText + '&adult=include", \'_blank\')');

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
