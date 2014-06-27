<?php
function dump($s){
	echo '<pre>'.print_r($s,true).'</pre>';
}
dump($_POST);
dump($_GET);