<img src="img/<?= $_POST['direction'] ?><?= ($_POST['x']+$_POST['y'])%2 + 1 ?>.png" style="position:absolute; top: <?= $_POST['y']*10 ?>px; left:<?= $_POST['x']*10 ?>px;" />


<?php

	if($_POST['x'] > 20 AND $_POST['y'] > 20)
	{
		echo '<img src="http://fc09.deviantart.net/fs41/f/2009/049/9/f/Awesome_Dragon_Drawing_by_MeowMaster789.jpg" style="position:absolute; top:200px; left:300px; width:200px;" />';
	}

?>