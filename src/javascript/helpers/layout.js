const controlBoard = `<div class="controller">
	<a class="controller__button controller__button-start"
	>Start <i class="fa fa-play"></i>
	</a>
	<a class="controller__button controller__button-saveImage"
	><i class="fa fa-image"></i> Snapshot</a
>
<a class="controller__button snapshot__download" href="#" download=""
	><i class="fa fa-download"></i> Save Img</a
>
<a class=" controller__button controller__button-record"
	><i class="fa fa-circle"></i> Record</a
>

<span class="controller__button">
<section class="range-slider">
  <span class="rangeValues"></span>
  <input class="range-slider-min" value="0" min="0" max="255" step="1" type="number">
  <input class="range-slider-max" value="255" min="0" max="255" step="1" type="number">
</section>
</span>

<span class="controller__button">
	<h4>Rows number 3-100</h4>
<input
type="number"
min="3"
max="100"
value="15"
class="slider controller__slider-itemsNumber"
id="repeats"
	/>
	</span>

	<span class="controller__button">
	<h4>Size 1-10</h4>
<input
type="number"
min="1"
max="10"
value="1"
class="slider controller__slider-size"
id="size"
	/>
	</span>

	<span class="controller__button">
	<h4>Speed 1-100</h4>
<input
type="number"
min="1"
max="100"
value="50"
class="slider controller__slider-speed"
	/>
	</span>

	<span class="controller__button">
	<h4>Opacity 1-100</h4>
	<input
type="number"
min="1"
max="100"
value="50"
class="slider controller__slider-opacity"
	/>
	</span>

	<span class="controller__button">
	<h4>Rotate</h4>
	<label class="controller__switch">
	<input type="checkbox" class="controller__slider-rotate" />
	<span class="controller__toggle"></span>
	</label>
	</span>

	<span class="controller__button">
	<h4>Background</h4>
	<label class="controller__switch">
	<input type="checkbox" class="controller__slider-background" />
	<span class="controller__toggle"></span>
	</label>
	</span>

	<span class="controller__button">
	<h4>Spiral</h4>
	<label class="controller__switch">
	<input type="checkbox" class="controller__slider-spiral" />
	<span class="controller__toggle"></span>
	</label>
	</span>

	<span class="controller__button">
	<h4>Triangle</h4>
	<label class="controller__switch">
	<input type="checkbox" class="controller__slider-triangle" />
	<span class="controller__toggle"></span>
	</label>
	</span>

	<span class="controller__button">
	<h4>Color</h4>
	<label class="controller__colorWell">
	<input type="color" value="#00FFFF" class="controller__slider-color" />
	</label>
	</span>
	
		<span class="controller__button">
	<h4>Pattern</h4>
<select name="pattern" class="controller__select-pattern">
	<option value="circle">circle</option>
<option value="spiral">spiral</option>
	<option value="line">line</option>
	<option value="cone1">cone1</option>
	<option value="cone2">cone2</option>
	<option value="grid">grid</option>
	<option value="diagonal">diagonal</option>
	<option value="centered">centered</option>
	</select></span>

		<span class="controller__button">
	<h4>Shape</h4>
<select name="pattern" class="controller__select-pattern">
	<option value="circle">circle</option>
<option value="square">square</option>
	<option value="line">line</option>
	<option value="triangle">triangle</option>
	<option value="for">fork</option>
	</select></span>	


	<span class="controller__button">
	<!-- Full list of blend modes here
https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation -->
	<h4>Effect</h4>
<select name="effect" class="controller__select">
	<option value="source-over">No effect</option>
<option value="multiply">multiply</option>
	<option value="lighten">lighten</option>
	<option value="difference">difference</option>
	<option value="exclusion">exclusion</option>
	<option value="color-dodge">color dodge</option>
<option value="luminosity">luminosity</option>
	<option value="darken">darken</option>
	<option value="screen">screen</option>
	<option value="overlay">overlay</option>
	<option value="xor">xor</option>
	<option value="copy">copy</option>
	<option value="destination-atop">destination-atop</option>
	<option value="destination-over">destination-over</option>
	<option value="destination-out">destination-out</option>
	<option value="destination-in">destination-in</option>
	<option value="source-out">source-out</option>
	<option value="source-in">source-in</option>
	<option value="source-atop">source-atop</option>
	</select>
	</span>
	
	</div>`;

function createControlBoard() {
  document.getElementById("controlboard").innerHTML = controlBoard;
}


