
$(document).ready(function(){
	var socket 		= io.connect('http://localhost:8080', {'reconnect': false});
	
	$("form").live('submit', function(e){
		e.preventDefault();
		socket.emit($(this).attr('action'), {'parameters': $(this).serialize() })
		return false;
	
	});
	
	socket.on('login_failed', function(data){
		$("div.error").remove();
		$("form.login_form").before("<div class='alert alert-error'><div class='alert-error'>"+ data.error +"</div></div>");
	});
	
	socket.on('login_success', function(data){
		console.log(data)
		if(data.is_admin == 1){
			window.location.href = "/admin"
		}
	});
	
	socket.on('append_new_courses', function(data){
		console.log(data)
		$("#course_list").append(data.data)
	});
	
	$("a.logout").live('click', function(e){
		e.preventDefault();
		socket.emit('user_logout');
		return false;
	});
	
	socket.on('logout', function(){
		window.location.href = "/user"
	});
	
	$("div#course_list").ready(function(){
		socket.emit('get_courses');
		socket.on('display_courses', function(data){
			$("div#course_list").append(data.data)
		});
	});
	
	$(".drop_icon").live('click', function(){
        $(this)
            .removeClass('drop_icon')
            .addClass("collapse_icon")
            .removeClass("icon-arrow-down")
            .addClass("icon-arrow-up");
		
		
		if($(this).parent().siblings('div.content').children('div.chapter_list').attr('data') == 'no-data')
		{
		
			var chapter_div = $(this).parent().siblings('div.content').children('div.chapter_list');
			socket.emit('get_chapters', {'id' : $(this).parents('div.course_box').attr('id')});
		
			socket.on('display_chapters', function(data)
			{
				$(chapter_div).html(data.data);
				
			});
		}
			
        $(this)
            .parents("div.header")
            .siblings("div.content")
            .slideDown()
            .removeClass("hidden");
			
		
    });

    $(".collapse_icon").live('click', function(){
        $(this)
            .removeClass('collapse_icon')
            .addClass("drop_icon")
            .removeClass("icon-arrow-up")
            .addClass("icon-arrow-down");

        $(this)
            .parents("div.header")
            .siblings("div.content")
            .slideUp()
            .addClass("hidden");
    });
});