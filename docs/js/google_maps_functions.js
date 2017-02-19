//Appends to the given docElement a pie chart with the population value for each element in the pieTotals array
function CreatePieChart(docElement, pieTotals)
{
	var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;
	
	var color = d3.scaleOrdinal()
		.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
	
	var arc = d3.arc()
		.outerRadius(radius - 10)
		.innerRadius(0);

	var labelArc = d3.arc()
		.outerRadius(radius - 40)
		.innerRadius(radius - 40);

	var pie = d3.pie()
		.sort(null)
		.value(function(d) { return d.population; });

	var svg = docElement.append("svg")
		.attr("width", width)
		.attr("height", height)
	  .append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	
	var g = svg.selectAll(".arc")
		.data(pie(pieTotals))
	.enter().append("g")
		.attr("class", "arc");

	g.append("path")
		.attr("d", arc)
		.style("fill", function(d) { return color(d.data.population); });

	g.append("text")
		.attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
		.attr("dy", ".35em")
		.text(function(d) { return d.data.population; });

	function type(d) {
	  d.population = +d.population;
	  return d;
	}

}

//Returns a container with both a map and heatmap layer to be used for visualization. Must be assigned to a spot in the html
function InitNewMap(center_lat, center_long, html_map_element)
{
	var mapData = {
		map: new google.maps.Map(html_map_element, {
			zoom: 18,
			center: {lat: center_lat, lng: center_long},
			mapTypeId: 'satellite'
		}),
		heatmap: null
		//Additional fields here as needed
	};
	return mapData;
}

function LoadAndProcessAndroidSurveyZipFile(file, onLoadFunction)
{
	zip.createReader(new zip.BlobReader(file), function(reader) {
		reader.getEntries(function(entries) {
			var pos = FindFileName(entries, "surveys.csv");
			if(pos == -1)
				return;
			entries[pos].getData(new zip.TextWriter(), function(text){
				var surveys = LoadSurveysFromString(text);
				
				var pos = FindFileName(entries, "breadcrumbs.csv")
				if(pos == -1)
					return;
				
				entries[pos].getData(new zip.TextWriter(), function(text){
					var breadcrumbs = LoadBreadcrumbsFromString(text);
					
					for(i = 0;i < breadcrumbs.length; i++)
					{
						var j;
						for(j = 0; j < surveys.length;j++)
						{
							if(surveys[j]._id == breadcrumbs[i].surveyID)
								break;
						}
						if(j >= surveys.length)
						{
							alert("Error while processing breadcrumbs, survey ID \"" + breadcrumbs[i] + "\" not found.");
							return;
						}
						surveys[j].breadcrumb_data.push(breadcrumbs[i]);
					}
					
					var pos = FindFileName(entries, "sightings.csv")
					if(pos == -1)
						return;
					
					entries[pos].getData(new zip.TextWriter(), function(text){
						var sightings = LoadSightingsFromString(text);
						
						for(i = 0;i < sightings.length; i++)
						{
							var j;
							for(j = 0; j < surveys.length;j++)
							{
								if(surveys[j]._id == sightings[i].surveyID)
									break;
							}
							if(j >= surveys.length)
							{
								alert("Error while processing sightings, survey ID \"" + sightings[i] + "\" not found.");
								return;
							}
							surveys[j].sighting_data.push(sightings[i]);
						}
						
						var pos = FindFileName(entries, "transects.csv")
						if(pos == -1)
							return;
						
						
						entries[pos].getData(new zip.TextWriter(), function(text){
							surveys.transects = LoadTransectsFromString(text);
							
							onLoadFunction(surveys);
						});
					});
				});
			});
		});
	}, function(error) {
		alert(error);
	});
}

function BuildJSONFromObject(obj)
{
	obj = JSON.stringify(obj);
	return obj;
}

function BuildObjectFromJSON(str)
{
	str = JSON.parse(str);
	return str;
}

function FindFileName(files, name)
{
	for(i = 0;i < files.length;i++)
	{
		if(files[i].filename == name)
			return i;
	}
	alert("Could not find \"" + name + "\".");
	return -1;
}

function LogSurveyInfoAction()
{
	return function(survey){
		console.log(survey);
	}
}

//Loads breadcrumbs from the given CSV and parses them into an array where each element is an object in the following format:
//id:[int]	surveyID:[string]	time_date:[string]	time_time:[string]	lat:[float]	lng:[float]	accuracy:[float]	speed:[float]
//Once the array is complete, it is passed as the only parameter to onLoadFunction.
//Note that this function will run asynchronously
function LoadBreadcrumbsFromFile(file, onLoadFunction)
{
	var reader = new FileReader();
	var func = function(e){
		var text = reader.result;
		onLoadFunction(LoadBreadcrumbsFromString(text));
	}
	reader.onload = func;
	reader.readAsText(file);
}

