

///////////////////////////////////////////////////////////////////////////////////////////////////
////-----VARIABLES  ---------------///////////////////////////////////////////////////////////////////

var geojson;
var lat = 0;
var long = 0;
var mymap = L.map('map').setView([lat, long], 2);
var database_info = "";
var display_this = 1;//temp var to determine map color
var map_color_data ="";

 L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=${API_KEY}`, {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
}).addTo(mymap);




///////////////////////////////////////////////////////////////////////////////////////////////////
////---- BUILD MAP WITH GEOJASON ---------------/////////////////////////////////////////////////

function draw_map(db_data)
        {

            geojson = L.geoJson(worldData, {
                                            style: style,
                                            onEachFeature: onEachFeature,
                                            clickable: true
                                            }).addTo(mymap);

            // geojson.eachLayer(function (layer) {
            //     layer._path.id = feature.properties.postal;
            // });
       
        // }
 
    
        // draw_map();

///////////////////////////////////////////////////////////////////////////////////////////////////
////------- LEGEND ------------------/////////////////////////////////////////////////////////////


///--LEGEND POSITION:
var legend = L.control({
                        position: 'bottomright'
                      });

///--LEGEND CREATION:
legend.onAdd = function (map) 
    {
        var div = L.DomUtil.create('div', 'info legend'),
            colors = [15000, 20000, 50000, 100000, 200000, 500000, 1000000],
            labels = [];

        div.innerHTML += '<h4>GDP in Thousands of Millions of USD</h4>';

        // /FOR LOOP CREATE LEGEND -- Loops through GDP data and grabs colors for each range and puts them in the legend’s key
        for (var i = 0; i < colors.length; i++) 
                {
                    div.innerHTML +=
                        '<i style="background:' + getColor(colors[i] + 1) + '"></i>' +
                        colors[i] + (colors[i + 1] ? '&ndash;' + colors[i + 1] + '<br>' : '+');
                }

        return div;
    };
    legend.addTo(mymap);


///////////////////////////////////////////////////////////////////////////////////////////////////
////--- INFORMATION BOX --------///////////////////////////////////////////////////////////////////


///--ON HOVER-----DISPLAY COUNTRY INFO IN INFORMATION BOX 
var displayInfo = L.control();

displayInfo.onAdd = function (map) /// create a div with a class "info"
    {
        this._div = L.DomUtil.create('div', 'info'); 
        this.update();
        return this._div;
    };

///--POPULATE THE INFO BOX WITH HTML:
displayInfo.update = function (props) /// Passes properties of hovered upon country and displays it in the control
        {
            this._div.innerHTML = '<h2>Wealth of European Countries</h2>' + (props ?
                '<h3>' + props.formal_en + '</h3>' + '<b>' + 'GDP in Trillions of USD: ' + '</b>' + props.gdp_md_est / 1000000 + '<br />' +
                '<b>' + ' GDP in Billions of USD: ' + '</b>' + props.gdp_md_est / 1000 + '<br />' +
                '<b>' + 'Economic Status: ' + '</b>' + props.economy + '<br />' +
                '<p class ="flag">' + flags[0].emoji + '</p>' +
                '<b>' + 'Population: ' + '</b>' + props.pop_est / 1000000 + ' million people' :
                'Hover over a European country');
        };
        displayInfo.addTo(mymap);


function highlight(e) // UPDATE LEGEND  ON MOUSE OVER 
        {
            var layer = e.target;

            layer.setStyle({
                            weight: 3,
                            color: '#ffd32a'
                           });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {  layer.bringToFront(); }
      
            displayInfo.update(layer.feature.properties);  // Updates custom legend on hover
        }


function reset(e) /// RESET LEGEND ON MOUSE OUT
    {
        geojson.resetStyle(e.target);
        displayInfo.update();   // Resets custom legend when user unhovers
    }


function getColor(d) /// COLOR GRADIENT FOR 
    {
        // console.log("get color func is being called and display this is ", displayInfo);

        if ( display_this == 0 ) // GDP COLOR
            {        
            return  d > 1500000 ? '#49006a' :
                    d > 1000000 ? '#7a0177' :
                    d > 500000 ? '#ae017e' :
                    d > 200000 ? '#dd3497' :
                    d > 100000 ? '#f768a1' :
                    d > 50000 ? '#fa9fb5' :
                    d > 20000 ? '#fcc5c0' :
                    d > 15000 ? '#fde0dd' :
                    '#fff7f3'
            }
        if ( display_this == 1 ) // POPULATION COLOR
            {
            return  d > 500000000 ? '#49006a' :
                    d > 250000000 ? '#7a0177' :
                    d > 100000000 ? '#ae017e' :
                    d > 75000000 ? '#dd3497' :
                    d > 25000000 ? '#f768a1' :
                    d > 5000000 ? '#fa9fb5' :
                    d > 1000000 ? '#fcc5c0' :
                    d < 100000 ? '#fde0dd' :
                    '#fff7f3'
            }
        mymap.update();
    }

function flag(d) {} /// EMOJI FLAG PER COUNTRY 

for (var i = 1; i < flags.length; i++) 
        {
            // console.log(flags[i].emoji);
        }


function style(feature)  /// COLOR WHAT BASED ON THIS VARIABLE
    {   console.log("the style function is being called");
        
        if ( display_this == 0 ) { map_color_data = feature.properties.gdp_md_est}; // THIS CHANGES DATA BEING FED INTO COLOR
        if ( display_this == 1 ) { map_color_data = feature.properties.pop_est};// THIS CHANGES DATA BEING FED INTO COLOR
        if ( display_this == 2 ) { map_color_data = db_data };// THIS CHANGES DATA BEING FED INTO COLOR


        return {
                // fillColor: getColor(feature.properties.gdp_md_est),
                fillColor: getColor(map_color_data),
                weight: 1,
                opacity: 1,
                color: 'snow',
                fillOpacity: .5,
                className: feature.properties.name,
                };
    }

function highlight(e) // OUTLINING COUNTRY POLYGONS? 
    {
        var layer = e.target;

        layer.setStyle({
                        weight: 3,
                        color: '#ffd32a',
                        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge)   {   layer.bringToFront();    }

        displayInfo.update(layer.feature.properties);
    }


function reset(e) /// CLEARING INFO BOX 
    {
        geojson.resetStyle(e.target);
        displayInfo.update();
    }

function zoomToCountry(e) 
    {
        mymap.fitBounds(e.target.getBounds());
    }

function onEachFeature(feature, layer) 
    {
        layer.on({
                    mouseover: highlight, //highlight is a func
                    mouseout: reset,      // reset is a func
                    click: zoomToCountry  // zoom is a funct 
                });
    }



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 //           END  -    MAP   DRAW    FUNCTIONS 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




///////////////////////////////////////////////////////////////
//   D3 AND Button AND HTML  control 
///////////////////////////////////////////////////////////


    var button_1 = d3.select(".button_1");
    var button_2 = d3.select(".button_2");
    var button_3 = d3.select(".button_3");
    button_1.on("click", function() 
        { 
            display_this = 0;  //dictates color value thresholds -Hardcoded for now
            mymap.removeLayer(geojson) // clears map
            draw_map();  // draws new map 
            console.log("button_1 clicked");
            clickActions();
        });

    button_2.on("click", function() 
        { 
            display_this = 1; //dictates color value thresholds -Hardcoded for now
            mymap.removeLayer(geojson) // clears map
            draw_map();  // draws new map 
            console.log("button_2 clicked");
            clickActions();
        });


    button_3.on("click", function() 
        { 
            url = `/samples/balrank`
            d3.json(url).then(function(response) 
            {
              database_info = response ;
            });
      


            display_this = 1; //dictates color value thresholds -Hardcoded for now
            mymap.removeLayer(geojson) // clears map
            draw_map(database_info);  // draws new map 
            console.log("button_2 clicked");
            clickActions();
        });

    //////////////////////////////////////////////////////////////////////////
    //// IDENTIFYING MAP ELEMENT THAT HAS BEEN CLICKED 
    ///// EXTRACT COUNTRY NAME FROM CLASS NAME OF PATH ELEMENT

 function clickActions ()
 {
    var map_element = d3.selectAll("path");
    console.log("this is button", map_element);

    // This function is triggered when the button is clicked
    function handleClick() 
          {
            console.log("this item was clicked");
            // We can use d3 to see the object that dispatched the event
            console.log("this is event target", d3.event.target);
          }
    
    // We can use the `on` function in d3 to attach an event to the handler function
    map_element.on("click", handleClick);
    
    // You can also define the click handler inline
    map_element.on("click", function() 
              {
                element_clicked = d3.event.target;
                // console.log("this is the element clicked", element_clicked);
                // console.log("this is element class", element_clicked.className);
                 class_element =  element_clicked.className;
                // console.log("this is class names elements " , class_element.baseVal);  
                // example of element target returned
                //SVGAnimatedString {baseVal: "Madagascar leaflet-interactive", animVal: "Madagascar leaflet-interactive"}
                var class_names = class_element.baseVal;
                var class_names_text = class_names.toString();
                //  console.log("this is class name as text " ,class_names_text  );
                var class_split = class_names_text.split(" ");
                // console.log("this is class name split" ,class_split );
                var grab_all_before_this = class_split.length;
                var country_list = class_split.slice(0,(grab_all_before_this -1 ));
                var country_name = country_list.join(" ");
                console.log("this should be country name " , country_name );
                // console.log(" " ,  );
              });

    }

 clickActions();

}
 /////////////////////////////
 // INITIALIZER // 

function init() { draw_map(); }

 init(); 
/*




//////////////////////////////////////////////////////////////////
/////---VARIOUS D3 MOUSE CLICK SELECT OBJECT

    var button = d3.select("#click-me");

    // Getting a reference to the input element on the page with the id property set to 'input-field'
    var inputField = d3.select("#input-field");
    
    // This function is triggered when the button is clicked
    function handleClick() 
          {
            console.log("A button was clicked!");
            // We can use d3 to see the object that dispatched the event
            console.log(d3.event.target);
          }
    
    // We can use the `on` function in d3 to attach an event to the handler function
    button.on("click", handleClick);
    
    // You can also define the click handler inline
    button.on("click", function() 
              {
                console.log("Hi, a button was clicked!");
                console.log(d3.event.target);
              });




//////////////////////////////////////////////////////////////////////
//// --VARIOUS TOOL TIPS FROM D3


      // Step 1: Append a div to the body to create tooltips, assign it a class
    // =======================================================
    chartGroup.selectAll("rect")
        .on("mouseover", function() 
                {
                d3.select(this)
                        .attr("fill", "red");
                })

                var toolTip = d3.select("body").append("div")
                .attr("class", "tooltip");
            
              // Step 2: Add an onmouseover event to display a tooltip
              // ========================================================
              circlesGroup.on("mouseover", function(d, i)
                  {
                  toolTip.style("display", "block");
                  toolTip.html(`Pizzas eaten: <strong>${pizzasEatenByMonth[i]}</strong>`)
                      .style("left", d3.event.pageX + "px")
                      .style("top",  d3.event.pageY + "px");
                  })
                // Step 3: Add an onmouseout event to make the tooltip invisible
                .on("mouseout", function() 
                      {
                          toolTip.style("display", "none");
                      });
            }
            

        // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.rockband}<br>Hair length: ${d.hair_length}<br>Hits: ${d.num_hits}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });


      */