$(document).ready(function(){

//LOG IN
var socket = io.connect('http://localhost:8000');
    
$('#login').on('click',function(){
    
    var email = $('#email').val();
    var password = $('#password').val();
    
    socket.emit('signup', email, password);
    
});
               
});