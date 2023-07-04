const image = document.querySelector("img");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const music = document.querySelector("audio");
const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");
const currentTimeEle = document.getElementById("current-time");
const durationEle = document.getElementById("duration");
const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const coverimg = document.getElementById("cover")
var rot = 0

// Music
const songs = [
    {
        name: "jacinto-1",
        displayName: "Electric Chill Machine",
        artist: "Jacinto Design",
    },
    {
        name: "jacinto-2",
        displayName: "Seven Nation Army (Remix)",
        artist: "Jacinto Design",
    },
    {
        name: "jacinto-3",
        displayName: "Goodnight, Disco Queen",
        artist: "Jacinto Design",
    },
    {
        name: "metric-1",
        displayName: "Front Row (Remix)",
        artist: "Metric/Jacinto Design",
    },
];

// Check if playing
let isPlaying = false;

// Update DOM
function loadSong(song) {
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    music.src = `music/${song.name}.mp3`;
    image.src = `img/${song.name}.jpg`;
}

// On load: Select first song randomly
let songIndex = Math.floor(Math.random() * songs.length);
loadSong(songs[songIndex]);

// Set Song Duration when it's possible to play a song
function setSongDuration(e) {
    const totalSeconds = Math.floor(e.target.duration);
    const durationMinutes = Math.floor(totalSeconds / 60);
    let durationSeconds = totalSeconds % 60;
    if (durationSeconds < 10) {
        durationSeconds = `0${durationSeconds}`;
    }
    durationEle.textContent = `${durationMinutes}:${durationSeconds}`;
}

// Play
function playSong() {
    isPlaying = true;
    playBtn.classList.replace("fa-play", "fa-pause");
    playBtn.setAttribute("title", "Pause");
    music.play();
}

//Cover img
playBtn.addEventListener("click", function() {
    coverimg.style = 'transform: rotate('+rot+'deg)'
    rot += 360
})

// Pause
function pauseSong() {
    isPlaying = false;
    playBtn.classList.replace("fa-pause", "fa-play");
    playBtn.setAttribute("title", "Play");
    music.pause();
}

// Previous Song
function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    progress.style.width = `0%`;
    playSong();
}

// Next Song
function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    progress.style.width = `0%`;
    playSong();
}

// Display progress bar width and calculate display for current time function
function barWidthAndCurrentTime() {
    const { duration, currentTime } = music;
    // Update progress bar width
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    // Calculate display for current time
    const currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);
    if (currentSeconds < 10) {
        currentSeconds = `0${currentSeconds}`;
    }
    currentTimeEle.textContent = `${currentMinutes}:${currentSeconds}`;
}

// Update Progress Bar & Time while playing
function updateProgressBar() {
    if (isPlaying) {
        barWidthAndCurrentTime();
    }
}

// Set Progress Bar and current time if and if not playing when user clicks on progress bar
function setProgressBar(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const { duration } = music;
    music.currentTime = (clickX / width) * duration;
    if (!isPlaying) {
        barWidthAndCurrentTime();
    }
}


// Event Listeners
music.addEventListener("canplay", setSongDuration);
playBtn.addEventListener("click", () => (isPlaying ? pauseSong() : playSong()));
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
music.addEventListener("timeupdate", updateProgressBar);
music.addEventListener("ended", nextSong);
progressContainer.addEventListener("click", setProgressBar);

var MAX_PARTICLES = 1000,
	RADIUS = 100,
	MAX_LINES = 5,
	MAX_LIFE_SPAN = 600,
	MIN_DENSITY = 15,
	OFFSET_DENSITY = 15,
	_context,
	_mouseX,
	_mouseY,
	_particles,
	_canvasWidth,
	_canvasHalfWidth,
	_canvasHeight,
	_canvasHalfHeight;

init();

function init() {

	_particles = [];
	_context = c.getContext('2d');

	window.addEventListener('resize', onResize);
	window.addEventListener('mousemove', onMouseMove);

	onResize();

	createInitialParticles();

	redraw();
}

function createInitialParticles() {

	var x;

	for (x = 50; x < _canvasWidth - 50; x += 25) {

		_particles.push(new Particle(x - _canvasHalfWidth,  -75 + (Math.random() * 100)));
	}
}

function onMouseMove(e) {

	_mouseX = e.pageX;
	_mouseY = e.pageY;
}

function onResize() {

	_canvasWidth = c.offsetWidth;
	_canvasHalfWidth = Math.round(_canvasWidth / 2);
	_canvasHeight = c.offsetHeight,
	_canvasHalfHeight = Math.round(_canvasHeight / 2);

	c.width = _canvasWidth;
	c.height = _canvasHeight;
}

function redraw() {

	var copyParticles = _particles.slice(),
		particle,
		i;

	if (_particles.length < MAX_PARTICLES && _mouseX && _mouseY) {

		particle = new Particle(_mouseX - _canvasHalfWidth, _mouseY - _canvasHalfHeight);
		
		_particles.push(particle);
		_mouseX = false;
		_mouseY = false;
	}

	_context.clearRect(0, 0, _canvasWidth, _canvasHeight);

	for (i = 0; i < copyParticles.length; i++) {

		particle = copyParticles[i];
		particle.update();
	}

	drawLines();

	requestAnimationFrame(redraw);
}

function drawLines() {

	var particleA,
		particleB,
		distance,
		opacity,
		lines,
		i,
		j;

	_context.beginPath();

	for (i = 0; i < _particles.length; i++) {

		lines = 0;
		particleA = _particles[i];

		for (j = i + 1; j < _particles.length; j++) {

			particleB = _particles[j];
			distance = getDistance(particleA, particleB);

			if (distance < RADIUS) {
				
				lines++;
				
				if (lines <= MAX_LINES) {

					opacity = 0.5 * Math.min((1 - distance / RADIUS), particleA.getOpacity(), particleB.getOpacity());
					_context.beginPath();
					_context.moveTo(particleA.getX() + _canvasHalfWidth, particleA.getY() + _canvasHalfHeight);
					_context.lineTo(particleB.getX() + _canvasHalfWidth, particleB.getY() + _canvasHalfHeight);
					_context.strokeStyle = 'rgba(255,255,255,' + opacity + ')';
					_context.stroke();
				}
			}
		}
	}
}

function Particle(originX, originY) {

	var _this = this,
		_direction = -1 + Math.round(Math.random()) * 2,
		_angle = Math.random() * 10,
		_posX = originX,
		_posY = originY,
		_density = MIN_DENSITY + Math.random() * OFFSET_DENSITY,
		_lifeSpan = 0,
		_opacity = 1;

	function update() {

		_lifeSpan++;

		if (_lifeSpan % 3 === 0) {

			_opacity = 1 - _lifeSpan / MAX_LIFE_SPAN;

			_angle += 0.001 * _direction;
			_posY += (Math.cos(_angle + _density) + 1) * 0.75;
			_posX += Math.sin(_angle) * 0.75;

			if (_lifeSpan >= MAX_LIFE_SPAN) {

				destroy();
			}
		}
	}

	function destroy() {

		var particle,
				i;

		for (i = 0; i < _particles.length; i++) {

			particle = _particles[i];

			if (particle === _this) {

				_particles.splice(i, 1);
			}
		}
	}

	this.getOpacity = function() { return _opacity; };
	this.getX = function() { return _posX; };
	this.getY = function() { return _posY; };
	
	this.update = update;
}

function getDistance(particle1, particle2) {

	var deltaX = particle1.getX() - particle2.getX(),
		deltaY = particle1.getY() - particle2.getY();

	return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}