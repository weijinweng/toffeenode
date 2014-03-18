$(document).ready(function(){
    
var socket = io.connect('http://localhost:8000');
var url = document.URL;
    
//VERIFY EMAIL
function okayemail(email) {
    if ((email.split('@').length-1) == 1 && (email.substring(email.length-4, email.length))) {
        return true;
    } else {
        return false;
    }
}
 
//SIGNUP BUTTON CLICK: EMAIL EXPAND
$('#signup-button').on('click',function(){
    $('#signup-email').animate({right:'225px'},200);
    $('#signup-button').text("go!");
    
    $('#frontheader').show(200);
    $('#question').css('margin-top', '0px');

    $('#question').val('');
    $("#search-button").hide();
    
    var email = $('#signup-email').val();
    
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
    window.location.replace("http://localhost:8000/error");
});

//COMMIT USER: EMIT EMAIL/PW/USERNAME
$('#pw-next').on('click',function() {
    var password = $('#signup-pw').val();
    
    if (password.length != 0) {
        $('#signup-pw').hide();
        $('#pw-next').hide();
        $('#username-box').show();
        
        $('#username-next').on('click',function(){
            
            var username = $('#signup-name').val();
            
            if (username.length != 0) {
                var email = $('#welcome').text().substring(9, $('#welcome').text().length);
                socket.emit('finish-signup', email, password, username);
                //window.location.replace("http://localhost:8000/");
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
 
     
    
//SEND LOG IN INPUT
$('#login').on('click',function(){
    var email = $('#login-email').val();
    var password = $('#password').val();
    socket.emit('login', email, password);
});
    
    
//USER IN DB, LOGIN!
socket.on('verified', function(data) {
    window.location.replace("http://localhost:8000/almost-there?confirm="+data);
});
    
    
//FIN LOG IN, REDIRECT TO HOME, RENDER ALL BOOKMARKS
socket.on('logged-in', function() {
	if(url.indexOf('/home')==-1)
		window.location.replace("http://localhost:8000/home");
});

    
    
//FORGOT PW
$('#iforgot').on('click',function(){
    var email = $('#email').val();
    socket.emit('iforgot', email);
});
    
if (url.indexOf("/logout") != -1) {
    window.location.replace("http://localhost:8000/");
}    
    
if (url.indexOf("/home") != -1) {
    socket.emit('newest');
}


//NEWEST POSTS
socket.on('post-newest', function(title, school, description) {
	$('#basicinfo').append('<div>'
                            + '<button class = "bookmarked blank">bookmarked</button>'
                            + '<button class = "bookmark blank">bookmark</button>'
                            +'<div2 id = "' + title + '" class = "title">' + title + '</div2>'
                            + '<div class = "school">' + school + '</div>'
                            + '<div class = "description">' + description + '</div>'
                            + '</div>');
});
    
 
//QUERY FOR BOOKMARK STATUS
$('#basicinfo').on('click','div2', function() {
	alert('hi');
    socket.emit('bookmark-status', $(this).attr('id'));
});

//SHOW BUTTON BY QUERY RESULT
socket.on('bookmark-yes', function(title) {
    $('#' + title).parent().children().attr('.bookmark').hide();
    $('#' + title).parent().children().attr('.bookmarked').show();
});         
socket.on('bookmark-no', function(title) {
    $('#' + title).parent().children().attr('.bookmarked').hide();
    $('#' + title).parent().children().attr('.bookmark').show();
});
   
//TOGGLE BOOKMARK STATUS
$('.bookmarked').on('click', function() {
    var title = $(this).parent().children('.title').attr('id');
    socket.emit('unfollow', title);
});
$('.bookmark').on('click', function() {
    var title = $(this).parent().children('.title').attr('id');
    socket.emit('follow', title);
});
                 
                  
                  
//MAKE NEW PAGE: EXPAND
$('#newpage-button').on('click', function() {
    if ($(this).text() == 'cancel') {
        $('#newpage').addClass('blank');
        $('#newpage-button').text('new wiki page');
    } else {
        $('#newpage').removeClass('blank');
        $('#newpage-button').text('cancel');
    }
});

$('#submit-post').on('click', function() {
    var title = $('#page-title').val();
    var question = $('#page-question').val();
    var description = $('#page-description').val();
    var document = $('#newpost').html();
    socket.emit('newpage', title, question, description, JSON.stringify(document));
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