$(document).ready(function(){

var socket = io.connect('http://localhost:8000');
    
//LOG IN
$('#login').on('click',function(){
    
    var email = $('#email').val();
    var password = $('#password').val();
    
    socket.emit('signup', email, password);
    
});
    
    
//SIGNUP
$('#signup').on('click',function(){
    
    var email = $('#email').val();
    
    socket.emit('signup', email);
    
});
    
               
});