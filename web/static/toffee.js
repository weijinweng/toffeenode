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
    
    
//SIGNUP
$('#signup-button').on('click',function(){
    $('#signup-email').animate({right:'220px'},200);
    var email = $('#signup-email').val();
    socket.emit('signup-email', email);
});
    
$('.background').on('click', function(){
    $('#signup-email').animate({right:'10px'},200);
});
    
//SIGNUP PW
$('#pw-next').on('click',function(){
    var password = $('#signup-pw').val();
    socket.emit('signup-password', password);
});
    
    
//SIGNUP USERNAME
$('#username-next').on('click',function(){
    var username = $('#signup-name').val();
    socket.emit('signup-username', username);
});
    
    
//FORGOT PW
$('#iforgot').on('click',function(){
    var email = $('#email').val();
    socket.emit('iforgot', email);
});
    
    
socket.on('success', function() {
    $('body').append('<div>check your email!</div>');
});

    
socket.on('duplicate', function() {
    $('body').append('<div>you signup already</div>');
});
    
               
});