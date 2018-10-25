<?php

require_once "Counter.php";

$number = 10;

$counter = new Counter();


for($i=0;$i<$number;$i++){
	$counter->push();
}

 if($counter->displayValue() == $number){
	echo 'OK';
 }else {
 	echo 'NG';
 }
echo PHP_EOL;