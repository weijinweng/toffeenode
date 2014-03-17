$(document).ready(function(){

var socket = io.connect('http://localhost:8000');
    
    
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
    var email = $('#email').val();
    var password = $('#password').val();
    socket.emit('login', email, password);
});
    
    
//SIGNUP EMAIL EXPAND
$('#signup-button').on('click',function(){
    $('#signup-email').animate({right:'225px'},200);
    $('#signup-button').text("Go!");
    var email = $('#signup-email').val();
    
    if ($('#signup-email').css("right") == "225px;") {
        var email = $('#signup-email').val();
        socket.emit('signup-email', email);
    }
});
    
//SIGNUP EMAIL SHRINK
$('.background').on('click', function(){
    $('#signup-email').animate({right:'15px'},200);
    $('#signup-button').text("Sign up");
});

//SIGNUP EMAIL OK
socket.on('success', function() {
    $('body').append('<div>check your email!</div>');
});

//SIGNUP EMAIL DUPLICATE
socket.on('duplicate', function() {
    $('body').append('<div>you signup already</div>');
});
    
//AFTER SIGNUP OK: SEND VALIDATION 
var url = window.location.pathname;
if (url.indexOf('/verify') != -1) {
    var code = url.split('?v=')[1];
    socket.emit('verify', code);
}
    
//VAL OKAY
socket.on('validation-email', function(data) {
    if (data.length == 0) {
        $('valid-err').show();
    }
    else {
        $('pw-email').text("Welcome, " + data);
        $('pw-box').show();
    }
});
  
//VAL 404
socket.on('error-validation', function() {
    window.location.replace("localhost:8000/error");
});
    
    
//FINISH SIGNUP
$('#pw-next').on('click',function(){
    var password = $('#signup-pw').val();
    
    if (password.length != 0) {
        $('username-box').show();
        
        $('#username-next').on('click',function(){
            
            var username = $('#signup-name').val();
            
            if (username.length != 0) {
                var email = $('pw-email').text().substring(8, this.length);
                socket.emit('finish-signup', email, password, username);
                window.location.replace("localhost:8000/");
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