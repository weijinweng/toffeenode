$(document).ready(function(){

var socket = io.connect('http://localhost:8000');

//LOG IN, render logout, search bar on top
socket.on('logged-in', function() {
    $('#signup-box').addClass('blank');
    $('#logout-box').removeClass('blank');
});

//LOGOUT, render signup/login
$('#logout-link').on('click', function() {
	window.location.replace("http://localhost:8000/logout");
	window.location.replace("http://localhost:8000/");
});
    
//BOOKMARKED STUFF
    
//NO BOOKMARKS, render box

//VERIFIED USER, sign up and log in!
socket.on('verified', function(data) {
    window.location.replace("http://localhost:8000/almost-there?confirm="+data);
	window.location.replace("http://localhost:8000/");

});


//GO UP, APPEND SEARCH BUTTON
$("#question").keyup(function() {
    var question = $("#question").val();
    
    if (question.length == 0) {
        $('#frontheader').show();
        $("#search-button").hide();
    }
    else {
        $('#frontheader').hide();
        $('#question').animate({marginTop:'10px'},200);
        $("#search-button").show();
    }
    
});
    
//NEXT BUTTON
$("#question").keyup(function() {
    var question = $("#question").val();
    
    if (question.length == 0) {
        $("#go").remove();
    }
    
    else if ($("#go").length == 0) {
        $("#box").append("<button id = 'go'>go</button>");
    } 
});
    
//LOG IN
$('#login').on('click',function(){
    var email = $('#login-email').val();
    var password = $('#password').val();
	alert(email);
    socket.emit('login', email, password);
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
    
    $('#frontheader').show();
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
  

    
    
//FINISH SIGNUP
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
    

  
    

//FORGOT PW
$('#iforgot').on('click',function(){
    var email = $('#email').val();
    socket.emit('iforgot', email);
});
    
});