function InitNewMap(center_lat, center_long, html_map_element)
{
	var mapData = {
		map: new google.maps.Map(html_map_element, {
		zoom: 50,
		center: {lat: center_lat, lng: center_long},
		mapTypeId: 'satellite'
	}),
	heatmap: null
	//Additional fields here as needed
	};
	return mapData;
}

function LoadBreadcrumbsFromFile(file, onLoadFunction)
{
	var reader = new FileReader();
	var func = function(e){
		var text = reader.result;
		text = text.split('\n');
		text.splice(0, 1);//first line is labels
		for(var i = 0;i < text.length;i++)
		{
			var quoteFlag = false;
			var commaFlag
			var values = [];
			var value = "";
			var prevChar;
			for(var j = 0;j < text[i].length;j++)
			{
				commaFlag = true;
				if(text[i][j] == '\"' && prevChar != '\'')//start or end of a value
				{
					if(quoteFlag)//end of value
					{
						values.push(value);
						value = "";
						commaFlag = false;
						quoteFlag = false;
					}
					else if(commaFlag)//start of value
					{
						quoteFlag = true;
					}
				}
				else if(quoteFlag)//value is already started
				{
					value += text[i][j];
				}
				else if(!commaFlag)//value is not started, deal with whitespace
				{
					if(text[i][j] == ',')
					{
						commaFlag = true;
					}
				}
				prevChar = text[i][j];
			}
			text[i] = {
				id: parseInt(values[0]),
				surveyID: values[1],
				time_date: values[2],
				latitude: parseFloat(values[3]),
				longitude: parseFloat(values[4]),
				accuracy: parseFloat(values[5]),
				speed: parseFloat(values[6])
			};
		}
		onLoadFunction(text);
	}
	reader.onload = func;
	reader.readAsText(file);
}