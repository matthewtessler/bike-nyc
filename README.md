<h1>Bike NYC</h1>
<h2>Overview</h2>
<p>New York City can be an intimidating place, especially for cyclists. This comprehensive guide gives you quick access to one of the city's best resources for cycling: Citibikes. Use our Google Maps integration to save a list of your favorite places to grab or park a Citibike. Simply sign-in to save a list of your favorite spots, and bike away!</p>

<h2>Future Features</h2>

<ul>
	<li>Add NYC DOT CityRack <a href="http://www1.nyc.gov/site/planning/data-maps/transportation/cityracks-map.page">data</a></li>
	<li>Use AJAX to improve load times</li>
</ul>

<h2>Data Model</h2>

<p>User data can be stored individually, with links to other data models that include information about favorited locations of stations and bike racks.</p>
<br>
<p>User Schema will include the name of the user, the borough they reside in, and list of their favorite locations (an array of Schemas).</p>
<br>
<p>Current schema setup: </p>

```javascript

// * station location
var Location = new mongoose.Schema({
    locationType: {type: String, required: true, enum: ['citibike', 'cityrack']},
    locationName: {type: String, required: true},
    stationID: {type: Number}
});

// * user information, including authentication information, += pass-loc-mong
var UserSchema = new mongoose.Schema({
    name: {type: String},
    borough: {type: String, required: false, enum: ['Manhattan', 'Brooklyn', 'Bronx', 'Queens', 'Staten Island', 'Commuter']},
    citibiker: {type: Boolean, default: false},
    cityracker: {type: Boolean, default: false},
    locations: [Location]
});


```

<h2>Wireframes</h2>

<p>Homepage contains most functionality, exception authentication and user page. Registration and log in are done with passport-local-mongoose on separate pages /login and /register.</p>
<p>/</p>

![Wireframe homepage](/documentation/wires.png?raw=true "Home page")

<p>User information page is a dedicated page where users can change their user information.</p>
<p>/user</p>

![User page](/documentation/wires-user.png?raw=true "User page")

<h2>Site map</h2>

![Sitemap](/documentation/site-map.png?raw=true "Sitemap")


<h2>User Stories</h2>

<p>As a person who commutes to work every morning on a Citibike, I want to keep track of my favorite locations to pick up and drop off bikes near my home and office.</p>
<p>I commute in to work every morning, but the train station is a few miles from my office. I need to keep track of the locations of CitiBike stations near the train station and the office.</p>
<p>I use Citibike to go on adventures during the weekend. I want to remember where I can pick up a Citibike to start my day.</p>

<h2>Research Topics</h2>

<ul>
	<li>(6 points) Integration user authentication (done)</li>
	<ul>
		<li>Implement sign-in with passport-local-mongoose (done)</li>
	</ul>
	<li>(2 points) Use a CSS framework</li>
	<ul>
		<li>Using <a href="http://materializecss.com">materialize.css</a></li>
	</ul>
	<li>(1 point) Google Maps integration to display Citibike locations</li>
	<li>(3 points) Using Citibike <a href="https://www.citibikenyc.com/system-data">system data</a></li>
</ul>

