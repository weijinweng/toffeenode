$(document).ready(function(){
    
var socket = io.connect('http://localhost:8000');
var url = document.URL;
    
//LOGOUT REDIRECT TO FRONT
if (url.indexOf("/logout") != -1) {
    alert("bye");
    window.location.replace("http://localhost:8000/");
}
    
    
//GO UP, APPEND SEARCH BUTTON
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

    
//SIGNUP ORIGINAL ON BODY CLICK
$('.background').on('click', function(){
    $('.stat').fadeOut();
    $('#signup-email').animate({right:'15px'},200);
    $('#signup-button').text("sign up");
});

//SIGNUP ORIGINAL WHEN FOCUS
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
    alert(code);
    socket.emit('verify',code);
}
    
//VAL OKAY
socket.on('validation-email', function(data) {
    if (data == null) {
        alert("OH NO!");
        $('#valid-err').removeClass('blank');
    } else {
        alert("OKAY!");
        alert(data);
        $('#welcome').text("Welcome, " + data);
        $('#pw-box').removeClass('blank');
    }
});
    
//VAL 404
socket.on('error-validation', function() {
    window.location.replace("http://localhost:8000/error");
});
  

    
    
//FINISH SIGNUP: EMIT EMAIL/PW/USERNAME
$('#pw-next').on('click',function(){
    var password = $('#signup-pw').val();
    
    if (password.length != 0) {
        alert("HI");
        $('#signup-pw').hide();
        $('#pw-next').hide();
        $('#username-box').show();
        
        $('#username-next').on('click',function(){
            
            var username = $('#signup-name').val();
            
            if (username.length != 0) {
                var email = $('#welcome').text().substring(9, $('#welcome').text().length);
				alert(email);
                socket.emit('finish-signup', email, password, username);
                //window.location.replace("http://localhost:8000/");
            }
            
            else {
                $('blank-err').show();
            }
            
        });
    }
    
    else {
        $('blank-err').show();
    }   
});

//FIN SIGNUP: LOGIN DIRECTLY
socket.on('verification-completed',function(){
    var email = $('#welcome').text().substring(9, $('#welcome').text().length);
    var password = $('#signup-pw').val();
    alert(email);
    socket.emit('login', email, password);
});
    
    
//SEND LOG IN INPUT
$('#login').on('click',function(){
    var email = $('#login-email').val();
    var password = $('#password').val();
	alert(email);
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
    
    
//MAKE NEW PAGE: EXPAND
$('newpage-button').on('click', function() {
    var title = $('#page-title').val();
    var question = $('#page-question').val();
    var description = $('#page-description').val();
    var document = $('#newpost').html();
    socket.emit('newpage', title, question, description, JSON.stringify(document));
});

});
                       
function toggleHead(){
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
	if (document.queryCommandValue('fontSize')==4){
		document.execCommand('fontSize',false,3);
		if (document.queryCommandState('bold'))
			toggleBold();
			return 0;
		}
		 document.execCommand('fontSize',false,4);
	 if (!document.queryCommandState('bold'))
		toggleBold();
	}
	  function toggleBold(){
	document.execCommand('bold',false,null);
	}
	function toggleItalics(){
	document.execCommand('italic',false,null);
	}
	function toggleUnderline(){
	document.execCommand('underline',false,null);
	}
	function toggleCenter(){
	document.execCommand('justifyCenter',false,null);
	}
	function toggleRight(){
	document.execCommand('justifyRight',false,null);
	}
	function toggleLeft(){
	document.execCommand('justifyLeft',false,null);
	}
    
