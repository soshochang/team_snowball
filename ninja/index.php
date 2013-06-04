<html>
<head>
	<title>RPG example - ajax</title>
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>

	<script type="text/javascript">
	$(document).ready(function(){

		$(document).keyup(function(data){
			if(data.keyCode == 37)
			{
				new_x = $('#x').val() - 1;
				$('#x').val(new_x);
				$('#direction').val('left');
			}
			else if(data.keyCode == 39)
			{
				new_x = parseInt($('#x').val()) + 1;
				$('#x').val(new_x);
				$('#direction').val('right');
			}
			else if(data.keyCode == 38)
			{
				new_y = $('#y').val() - 1;
				$('#y').val(new_y);
				$('#direction').val('top');
			}
			else if(data.keyCode == 40)
			{
				new_y = parseInt($('#y').val()) + 1;
				$('#y').val(new_y);
				$('#direction').val('down');
			}

			$('#test_form').submit();
		})

		$('#test_form').submit(function(){
			$.post(
				$(this).attr('action'),
				$(this).serialize(),
				function(data){
					$('#results').html(data);
				}
			);
			return false;
		});

		$('#test_form').submit();
	});
	</script>

</head>
<body>


	<form id="test_form" action="process.php" method="post">
		<input type="hidden" id="x" name="x" value="5" />
		<input type="hidden" id="y" name="y" value="5" />
		<input type="hidden" id="direction" name="direction" value="down" />

		<!-- <input type="submit" value="Submit" /> -->
	</form>

	<div id="results">
	</div>

</body>
</html>