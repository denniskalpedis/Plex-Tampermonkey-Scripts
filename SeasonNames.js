// ==UserScript==
// @name        plex edit season names
// @namespace   Plex.tv
// @include     http*://<Private IP to access Plex>:32400/*
// @include     http*://app.plex.tv/*
// @version     1
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require     https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// ==/UserScript==
$('body').arrive('.form-group', function(){
    if($(".form-group").attr("data-attr") == "summary" && $(".modal-body-pane form").children().length == 1){
        let name = $(".modal-title").html();
        name = name.split(" - ").pop();
        $(".modal-body-pane form").prepend("<div class='row'><div class='col-md-12'><div class='form-group selectize-group' data-attr='name'><label for='lockable-name'>Name</label><div class='input-group'><a href='#' data-field='summary' class='input-group-addon edit-lock-addon' tabindex='-1'><i class='glyphicon lock'></i></a><input class='form-control lockable-field' id='lockable-name' name='title' value='" + name.replace("'", "&apos;").replace("\"", "&quot;") + "' /></div></div></div></div>");
    }
});