function LoadBreadcrumbsFromString(text)
{
	text = text.split('\n');
	text.splice(0, 1);//first line is labels
	for(var i = 0;i < text.length;i++)
	{
		if(text[i].length == 0)//blank line, remove it and try again
		{
			text.splice(i, 1);
			i--;
		}
		else
		{	
			var values = ParseCSVLine(text[i]);
			
			text[i] = {
				_id: parseInt(values[0]),
				surveyID: values[1],
				time_date: values[2],
				time_time: values[3],
				lat: parseFloat(values[4]),
				lng: parseFloat(values[5]),
				accuracy: parseFloat(values[6]),
				speed: parseFloat(values[7])
			};
		}
	}
	return text;
}

function LoadSurveysFromString(text)
{
	text = text.split('\n')
	text.splice(0, 1)
	for(var i = 0;i < text.length;i++)
	{
		if(text[i].length == 0)//blank line, remove it and try again
		{
			text.splice(i, 1);
			i--;
		}
		else
		{
			var values = ParseCSVLine(text[i]);
			
			text[i] = {
				_id: values[0],
				type: values[1],
				name: values[2],
				start_date: values[3],
				start_time: values[4],
				end_date: values[5],
				end_time: values[6],
				locationName: values[7],
				surveyorCount: parseInt(values[8]),//TODO: Make sure this is the correct format
				surveyorName: ParseCSVLine(values[9]),
				comment: values[10],
				habitatType: values[11],
				habitatCondition: values[12],
				windSpeed: values[13],
				habitatCondition: values[14],
				windSpeed: values[15],
				radius: values[16],
				cloudCover: values[17],
				engagement: values[18],
				breadcrumbs: values[19],
				temperature: values[20],
				upload: values[21],
				transdiv: values[22],
				ohumidity: values[23],
				orain: values[24],
				opressure: values[25],
				otemp: values[26],
				otime_date: values[27],
				otime_time: values[28],
				osnow: values[29],
				owinddir: values[30],
				owindspeed: values[31],
				ocity: values[32],
				ocountry: values[33],
				ocloudcover: values[34],
				omaxtemp: values[35],
				omintemp: values[36],
				osunrise_date: values[37],
				osunrise_time: values[38],
				osunset_date: values[39],
				osunset_time: values[40],
				totaltime: values[41],
				breadcrumb_data: [],
				sighting_data:[]
			}
		}
	}
	return text;
}

function LoadTransectsFromString(text)
{
	text = text.split('\n');
	text.splice(0, 1);//first line is labels
	for(var i = 0;i < text.length;i++)
	{
		if(text[i].length == 0)//blank line, remove it and try again
		{
			text.splice(i, 1);
			i--;
		}
		else
		{	
			var values = ParseCSVLine(text[i]);
			
			text[i] = {
				_id: parseInt(values[0]),
				name: values[1],
				desc: values[2],
			};
		}
	}
	return text;
}

function LoadSightingsFromFile(file, onLoadFunction)
{
	var reader = new FileReader();
	var func = function(e){
		var text = reader.result;
		
		onLoadFunction(LoadSightingsFromString(text));
	}
	reader.onload = func;
	reader.readAsText(file);
}

function LoadSightingsFromString(text)
{
	text = text.split('\n');
	text.splice(0, 1);//first line is labels
	for(var i = 0;i < text.length;i++)
	{
		if(text[i].length == 0)//blank line, remove it and try again
		{
			text.splice(i, 1);
			i--;
		}
		else
		{	
			var values = ParseCSVLine(text[i]);
			
			text[i] = {
				_id: parseInt(values[0]),
				surveyID: values[1],
				speciesCommon: values[2],
				speciesScientific: values[3],
				subfamilyCommon: values[4],
				subfamilyScientific: values[5],
				familyCommon: values[6],
				familyScientific: values[7],
				number: parseInt(values[8]),
				temperature: parseFloat(values[9]),
				windSpeed: values[10],
				windDirection: values[11],
				cloudCover: values[12],
				time_date: values[13],
				time_time: values[14],
				behavior: values[15],
				gender: values[16],
				condition: values[17],
				comment: values[18],
				transect: values[19],
				photoName: values[20],
				pressure: parseFloat(values[21]),
				ambientTemperature: values[22],
				illuminance: parseFloat(values[23]),
				relativeHumidity: values[24],
				wingLength: values[25],
				markFound: values[26],
				markAdded: values[27],
				lat: parseFloat(values[28]),
				lng: parseFloat(values[29]),
				locationTime_date: values[30],
				locationTime_time: values[31],
				locationAccuracy: parseFloat(values[32]),
				point: values[33],
				certainty: values[34],
				voucherID: values[35],
				voucherType: values[36],
				voucherLocation: values[37]
			};
		}
	}
	return text;
}

