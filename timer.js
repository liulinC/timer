var $timerSetupForm = document.querySelector("#timer-setup");
var $countdownContainer = document.querySelector("#countdown");
var $countdown = document.querySelector(".display");
var $cancelCountdown = document.querySelector(".cancel");
const MILLISESSIONDS_PER_SECOND = 1000;
const AUDIO_PATH = "sounds/beep.mp3";
var audio = new Audio(AUDIO_PATH);

var warned = false;
var crazy = false;

var minutes = 0;
var seconds = 5;
var upwards = true;
var countDown;
var blinker;
var config = [];

function dumpConfig(){
	console.log("dump config");
	config.forEach(function(item){
		console.log(item);	
	});

}

function loadConfig(){
  $.ajax({
		dataType:"json",
		url:"config.json",
		async:false,
	})
	.done(function(data){
			data.forEach(function(item){
				config.push(item);	
			});
		console.log("loading json file successed");
		})
	.fail(function(){
			console.log("failed to load config file");
	});
	initConfig();
}

function initConfig(){
	config.forEach(function(item){
		item.triggered = false;	
	});
}

$timerSetupForm.onsubmit = function() {
	minutes = Number(document.querySelector("#minutes").value);
	seconds = Number(document.querySelector("#seconds").value);
	direction = document.querySelector('input[name="direction"]:checked').value;
	
	if (direction == "up") {
		upwards = true;
	} else {
		upwards = false;
		$countdown.innerHTML = zeroPad(minutes, 2) + ":" + zeroPad(seconds, 2);
	}
	loadConfig();
	dumpConfig();
	
	countDown = beginCountdown(minutes, seconds);
	return false;
}

function checkTrigger(secondsElapsed,totalSeconds){
	config.forEach(function(item){
		
		//Check each config item, trigger accordingly	
		var checkTimePoint = item.trigger	+ totalSeconds;

		if(secondsElapsed >= checkTimePoint){
			beep(item);
		}
	});
}

function clearConfig(){
	audio.pause();
	config.forEach(function(item){
		if(item.intervalRef){
			console.log("clear interval for "+item.name);
			clearInterval(item.intervalRef);
		}
	});

	config = [];

}
$cancelCountdown.onclick = cancelCountdown;

function beginCountdown(minutes, seconds) {
	$timerSetupForm.style.left = 10000;
	$countdownContainer.style.left = 0;

	var totalSeconds = (60 * minutes) + seconds;
	var secondsRemaining = totalSeconds;
	var secondsSinceEnd = 0 - totalSeconds;
	var initialMinutes = minutes;
	var initialSeconds = seconds;
	var secondsElapsed = 0;
	
	return setInterval(function() {
		secondsElapsed++;
		secondsRemaining--;
		secondsSinceEnd++;
		if (upwards) {
			minutes = Math.floor(secondsElapsed / 60);
			seconds = secondsElapsed - (minutes * 60);
		} else {
			if (secondsRemaining >= 0){
				minutes = Math.floor(secondsRemaining / 60);
				seconds = secondsRemaining - (minutes * 60);
			} else {
				minutes = Math.floor(secondsSinceEnd / 60);
				seconds = secondsSinceEnd - (minutes * 60);
			}
		}
		$countdown.innerHTML = zeroPad(minutes, 2) + ":" + zeroPad(seconds, 2);
		$countdownContainer.style.backgroundColor = "rgba(255, 0, 0, " + (secondsElapsed / totalSeconds) * (secondsElapsed / totalSeconds) + ")"

		checkTrigger(secondsElapsed,totalSeconds);

		if (secondsElapsed >= totalSeconds) {
			if (!blinker) blinker = blink($countdown, 400);
		}
	}, MILLISESSIONDS_PER_SECOND);
}

function cancelCountdown() {
	clearInterval(countDown);
	clearInterval(blinker);

	countDown = null;
	blinker = null;

	$countdown.style.display = "";
	$countdownContainer.style.backgroundColor = null;
	$timerSetupForm.style.left = 0;
	$countdownContainer.style.left = -10000;
	$countdown.innerHTML = "00:00";
	clearConfig();
}

function zeroPad(number, numLength) {
	numStr = number.toString();

	while (numStr.length != numLength) {
		numStr = "0" + numStr;
	}

	return numStr;
}

function blink(element, speed) {
	var defaultDisplay = element.style.display;
	speed = speed || 200;

	return setInterval(function() {
		element.style.display = element.style.display != "none" ? "none" : defaultDisplay;
	}, speed)
}

function beep(beepItem) {
	//if never triggered, we first init the video item,
	try{
		// For once beep, we only trigger once
		if(beepItem.triggered == true){
			return;	
		}

//		beepItem.video = new Audio(beepItem.location)

		beepItem.triggered = true;

		if(beepItem.type == "once"){
			playBeep(beepItem);
		}else{
			playBeep(beepItem);
			beepItem.intervalRef = setInterval(function(){playBeep(beepItem)},beepItem.interval*MILLISESSIONDS_PER_SECOND);
		}
		
	}catch(err){
		console.log("play beep error"+err);
	}
}

function playBeep(beepItem){
		console.log("play beep");
		audio.play();
	//	beepItem.video.play();
		setTimeout(function(){audio.pause();},beepItem.duration*MILLISESSIONDS_PER_SECOND);
}

