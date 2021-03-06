$(document).ready(function(){
    
var socket = io.connect('http://54.186.95.160');
var url = document.URL;
    
    
//SEARCH STUFF
$('#home-search-button').on('click', function() {
    var item = $('#home-question').val();
    socket.emit('search', item);
});
    
socket.on('search-result', function(title, school, description, tags) {
    $('.centerEd').animate({top:'0px'},200);
    $('#sidebar').animate({left:'100%'},200);
    $('#ind-page').append('<div id="' + removespace(title) + '">'
                            + '<div2 id = "' + removespace(title) + '" class = "title">' + title + '</div2>'
                            + '<button class = "bookmarked blank bookmark-button">bookmarked</button>'
                            + '<button class = "bookmark blank bookmark-button">bookmark</button>'
                            + '<div class = "school sevenbelow">' + school + '</div>'
                            + '<div class = "description sevenbelow">' + description + '</div>'
                            + '<div class = "tags sevenbelow">' + tags + '</div>'
                            + '<button class = "link">peek</button>'
                            + '</div>');
});
    
//VERIFY EMAIL
function okayemail(email) {
    if ((email.split('@').length-1) == 1 && (email.substring(email.length-4, email.length))) {
        return true;
    } else {
        return false;
    }
}

//ENTER
$('.login').keydown(function(e) {
    if (e.keyCode == 13) {
        var email = $('#login-email').val().toLowerCase();
        var password = $('#password').val();
        socket.emit('login', email, password);
    }
});
    
socket.on('verification-failed', function() {
	$('.validation_error').text("Oops! That email and password combination didn't work.");
});
    
socket.on('notverified',function( ){
	$('.validation_error').text("You haven't signed up!");
});
    
    
//SIGNUP BUTTON CLICK: EMAIL EXPAND
$('#signup-button').on('click',function(){
    $('#signup-email').animate({right:'225px'},200);
    $('#signup-button').text("go!");
    
    $('#frontheader').show(200);
    $('#question').css('margin-top', '0px');

    $('#question').val('');
    $("#search-button").hide();
    
    var email = $('#signup-email').val().toLowerCase();
    
    if($('#signup-email').css("right") == "225px"){
        if (okayemail(email))  {
            socket.emit('signup-email', email);
        }
        else {
            $('.stat').removeClass('blank').text('What is your .edu email?');
        }
    }
});
    
//SIGNUP BUTTON SHRINK ON BODY CLICK
$('.background').on('click', function(){
    $('.stat').fadeOut();
    $('#signup-email').animate({right:'15px'},200);
    $('#signup-button').text("sign up");
});

//SIGNUP BUTTON SHRINK WHEN FOCUS
$('#question').focus(function(){
    $('.stat').fadeOut();
    $('#signup-email').animate({right:'15px'},200);
    $('#signup-button').text("sign up");
});  
    
//SIGNUP EMAIL OK
socket.on('success', function() {
    $('.stat').removeClass('blank').text('Check your email!');
});
    
//SIGNUP EMAIL DUPLICATE
socket.on('duplicate', function() {
    $('.stat').removeClass('blank').text("Oops! That email is being used.");
});  
    
//AFTER SIGNUP OK: SEND VALIDATION 
var url = document.URL;
if (url.indexOf('/verify') != -1) {
    var code = url.substring(url.indexOf('?v=') + 3,url.length);
    socket.emit('verify',code);
}
    
//VALID CODE
socket.on('validation-email', function(data) {
    if (data == null) {
        $('#valid-err').removeClass('blank');
    } else {
        $('#welcome').text("Welcome, " + data);
        $('#pw-box').removeClass('blank');
    }
});
    
//CODE 404
socket.on('error-validation', function() {
    window.location.replace("http://54.186.95.160/error");
});

//COMMIT USER: EMIT EMAIL/PW/USERNAME
$('#pw-next').on('click',function() {
    var password = $('#signup-pw').val();
    $('#welcome').addClass('blank');
    
    if (password.length != 0) {
        $('#signup-pw').hide();
        $('#pw-next').hide();
        $('#username-box').show();
        
        $('#username-next').on('click',function(){
            
            var username = $('#signup-name').val();
            
            if (username.length != 0) {
                var email = $('#welcome').text().substring(9, $('#welcome').text().length);
                socket.emit('finish-signup', email, password, username);
                //window.location.replace("http://54.186.95.160/");
            } else {
                $('blank-err').show();
            } 
        });
    } else {
        $('blank-err').show();
    }   
});

//FINISH SIGNUP: LOGIN DIRECTLY
socket.on('verification-completed',function(){
    var email = $('#welcome').text().substring(9, $('#welcome').text().length);
    var password = $('#signup-pw').val();
    socket.emit('login', email, password);
});
  
//QUESTION GO UP, APPEND SEARCH BUTTON
$("#question").keyup(function() {
    var question = $("#question").val();
    
    if (question.length == 0) {
        $('#frontheader').show(100);
        $("#search-button").hide();
    }
    else {
        $('#frontheader').hide(100);
        $("#search-button").show();
    }

});
    
//QUESTION GO UP, APPEND SEARCH BUTTON
$("#home-question").keyup(function() {
    var question = $("#home-question").val();
    
    if (question.length == 0) {
        $("#home-search-button").hide();
    }
    else {
        $("#home-search-button").show();
    }

});
    
 
     
    
//SEND LOG IN INPUT
$('#login').on('click',function(){
    var email = $('#login-email').val();
    var password = $('#password').val();
    socket.emit('login', email, password);
});
 
    
//USER IN DB, LOGIN!
socket.on('verified', function(data) {
    window.location.replace("http://54.186.95.160/almost-there?confirm="+data);
});
    
    
//FIN LOG IN, REDIRECT TO HOME, RENDER ALL BOOKMARKS
socket.on('logged-in', function() {
	if(url.indexOf('/home')==-1)
		window.location.replace("http://54.186.95.160/home");
});

    
    
//FORGOT PW
$('#iforgot').on('click',function(){
    var email = $('#email').val();
    socket.emit('iforgot', email);
});
    
if (url.indexOf("/logout") != -1) {
    window.location.replace("http://54.186.95.160/");
}    
    
if (url.indexOf("/home") != -1) {
    socket.emit('newest');
}


    
//NEWEST POSTS
socket.on('post-newest', function(title, school, description) {
	$('.loading').hide();
	$('#basicinfo').append('<div id="' + removespace(title) + '">'
                            + '<div2 id = "' + removespace(title) + '" class = "title">' + title + '</div2>'
                            + '<button class = "bookmarked blank bookmark-button">bookmarked</button>'
                            + '<button class = "bookmark blank bookmark-button">bookmark</button>'
                            + '<div class = "school sevenbelow">' + school + '</div>'
                            + '<div class = "description sevenbelow">' + description + '</div>'
                            + '<button class = "link">peek</button>'
                            + '</div>');
});
   
    

//LINK TO INDIVIDUAL PAGE
$('#basicinfo').on('click','.link', function() {
    var title = $(this).parent().children('.title').text();
    socket.emit('page-request', title);
});
    
//IND PAGE RESPONSE
socket.on('page-response', function(title, school, description, document, tags) {
    
    $("#ind-title").text(title);
    $("#ind-school").text(school);
    $("#ind-description").text(description);
    $("#ind-document").html(document);
    $("#ind-tags").text(tags);
    
    //APPEND SECTION HEADERS TO TB
    $("#ind-tb").html("");
    for (var i=0; i < $('#ind-document').children('.section_headers').length; i++) {
        var text = $('#ind-document').children('#' + i).text();
        $("#ind-tb").append(i + ". " + text);
    }
});
                   
//QUERY FOR BOOKMARK STATUS
$('#basicinfo').on('click','div2', function() {
    socket.emit('bookmark-status', removespace($(this).text()));
});

    
//UPDATE BOOKMARK STATUS
socket.on('bookmark-yes', function(title) {
	$('#basicinfo').children('#'+removespace(title)).children('.bookmark').hide();
    $('#basicinfo').children('#'+removespace(title)).children('.bookmarked').show();
    $('#basicinfo').children('#'+removespace(title)).children('.bookmarked').delay(3000).fadeOut();
});         
    
socket.on('bookmark-no', function(title) {
    $('#basicinfo').children('#'+removespace(title)).children('.bookmarked').hide();
    $('#basicinfo').children('#'+removespace(title)).children('.bookmark').show();
    $('#basicinfo').children('#'+removespace(title)).children('.bookmark').delay(3000).fadeOut();
});
   
//TOGGLE BOOKMARK STATUS
$('#basicinfo').on('click','.bookmarked', function() {
    var title = $(this).parent().children('.title').text();
    socket.emit('unfollow', removespace(title));
});
$('#basicinfo').on('click','.bookmark', function() {
    var title = $(this).parent().children('.title').text();
    socket.emit('bookmark-this', removespace(title));
});
                 
function removespace(title) {
    return title.replace(/\s/g , "-");
}
    
//EDIT
$('#edit-button').on('click', function() {
    if ($(this).text() == 'cancel') {
		$('#ind-page').animate({left:'0px'},200);
        $('#edit-button').text('edit');
		$('.centerEd').animate({top:'900px'},200);
		$('#sidebar').animate({left:'0px'},200);
         $('#update-button').addClass('blank');
        
    } else {
        
        $('#edit-button').text('cancel');
        $('#editor').removeClass('blank');
		$('.centerEd').animate({top:'0px'},200);
		$('#sidebar').animate({left:'100%'},200);
		$('#ind-page').animate({left:'-80%'},200);
        $('#update-button').removeClass('blank');
		$('#submit-post').addClass('blank');
		
    }
    
});
  
    
//NEW SECTION
$('#newsection-button').on('click', function() {
    $('#newsection-input').removeClass('blank');
    $('#newsection-submit').removeClass('blank');
});
    
$('#newsection-submit').on('click', function() {
    $('#newsection-input').addClass('blank');
    $('#newsection-submit').addClass('blank');
    
	var count = $('.section_headers').length;
	
    var section = $('#newsection-input').val();
	$('#newpost').append('<h1 class="section_headers" id="' + count + '">' + section + '</h1>')
    $('#tb').append('<div><a class="tabocont" id = "' + count + '">' + section + '</a></div>');
    
});

   $('#tb').on('click','.tabocont',function(){
		var tab = $(this).attr('id');

		$('#newpost').animate({	scrollTop: $('#newpost').children('#'+tab).offset().top},200);
   });
 $('#cancel-button').on('click', function(){
		$('#ind-page').animate({left:'0px'},200);
        $('#edit-button').text('edit');
		$('.centerEd').animate({top:'900px'},200);
		$('#sidebar').animate({left:'0px'},200);
        $('#update-button').addClass('blank');
		$('#newpage-button').text("new wiki page");
	});
    
    
//UPDATE EDITS
$('#update-button').on('click', function() {
        
    var title = $('#ind-title').text();
    title.replace(/\s/g , "-");  
    
    var document = $('#newpost').html();

    $('#edit-button').text('edit');
    $('.centerEd').animate({top:'900px'},200);
    $('#sidebar').animate({left:'0px'},200);
	$('#ind-page').animate({left:'0px'},200);
    
    socket.emit('edit', title, document);
    
});
    
    
    
//NEW WIKIPAGE: EXPAND
$('#newpage-button').on('click', function() {
    
    if ($(this).text() == 'cancel') {

        $('#newpage-button').text('new wiki page');
		$('.centerEd').animate({top:'900px'},200);
		$('#sidebar').animate({left:'0px'},200);
		$('#ind-page').animate({left:'0px'},200);
        
    } else {
        
        $('#newpage').removeClass('blank');
        $('#editor').removeClass('blank');
        $('#newpage-button').text('cancel');
		$('.centerEd').animate({top:'0px'},200);
		$('#ind-page').animate({left:'-80%'},200);
		$('#sidebar').animate({left:'100%'},200);
		$('#submit-button').removeClass('blank');
		$('#submit-post').removeClass('blank');
    }
    
});

//SUBMIT NEW WIKI, HIDE INPUT
$('#submit-post').on('click', function() {
    var title = $('#page-title').val();
    title.replace(/\s/g , "-");
    
    var question = $('#page-question').val();
    var description = $('#page-description').val();
    var document = $('#newpost').html();
    
    var tags = $('#page-tags').val();
    tags = tags.split(' ');
    
    socket.emit('newpage', title, question, description, document, tags);
    
    $('#newpage').addClass('blank');
    $('#editor').addClass('blank');
    $('#newpage-button').text('new wiki page');
         $('#newpage-button').text('new wiki page');
		$('.centerEd').animate({top:'900px'},200);
		$('#sidebar').animate({left:'0px'},200);
		$('#ind-page').animate({left:'0px'},200);
});
    
    
    
});
   


