var $timerSetupForm = document.querySelector("#timer-setup");
var $countdownContainer = document.querySelector("#countdown");
var $countdown = document.querySelector(".display");
var $cancelCountdown = document.querySelector(".cancel");
const TIME_UP_MUSIC = "fox.mp3";
var $audio = new Audio(TIME_UP_MUSIC);
var warned = false;
var crazy = false;

var minutes = 0;
var seconds = 5;
var upwards = true;
var countDown;
var blinker;

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
	
	countDown = beginCountdown(minutes, seconds);
	return false;
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
		//if (upwards) {
			$countdown.innerHTML = zeroPad(minutes, 2) + ":" + zeroPad(seconds, 2);
		// } else {
// 			$countdown.innerHTML = zeroPad(initialMinutes-minutes-1, 2) + ":" + zeroPad(initialSeconds-seconds+59, 2);
// 		}
		$countdownContainer.style.backgroundColor = "rgba(255, 0, 0, " + (secondsElapsed / totalSeconds) * (secondsElapsed / totalSeconds) + ")"

		if (secondsElapsed / totalSeconds >= 0.8 && !warned) {
			beep();
			warned = true;
		}

		if (secondsElapsed >= totalSeconds) {
			if(!crazy){
				beep();
				crazy = true;
			}
			done = true;
			if (!blinker) blinker = blink($countdown, 400);

			// cancelCountdown();
		}
	}, 1000);
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
	warned = false;
	crazy = false;
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

function beep() {
	console.log("beep");
	$audio.play();
	setTimeout(function(){$audio.pause();},5000);
}


