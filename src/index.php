<?php
//function dump($s){ echo '<pre>'.print_r($s,true).'</pre>'; }
if (
	!(preg_match("/^\/index\.php\?/",$_SERVER["REQUEST_URI"])||preg_match("/^\/\?/",$_SERVER["REQUEST_URI"]))
	&&preg_match("/\/(.*)$/",$_SERVER["REQUEST_URI"],$match)
) {
	$_GET['q'] = substr($match[0],1);
}
$aQ = explode('/',$_GET['q']);
$sSlug = $aQ[0];
$sCacheFile = 'cache/'.$sSlug.'.html';
$bCached = file_exists($sCacheFile);
include($bCached?$sCacheFile:'index.html');
if ($bCached) echo '<!-- cached as '.$sCacheFile.' -->';