//TEXT EDITOR STUFF
function toggleHead() {
    
	if (document.queryCommandValue('fontSize')==5){
		document.execCommand('fontSize',false,3);
		if (document.queryCommandState('bold'))
			toggleBold();
			return 0;
		}
		
	 document.execCommand('fontSize',false,5);
	 if (!document.queryCommandState('bold'))
		toggleBold();
	}

function toggleSub(){
    
    if (document.queryCommandValue('fontSize')==4) {
        document.execCommand('fontSize',false,3);
        if (document.queryCommandState('bold')) {
            toggleBold();
            return 0;
        }
    }
    
    document.execCommand('fontSize',false,4);
    
    if (!document.queryCommandState('bold')) {
        toggleBold();
    }
}

function toggleColor() {
    
    if($(this).hasClass('editor-button-on')) {
       
        $(this).removeClass('editor-button-on');
        $(this).addClass('editor-button-off');
    
    } else {
        
        $(this).addClass('editor-button-on');
        $(this).removeClass('editor-button-off');
    }
}

function toggleBold() {
    document.execCommand('bold',false,null);
}

function toggleItalics() {
    document.execCommand('italic',false,null);
}

function toggleUnderline() {
    document.execCommand('underline',false,null);
}

function toggleCenter() {
    document.execCommand('justifyCenter',false,null);
}

function toggleRight() {
    document.execCommand('justifyRight',false,null);
}

function toggleLeft() {
    document.execCommand('justifyLeft',false,null);
}
