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
$('#signup').on('click',function(){
    
    var email = $('#email').val();
    
    socket.emit('signup', email);
    
});
    
//SIGNUP PW
$('#pw-next').on('click',function(){
    
    var password = $('#signup-pw').val();
    
    socket.emit('password', password);
    
});
    
    
//SIGNUP USERNAME
$('#username-next').on('click',function(){
    
    var username = $('#signup-name').val();
    
    socket.emit('username', username);
    
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