//Takes a string and returns an array of its contained values. Values must be comma separated and surrounded by quotation marks
//Quotation marks will not be included in the result
function ParseCSVLine(line)
{
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    // Return NULL if input string is not well formed CSV string.
    if (!re_valid.test(line)) return null;
    var a = [];                     // Initialize array to receive values.
    line.replace(re_value, // "Walk" the string using replace with callback.
        function(m0, m1, m2, m3) {
            // Remove backslash from \' in single quoted values.
            if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
            // Remove backslash from \" in double quoted values.
            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
            else if (m3 !== undefined) a.push(m3);
            return ''; // Return empty string.
        });
    // Handle special case of empty last value.
    if (/,\s*$/.test(line)) a.push('');
    return a;
}

//Generates an action to be passed into LoadBreadcrumbsFromFile.
//The returned action will apply the breadcrumbs generated by LoadBreadcrumbsFromFile to the map passed into this function as well as a view radius.
function MapBreadcrumbsToMapAction(map)
{
	return function(breadcrumbs){
		//Add proto polygons and lines
		MapBreadcrumbsToMap(breadcrumbs, map);
	};
}

function MapBreadcrumbsToMap(breadcrumbs, map)
{
	var pathCoordinates = [];
	for(var i = 0;i < breadcrumbs.length;i++)
	{
		// var marker = new google.maps.Marker({//Mark the breadcrumb
			// position: {lat: breadcrumbs[i].lat, lng: breadcrumbs[i].lng},
			// map: map,
			// title: breadcrumbs[i]._id.toString()
		// });
		
		pathCoordinates.push({lat: breadcrumbs[i].lat, lng: breadcrumbs[i].lng});//Add breadcrumb to the path
		
		// new google.maps.Circle({
			// strokeColor: '#FF0000',
			// strokeOpacity: 0.0,
			// strokeWeight: 2,
			// fillColor: '#FF0000',
			// fillOpacity: 0.25,
			// map: map,
			// center: pathCoordinates[pathCoordinates.length-1],
			// radius: 10
		// });
	}
	
	var surveyPath = new google.maps.Polyline({//Draw the path
		path: pathCoordinates,
		geodesic: true,
		strokeColor: '#FF0000',
		strokeOpacity: 1.0,
		strokeWeight: 1
	});
	surveyPath.setMap(map);
}

function MapSightingsToMapAction(map)
{
	return function(sightings){
		MapSightingsToMap(sightings, map)
	};
}

function MapSightingsToMap(sightings, map)
{
	for(var i = 0;i < sightings.length;i++)
	{
		var marker = new google.maps.Marker({//Mark the sighting
			position: {lat: sightings[i].lat, lng: sightings[i].lng},
			map: map,
			title: sightings[i].number + " " + sightings[i].speciesCommon + "(s)"
		});
	}
}

function MapSurveysToMapAction(map)
{
	return function(surveys)
	{
		var i;
		for(i = 0;i < surveys.length; i++)
		{
			MapSurveyToMap(map, surveys[i]);
		}
	}
}

function MapSurveyToMap(map, survey)
{
	MapBreadcrumbsToMap(survey.breadcrumb_data, map);
	MapSightingsToMap(survey.sighting_data, map);
}

function GetCenter(points)
{
	var maxLat = -90;
	var minLat = 90;
	var maxLng = -180;
	var minLng = 180;
	
	points.forEach(function(point) {
		if(point.lat > maxLat)
			maxLat = point.lat;
		if(point.lat < minLat)
			minLat = point.lat;
		if(point.lng > maxLng)
			maxLng = point.lng;
		if(point.lng < minLng)
			minLng = point.lng;
	});
	return {
		lat: (maxLat + minLat) / 2,
		lng: (maxLng + minLng) / 2
	};
}

function ChangeMapCenterByPointsAction(map)
{
	return function(points)
	{
		var center = GetCenter(points);
		map.setCenter(center);
	}
}