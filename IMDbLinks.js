// ==UserScript==
// @name        plex Movie IMDb Link
// @namespace   Plex.tv
// @version     1.1
// @include     http*://<Private IP to access Plex>/*
// @include     http*://app.plex.tv/*
// @grant       none
// @updateURL    https://raw.githubusercontent.com/denniskalpedis/Plex-Tampermonkey-Scripts/master/IMDbLink.js
// @downloadURL  https://raw.githubusercontent.com/denniskalpedis/Plex-Tampermonkey-Scripts/master/IMDbLink.js
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require     https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// ==/UserScript==

$('body').arrive('button[data-qa-id="preplay-trailer"]', function () {
    $('body').arrive("div[class^='CriticRating-container']", function () {
        if($('[title="IMDb Rating"]').length > 0){
            $('[title="IMDb Rating"] div:first-child').attr('onClick', 'window.open(\'https://duckduckgo.com/?q=!ducky+site:imdb.com ' + $('div[class^="PrePlayLeftTitle-leftTitle"]')[0].innerText.replace('\'', '') + ' ' + $('div[data-qa-id="preplay-secondTitle"]')[0].innerText + '\', \'_blank\')')
        }else {
            $("div[class^='CriticRating-container'] div:first-child").first().append('<div class="CriticRating-rating-2Jrl15" title="IMDb Rating" style="margin-left: 1em;"><div class="CriticRating-imdb-23PVnW CriticRating-ratingImage-3-Lxod" onclick="window.open(\'https://duckduckgo.com/?q=!ducky+site:imdb.com ' + $('div[class^="PrePlayLeftTitle-leftTitle"]')[0].innerText.replace('\'', '') + ' ' + $('div[data-qa-id="preplay-secondTitle"]')[0].innerText + '\', \'_blank\')"></div>&nbsp;&nbsp;</div>');
        }
    });
    $('body').leave('button[aria-label="Play Trailer"]', function () {
        $('body').unbindArrive("div[class^='CriticRating-container']");
    });
});