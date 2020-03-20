

///////////////////////////////////////////////////////////////////////////////////////////////////
////-----VARIABLES  ---------------////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

var geojson;
var lat = 20;
var long = 10;
var mymap = L.map('map').setView([lat, long], 2);
var database_info = "";
var display_this = 0;//temp var to determine map color
var map_color_data ="";
var db_data =[]; 
var initialize = 0;
var u = 0;
var box_count = -1;
var started = 0;

 L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=${API_KEY}`, {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 6,
    minZoom: 2,
    id: "mapbox.light",
}).addTo(mymap);


///////////////////////////////////////////////////////////////////////////////////////////////////
////---- BUILD MAP WITH GEOJASON ---------------///////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function draw_map(db_data)  /// THIS FUNCTION WRAPS MOST OF THIS CODE 
        {

          console.log("this is db data", db_data);
          if ( display_this < 11)
              {
              geojson = L.geoJson(worldData, {
                                              style: style,
                                              onEachFeature: onEachFeature,
                                              clickable: true
                                              }).addTo(mymap);
              } 
  /*
          if ( display_this >= 2)// PLACE HOLDER  FOR A 3RD DATA SET TO COLOR MAP?
              {
                geojson = L.geoJson(worldData, {
                                                style: style2(db_data),
                                                onEachFeature: onEachFeature,
                                                clickable: true
                                                }).addTo(mymap);
              }
  */
/////////////////////////////////////////////////////////////////////////////////////////////////
////------- LEGEND ------------------////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

  ///--LEGEND POSITION:
  var legend = L.control({
                          position: 'bottomleft'
               
                        });

  ///--LEGEND CREATION:
  legend.onAdd = function (map) 
      {
        console.log("initialize is ", initialize);

        var colorz =[];
        if ( display_this == 0 ) {colorz = [ 15000000, 10000000, 5000000,  2000000,   1000000,  500000,  200000,  150000];}
        if ( display_this == 1 ) {  colorz = [1000,300,250,200,150,100,75,50,25,10,0.1];}
         //if ( display_this == 1 ) {colorz = [   500000000,  250000000,  100000000,  75000000,  25000000, 5000000,  1000000, 100000 ];}
        if (display_this == 2 ) {  colorz = [160,140,120,100,80,60,40,20,10,1];}
        if ( display_this == 3 || display_this == 4|| display_this == 5)  {  colorz = [90,80,70,60,50,40,20,10,0];}
        if ( display_this== 7 ) {  colorz = [200,180,160,140,120,100,80,60,40,20,10,1];}
        if ( display_this== 6  || display_this== 8 || display_this == 9 )  {  colorz =  [55,50,45,40,35,30,25,10,5,1];}
        if (  display_this == 10 ) {colorz =  [25,20,15,10,5,2,0.1];}
 
          var div = L.DomUtil.create('div', 'info legend'),
              colors = colorz,
              labels = [];
     
          if ( display_this == 0 ) { div.innerHTML += '<font id="f1">  GDP in Millions USD  </font><br>';}
          if ( display_this == 1 ) { div.innerHTML += '<font id="f1">  Population in the Millions           </font><br>';}
          if ( display_this == 2 ) { div.innerHTML += '<font id="f1">  World Rank                           </font>'+ '<br><font id="f2">   (Lower is Better)   </font><br>';}
          if ( display_this == 3 ) { div.innerHTML += '<font id="f1">  Government Integrity                 </font>'+ '<br><font id="f2">   (Higher is Better)  </font><br>';}
          if ( display_this == 4 ) { div.innerHTML += '<font id="f1">  Judicial Effectiveness               </font>'+ '<br><font id="f2">   (Higher is Better)  </font><br>';}
          if ( display_this == 5 ) { div.innerHTML += '<font id="f1">  Fiscal Health                        </font>'+ '<br><font id="f2">   (Higher is Better)   </font><br>';}
          if ( display_this == 6 ) { div.innerHTML += '<font id="f1">  Inflation                            </font><br>';}
          if ( display_this == 7 ) { div.innerHTML += '<font id="f1">  Public Debt of GDP                   </font><br>';}
          if ( display_this == 8 ) { div.innerHTML += '<font id="f1">  Avg Income Tax Rate                  </font><br>';}
          if ( display_this == 9 ) { div.innerHTML += '<font id="f1">  Avg Corporate Tax Rate               </font><br>';}
          if ( display_this == 10 ){ div.innerHTML += '<font id="f1">  Unemployement                        </font><br>';}

          // /FOR LOOP CREATE LEGEND -- Loops through GDP data and grabs colors for each range and puts them in the legend’s key
          for (var i = 0; i < colors.length; i++) 
                  {
                    if ( i >= 1)
                    {
                      div.innerHTML +=
                          '<i  style="background:' + getColor(colors[i] + 1) + '"></i>' +
                          '<font id="leg_nums">'+ colors[i] +    (colors[i - 1] ? '&ndash;' + colors[i - 1] +'</font>' + '<br>' : '-');
                    }
                    if ( i <  1 )
                    {
                      div.innerHTML +=
                          '<i  style="background:' + getColor(colors[i] + 1) + '"></i>' +
                          '<font id="leg_nums">'+ colors[i] +    (colors[i - 1] ? '&ndash;' + colors[i ] +'</font>' + '<br>' : '+' +'<br>');
                    }        


                  }

          return div;
      };
      legend.addTo(mymap);


///////////////////////////////////////////////////////////////////////////////////////////////////
////--- INFORMATION BOX --------///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

  ///--ON HOVER-----DISPLAY COUNTRY INFO IN INFORMATION BOX

//  if (displayInfo) { mymap.removeLayer(displayInfo)  ;}


  var displayInfo = L.control();


  displayInfo.onAdd = function (map) /// create a div with a class "info"
      {

        // console.log("initialize is ", initialize);
          this._div = L.DomUtil.create('div', 'info');
          this.update();
          return this._div;
      };



  displayInfo.clear= function clear_displayInfo_box()///CLEAR CONTENT
      {
        this._div.innerHTML =("");    
      };

  ///--POPULATE THE INFO BOX WITH HTML:
  displayInfo.update = function (props) //, meta)//,db_data) /// Passes properties of hovered upon country and displays it in the control
          { 
            // console.log('props.iso_a2',  props.iso_a2);
            this._div.innerHTML =  (props ?  `<img id="imgr" src='static/js/Flags/${props.iso_a2}.png'`  + '>'+ '<br>' +   '<br>' +   
              '<font id="f1"> Country: ' + props.name + '</font>' + '<br>'+'<b>' + 'GDP in Trillions of USD: ' + '</b>' + props.gdp_md_est / 1000000 + '<br />' +
              '<b>' + ' GDP in Billions of USD: ' + '</b>' + props.gdp_md_est / 1000 + '<br />' +
              '<b>' + 'Economic Status: ' + '</b>' + props.economy + '<br />' +
              '<b>' + 'Population: ' + '</b>' + props.pop_est / 1000000 + ' million people' :'' );
          }
          displayInfo.addTo(mymap);

/////////////////////////////////////////////////////////////////////////
///   MY INFO BOX  INFO FROM FLASK 
/////////////////////////////////////////////////////////////////////////

    //  if (info_box) { mymap.removeLayer(info_box)  ;}
    //  if (info_box) {info_box.removeLayer()  ;}
    //  if (info_box) {info_box.remove()  ;}
      var info_box =  L.control();


      info_box.onAdd = function (map) /// create a div with a class "info"
          {
              // console.log("initialize is ", initialize);
              this._divi = L.DomUtil.create('table', 'info2');
              this.update();
              return this._divi;
          };

      info_box.clear= function clear_info_box()///CLEAR CONTENT
          {
            this._divi.innerHTML =("");    
          };

    var t = 0;
    var b = 0;


    
    // "GDP"  )               {display_this =0 ;}
    // "Population"  )        display_this =1 ;}
    // "World Rank"   )       {display_this =2 ;}
    // "Government Integrity" ){display_this=3 ;}
    // "Judical Effectiveness"){display_this=4 ;}
    // "Fiscal Health" )      {display_this =5 ;}
    // "Inflation"  )         {display_this =6 ;}
    // "Public Debt of GDP" ) {display_this =7 ;}
    // "Income Tax Rate"   )  {display_this =8 ;}
    // "Corporate Tax Rate")  {display_this =9 ;}
    // "Unemployment"   )     {display_this =10 ;}
      info_box.update = function (key,value) //UNPACK JSON
              {
              
                var category ="";
                var step = 0;
/*
                if ( display_this == 1 && key == "D. Population Millions")  {  this._divi.innerHTML += ('<tr id="row2"><td>' + key + '</td><td>'+  value + '</td></tr>');  category = key; }
                if ( display_this == 2 && key == "B. World Rank")           {  this._divi.innerHTML += ('<tr id="row2"><td>' + key + '</td><td>'+  value + '</td></tr>');  category = key;  }
                if ( display_this == 3 && key == "K. Govt Integrity")       {  this._divi.innerHTML += ('<tr id="row2"><td>' + key + '</td><td>'+  value + '</td></tr>');  category = key; }
                if ( display_this == 4 && key == "L. Judical Efficieny")    {  this._divi.innerHTML += ('<tr id="row2"><td>' + key + '</td><td>'+  value + '</td></tr>');  category = key;  }
                if ( display_this == 5 && key == "E. Fiscal Health")        {  this._divi.innerHTML += ('<tr id="row2"><td>' + key + '</td><td>'+  value + '</td></tr>');  category = key;  }
                if ( display_this == 6 && key == "G. Inflation")            {  this._divi.innerHTML += ('<tr id="row2"><td>' + key + '</td><td>'+  value + '</td></tr>');  category = key; }
                if ( display_this == 7 && key == "H. Public Debt of GDP")   {  this._divi.innerHTML += ('<tr id="row2"><td>' + key + '</td><td>'+  value + '</td></tr>');  category = key; }
                if ( display_this == 8 && key == "R. Income Tax Rate")      {  this._divi.innerHTML += ('<tr id="row2"><td>' + key + '</td><td>'+  value + '</td></tr>');  category = key; }
                if ( display_this == 9 && key == "S. Corporate Tax Rate")   {  this._divi.innerHTML += ('<tr id="row2"><td>' + key + '</td><td>'+  value + '</td></tr>');  category = key; }
                if ( display_this == 10 && key == "F. Unemployment")        {  this._divi.innerHTML += ('<tr id="row2"><td>' + key + '</td><td>'+  value + '</td></tr>');  category = key; }
                else if (key != category) { this._divi.innerHTML += ('<tr id="row1"><td>' + key + '</td><td>'+  value + '</td></tr>'); }
*/               
                ////  BELOW WE ASSIGN A ID TO SO CSS WILL MAKE FONT YELLOW FOR COUNTRY NAME AND LIST ITEM THAT MATCHES CURRENT CATEGORY  
                if ( key == "A. Country" )                                  {  step = 1; }
                if ( display_this == 1 && key == "D. Population Millions")  {  step = 1; }
                if ( display_this == 2 && key == "B. World Rank")           {  step = 1; }
                if ( display_this == 3 && key == "K. Govt Integrity")       {  step = 1; }
                if ( display_this == 4 && key == "L. Judical Efficieny")    {  step = 1; }
                if ( display_this == 5 && key == "E. Fiscal Health")        {  step = 1; }
                if ( display_this == 6 && key == "G. Inflation")            {  step = 1; }
                if ( display_this == 7 && key == "H. Public Debt of GDP")   {  step = 1; }
                if ( display_this == 8 && key == "R. Income Tax Rate")      {  step = 1; }
                if ( display_this == 9 && key == "S. Corporate Tax Rate")   {  step = 1; }
                if ( display_this == 10 && key == "F. Unemployment")        {  step = 1; }

                // SLICE BELOW TO TRIM OF THE LETTER WE USED TO CUSTOM SORT OUR LIST, ALSO CHECK FOR UNDEFINED -OR IT ERROR OUT AS SOME UNDEFINES ARE BEING FED IN?
                if ( step == 1 ) {this._divi.innerHTML += ('<tr id="row2"><td>' + key.slice(3,100) + '</td><td>'+  value + '</td></tr>');}
                // if ( step == 0 && key != category){ this._divi.innerHTML += ('<tr id="row1"><td>' + key + '</td><td>'+  value + '</td></tr>'); }
                if ( step == 0 && key != undefined )   {  this._divi.innerHTML +=   ('<tr id="row1"><td>' + key.slice(3)+ '</td><td>'+  value + '</td></tr>');  }

                //////////////////////////////
                // BELOW ATTEMPTED TO HAVE ALTERNATING ROW COLORS FOR READABILITY - IT ALTERNATES COLORS BUT CREATES A DUPE PAIR NEED A FOR LOOP PERHAPS WHERE CAN SPECIFY INDEX
                // console.log('this is key[b] ', key[0] );
                           //  this._divi.innerHTML += ('<li>' + key + ": " +  value + '</li>');
                //  if ( t == 0 ) { this._divi.innerHTML += ('<tr id="row1"><td>' + key + '</td><td>'+  value + '</td></tr>'); t=1;}
                //  if ( t == 1 ) { this._divi.innerHTML += ('<tr id="row2"><td>' + key + '</td><td>'+  value + '</td></tr>'); t =0;}
                 //this._divi.innerHTML += ('<tr id="row1"><td>' + key + '</td><td>'+  value + '</td></tr><tr id="row2"><td>' + key + '</td><td>'+  value + '</td></tr>'); 
                  // console.log('this is t', t);
                  // b+=1;
                };  
             
              info_box.addTo(mymap);
/////////////////////////////////////////////////////////////////////////
///  END MY INFO BOX 
////////////////////////////////////////////////////////////////////////  

/////////////////////////////////////////////////////////////////////////
///   INFO BOX 2
////////////////////////////////////////////////////////////////////////   

// if ( info_box_two == undefined )
// {
///////// THIS FREAKING WORKS WE CAN FIND HOW MANY EXIST /////////////

var all_boxes_3_ =  d3.selectAll(".info3")
var all_boxes_4_ =  d3.selectAll(".info4")

/*
if ( all_boxes_3_ != undefined &&  (all_boxes_3_._groups[0]).length > 1 )
      {
      d3.select(".info3").remove()
      //  all_boxes.remove()
      }
if ( all_boxes_4_ != undefined && (all_boxes_4_._groups[0]).length > 1 )
      {
      d3.select(".info4").remove()
      //  all_boxes.remove()
      }
*/

      // var delete_this = d3.selectAll( ((all_boxes._groups[0][0].rows).length ) = 2 )
      // if (     (all_boxes._groups[0][0].rows).length  == 2    ) /// this counts the number of rows in the table of the popup boxes - we want to delete the one with only 2 rows
      //     {
      //       d3.select(".info3").remove()
      //       //  all_boxes.remove()
      //     }
//////////////////////////////////////////////////
// if (started == 1 )
// {
var info_box_two = L.control();

info_box_two     = L.control({
                            position: 'topleft'
                            });


info_box_two.onAdd = function (map) /// create a div with a class "info"
    {

      console.log( "[] []  BOX COUNT << BeFoRe >> RESET [] []., ", box_count)
        if ( box_count == 1 || box_count == 3 ) 
        {
        this._divi_ = L.DomUtil.create('table', 'info3');
      // if (box_count == 0 || box_count == 1) {this._divi_ = L.DomUtil.create('table', 'info3'); console.log("just made a box 3");} // we are going to keep track of the boxes we make - inspect them later and then delete the empty one
      // if (box_count == 2 || box_count == 3) {this._divi_ = L.DomUtil.create('table', 'info4');console.log("just made a box 4");}
        // this._divi_.innerHTML =( '<h1>' +'<font id="f1">'+ 'Top 10 of Category'+'</h1>');
        if (box_count == 1 ) {
          this._divi_.innerHTML =('<tr><td>'  +'<font id="f1">'+ 'Country'+'</td><td>'+   '<font id="f1">'+ 'Top 10-B3' + "___" +`${box_count}` + '<tr><td>');   
          } 
        if (box_count == 3){
          this._divi_.innerHTML =('<tr><td>'  +'<font id="f1">'+ 'Country'+'</td><td>'+   '<font id="f1">'+ 'Top 10-B4' + "___" +`${box_count}`  + '<tr><td>');   
          }  
         
        this.update();
      console.log( "[] []  BOX COUNT AFTER update [] []., ", box_count)
        // console.log("The BOX COUNT IS:", box_count);
      // box_count+=1 ;
         if (box_count >3 ){box_count =-1;}
        return this._divi_;
        }
    };

console.log("BELOW Info box :", info_box_two);

info_box_two.clear= function clear_info_box()///CLEAR CONTENT
    {
      this._divi_.innerHTML =("clear function called");    
    };

// info_box_two.update = function (dics) //UNPACK JSON
info_box_two.update = function(dics) //UNPACK JSON
        {
          iter = 0;
          // this._divi_.innerHTML =+(`<tr><td>${dics} ${'above map'} </td></tr>`); 
         if (dics != undefined && this._divi_ != undefined )
            { 
              // console.log("from info box two update dics[0] is +++++> ", dics[0] );
              // console.log("from info box two update dics[0].name is +++++> ", dics[0].name);
             while(iter < 10 )//THIS TOOK FOREVER TO FIGURE OUT - MAP WOULD NOT WORK!!!!!!!!!!!!!!!!!!!!!!!!
              {
              this._divi_.innerHTML += ('<tr><td>' + `${dics[iter].name}`  + '</td><td>'+   `${dics[iter].value}` + '</td></tr>'); 
              iter+=1;
              }
           }
        }

         box_count+=1;
         console.log("xxxxxxxxxxxx   RIGHT ABOVE ADD BOX 2 TO MAP, BOX COUNT IS :  xxxxxxxxxxx", box_count);

     if (box_count == 1 || box_count == 3){ info_box_two.addTo(mymap); }

       

        function top_tens(query)
        {
          // if (started == 0 ) {query = "GDP";}
          //  console.log("top tens called with this query", query);
           urls = `/top_ten/${query}`/// API ADDRESS USE COUNTRY NAME AS QUERY 
          d3.json(urls).then(function(response) //JSON RESPONSE
                {
                      var infos = response ;
                      // console.log("this is the data for top ten pre sort ", response);
                      //////////////////////////////////////////////////////
                      //// DO WE NEED TO SORT THIS DIFFERENTLY ? UNLOCK BELOW IF SO
                     /* infos.sort(function(a,b){
                        //return a.value - b.value; // if this is a - b then is asc
                        return a.value + b.value; // if this is a +  b then is desc
                        });
                        */
                     ///////////////////////////////////////////////////////   
                    // console.log("this is the data for top ten after sort infos ", infos);
                  if(infos != undefined){  info_box_two.update(infos);}//PASS JASON TO INFO_BOX.UPDATE FUNC    
                });
        }

      
        // var all_boxes_3_ =  d3.selectAll(".info3")
        // var all_boxes_4_ =  d3.selectAll(".info4")
  
        // console.log("<<<<----<><><><> All_BOXES ARE Info3  <><><><>--- >>>>>", all_boxes_3_) ;
        // console.log("<<<<----<><><><> All_BOXES ARE Info4<><><><>--- >>>>>", all_boxes_4_) ;
        // // 1st time through bx ct = 1 box id is 3
        // // 2nd time through bx ct = 2 box id is 4 remove 3 box ct to 0 
        // // // 3rd time through bx ct = 0 box id is 3  
        // if (box_count == 3 ) { all_boxes_3_.remove()}
        // if (box_count == 4 ) { all_boxes_4_.remove(),   box_count =0;}

        // if (box_count >=2 ) {box_count =0;}
  
        // console.log("<<<< The-----> AMOUNT <------- of All_boxes are >>>>>", (all_boxes._groups[0]).length) ;
        // console.log("<<<< The-----> AMOUNT <------- of All_boxes are >>>>>", (all_boxes._groups[0][0].rows).length) ;
        // var delete_this = d3.selectAll( ((all_boxes._groups[0][0].rows).length ) = 2 )
        /*
        if (   ( all_boxes_3_._groups[0]).length > 0    ) /// this counts the number of rows in the table of the popup boxes - we want to delete the one with only 2 rows
                {
                  if ( (all_boxes_3_._groups[0][0].rows).length == 2 ){all_boxes_3_.remove()}
                }
  
        if (   ( all_boxes_4_._groups[0]).length > 0    ) /// this counts the number of rows in the table of the popup boxes - we want to delete the one with only 2 rows
            {
              if ( (all_boxes_4_._groups[0][0].rows).length == 2 ){all_boxes_4_.remove()}
            }
*/

      //  d3.select( all_boxes._groups[0][0].rows).length ) = 2 )
/////////////////////////////////////////////////////////////////////////
///  END MY INFO BOX 2
////////////////////////////////////////////////////////////////////////  


///////////////////////////////////////////////////////////////////////////////////////////////////
////--- MAP STYLING ------------///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function highlight(e) /// HOVER ON MAP ITEMS - UPDATES INFO BOXES AND OUTLINES COUNTRY
      {
          var layer = e.target;

          layer.setStyle({
                          weight: 3,
                          color: '#ffd32a'
                          });

          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {  layer.bringToFront(); }
    
          displayInfo.update(layer.feature.properties);  // Updates custom legend on hover
          // info_box(layer.feature.properties);
      }


function reset(e) /// RESET LEGEND ON MOUSE OUT
    {
        geojson.resetStyle(e.target);
        displayInfo.update();   // Resets custom legend when user unhovers
    }


function getColor(d) /// COLOR GRADIENT THRESHOLDS FOR MAP
    {
        // console.log("get color func is being called and display this is ", displayInfo);
        // console.log("get color func is being called and display this is ", displayInfo);
        // console.log("display this value is:" , display_this);


                      // [  1500000, 1000000, 500000,  200000,   100000,  50000,  20000,  15000];}
        if ( display_this == 0 ) // GDP COLOR
              {        
              return  d > 15000000 ? '#49006a' :
                      d > 10000000 ? '#7a0177' :
                      d > 5000000 ? '#ae017e' :
                      d > 2000000 ? '#dd3497' :
                      d > 1000000 ? '#f768a1' :
                      d > 500000 ? '#fa9fb5' :
                      d > 200000 ? '#fcc5c0' :
                      d > 150000 ? '#fde0dd' :
                      '#fff7f3'
              }

            
                // POPULATION COLOR   [1000,400,300,250,200,150,100,75,50,25,10,0.1];
              if ( display_this== 1 ) // ECO TEST
              {
              return  d > 1000  ?   '#ff0040' :
                      // d > 400   ? '#e45b00'  :
                      d > 300   ? '#2a003d' :
                      d > 250   ? '#420060' :
                      d > 200   ? '#680188' :
                      d > 150   ? '#7a0177' :
                      d > 100   ? '#ae017e' :
                      d > 75    ? '#c4058d' :
                      d > 50    ? '#dd3497' :
                      d > 25    ? '#f768a1' :
                      d > 10    ? '#ff92be':
                      d > .1   ? '#ffb6d3' :
                      '#fff7f3'
              }
  
        // if ( display_this == 1 ) // POPULATION COLOR
        //       {
        //       return  d > 500000000 ? '#49006a' :
        //               d > 250000000 ? '#7a0177' :
        //               d > 100000000 ? '#ae017e' :
        //               d > 75000000 ? '#dd3497' :
        //               d > 25000000 ? '#f768a1' :
        //               d > 5000000 ? '#fa9fb5' :
        //               d > 1000000 ? '#fcc5c0' :
        //               d < 100000 ? '#fde0dd' :
        //               '#fff7f3'
        //       }

              // Government_Integrity, Judical_Effectiveness,  Fiscal_Health 0-100
          if ( display_this == 3 || display_this == 4|| display_this == 5) // ECO TEST
                {               
                return  d > 90 ? '#260038' :
                        d > 80 ? '#34004d' :
                        d > 70 ? '#49006a' :
                        d > 70 ? '#680188' :
                        d > 60 ? '#7a0177' :
                        d > 50 ? '#ae017e' :
                        d > 40 ? '#c4058d':
                        d > 20 ? '#dd3497':
                        d > 10 ? '#f768a1':
                        d > 0  ? '#ffaccd':
                        '#fff7f3'
                }


                // if ( display_this== 7 ) {  colorz = [200,180,160,140,120,100,80,60,40,20,10,0];}
        
             // World_Rank  0-180 
          if ( display_this == 2 ) // ECO TEST
                {
                return  d > 160 ? '#260038' :
                        d > 140 ? '#49006a' :
                        d > 120 ? '#680188' :
                        d > 100 ? '#7a0177' :
                        d > 80 ? '#ae017e ' :
                        d > 60 ? '#c4058d' :
                        d > 40 ? '#dd3497' :
                        d > 20 ? '#ff80b3' :
                        d > 10 ? '#f768a1' :
                        d > 1? '#ff92be' :
                            '#fff7f3'
                }
                // if ( display_this== 7 ) {  colorz = [200,180,160,140,120,100,80,60,40,20,10,0];}

             // Public_Debtof_GDP   0-236
            if ( display_this== 7 ) // ECO TEST
            {
            return  d > 200  ?  '#df0505'  :
                    d > 180   ? '#e45b00'  :
                    d > 160   ? '#2a003d' :
                    d > 140   ? '#34004d' :
                    d > 120   ? '#680188' :
                    d > 100   ? '#7a0177' :
                    d > 80    ? '#ae017e' :
                    d > 60    ? '#c4058d' :
                    d > 40    ? '#dd3497' :
                    d > 20    ? '#f768a1' :
                    d > 10    ? '#ff92be':
                    d > 1   ? '#ffb6d3' :
                    '#fff7f3'
            }

            // if ( display_this== 2  ) {  colorz = 200,170,140,110,80,45,15,12,9,6,3;}


              // Inflation , Income Tax Rate, Copr Tax Rate -.9 to 50,60 1087  [55,50,45,40,35,30,25,10,5,1]
          if (display_this== 6 || display_this== 8 || display_this == 9 ) // ECO TEST
                {
                return  d > 55?  '#260038' :
                        d > 50 ? '#34004d' :
                        d > 45 ? '#49006a' :
                        d > 40 ? '#680188' :
                        d > 35 ? '#7a0177' :
                        d > 30 ? '#ae017e' :
                        d > 25 ? '#c4058d':
                        d > 10 ? '#dd3497':
                        d > 5  ? '#f768a1':
                        d > 1  ? '#ffb6d3':
                          '#fff7f3'
                  }

                // Unemployment 0-28 [25,20,15,10,5,2,.5]
          if ( display_this == 10  ) // ECO TEST  [25,20,15,10,5,2,.5]
                  {
                  return      d > 25 ?  '#260038' :
                              d > 20 ? '#34004d' :
                              d > 15 ? '#49006a' :
                              d > 10 ? '#680188' :
                              d > 5 ? '#7a0177' :
                              // d > 4 ? 'rgb(255,0,0)' :
                              d > 2 ? '#c4058d':
                              d > .1 ? '#f768a1':
                          '#fff7f3'
                    }


    


        mymap.update();




        }



function style(feature)  /// COLOR OF COUNTRYS BASED ON THIS VARIABLE FROM GEOJSON
    {   
      //  console.log("the style function is being called");
             if ( display_this == 0 ) { map_color_data = feature.properties.gdp_md_est}; 
           // if ( display_this == 1 ) { map_color_data = feature.properties.pop_est};
            // if ( display_this == 0 ) { map_color_data = feature.properties.GDP_Billions_PPP};
            if ( display_this == 1 ) { map_color_data = feature.properties.Population_Millions};
            if ( display_this == 2 ) { map_color_data = feature.properties.World_Rank};
            if ( display_this == 3 ) { map_color_data = feature.properties.Government_Integrity };
            if ( display_this == 4 ) { map_color_data = feature.properties.Judical_Effectiveness };
            if ( display_this == 5 ) { map_color_data = feature.properties.Fiscal_Health };
            if ( display_this == 6 ) { map_color_data = feature.properties.Inflation };
            if ( display_this == 7 ) { map_color_data = feature.properties.Public_Debtof_GDP };
            if ( display_this == 8 ) { map_color_data = feature.properties.Income_Tax_Rate };
            if ( display_this == 9 ) { map_color_data = feature.properties.Corporate_Tax_Rate };
            if ( display_this == 10) { map_color_data = feature.properties.Unemployment };
            // console.log("display this value is:" , display_this);
    
          return {
               
                  // fillColor: getColor(feature.properties.gdp_md_est),
                  fillColor: getColor(map_color_data),
                  weight: 1,
                  opacity: 1,
                  // color: 'snow',
                  fillOpacity: .72,
                  className: feature.properties.geounit,
                  };
         
    }  


function highlight(e) // OUTLINING COUNTRY POLYGONS /// API CALL ON HOVER COUNTRY
    {
        info_box.clear();
        var layer = e.target;

        layer.setStyle({
                        weight: 3,
                        color: '#ffd32a',
                        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge)   {   layer.bringToFront();    }

        ////// JSON API REQUEST //////////////////////////////////////////////
        name_country =layer.feature.properties.name ; // OR // props.name;

        urlz = `/metadata/${name_country}`/// API ADDRESS USE COUNTRY NAME AS QUERY 
                    
              d3.json(urlz).then(function(response) //JSON RESPONSE
                    {
                        var info = response ;
                        // console.log("this is the data", response);
                        // info_box.update(info);
                        Object.entries(info).forEach(([key, value]) =>
                            {
                              // console.log("the Country>>>>>> info list, JSON key and value breakout  ", key, value);
                              info_box.update(key,value);//PASS JASON TO INFO_BOX.UPDATE FUNC
                            });   
                    });

        displayInfo.update(layer.feature.properties);
    }


function reset(e) /// CLEARING INFO BOX 
    {
        geojson.resetStyle(e.target);
        
        // IF WE WANT INFO BOXES TO CLEAR OUT ON MOUSE OUT UNCOMMENT 2 LINES BELOW - 
        // IF LEAVE LINES COMMENTED OUT BELOW - INFO BOXES ONLY UPDATE ON NEW HOVER TARGET
        ///////////////////////////////////////////////////////////////////////////////////
        // displayInfo.update();
        //  info_box.clear();
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

    // if (started == 0 ) { top_tens("GDP");}
    if (started == 0 ) { started = 1;}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 //           END  -    MAP    FUNCTIONS 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
function top_tens(query)
{
  //  console.log("top tens called with this query", query);
   urls = `/top_ten/${query}`/// API ADDRESS USE COUNTRY NAME AS QUERY 
  // urls = `/top_ten/<World_Rank>`/// API ADDRESS USE COUNTRY NAME AS QUERY 
d3.json(urls).then(function(response) //JSON RESPONSE
         {
             var infos = response ;
             console.log("this is the data for top ten", response);
            // info_box_two.update(infos);//PASS JASON TO INFO_BOX.UPDATE FUNC

             Object.entries(infos).forEach(([key, value]) =>
                 {
                  //  console.log("TOP 10 >>> the for each breakout JSON of key and value", infos)
                  //  console.log("TOP 10 >>>info list, JSON key and value breakout ",  key, value);
                  info_box_two.update(key, value);//PASS JASON TO INFO_BOX.UPDATE FUNC
                 });   
         });
}
*/

//  top_tens();
/* BUG NOTES ON TOP TEN LIST
1.why can I access the individual components of the top 10 list 
2.why does java tell me I cant split or slice results like I can in other list
3.look at console log of info box 2 list how is it diff then top 10 
4.format 3 diff list types in python and test each one coming back
*/

////////////////////////////////////////////////////////////////////////////
//   D3 AND Button AND HTML  control                      /////////////////
///////////////////////////////////////////////////////////////////////////

    var button_1 = d3.select(".button_1");
    var button_2 = d3.select(".button_2");
    var button_3 = d3.select(".button_3");
    var world_drop = d3.select(".world_scroll");

    button_1.on("click", function() 
        { 
            display_this = 0;  //dictates color value thresholds -Hardcoded for now
            // mymap.removeLayer(displayInfo);
            // mymap.removeLayer(legend);
            mymap.removeLayer(displayInfo) ; 
            displayInfo.remove();
            legend.remove();
            mymap.removeLayer(geojson); // clears map
            info_box.clear();
            displayInfo.clear();
            d3.selectAll(".info")
            .remove()
            draw_map();  // draws new map 
            console.log("button_1 clicked");
            clickActions();
        });


    button_2.on("click", function() 
        { 
          
            display_this = 1; //dictates color value thresholds -Hardcoded for now
            displayInfo.remove();
            mymap.removeLayer(displayInfo) ; 
            legend.remove();
            info_box.clear();
            displayInfo.clear();
            d3.selectAll(".info")
            .remove()
            mymap.removeLayer(geojson); // clears map
            draw_map();  // draws new map 
            console.log("button_2 clicked");
            clickActions();
        });
        

 
  //  world_drop.on("click", function()      
   world_drop.on("change", function() 
           { 
             query = ''
            // if ( world_drop.property("value") == "Inflation"   ){console.log("gov inflation selected");}
            // if ( world_drop.property("value") != "Inflation"   ){console.log("something selected");}
            if ( world_drop.property("value") == "GDP"  )               {query = 'GDP_Billions_PPP';        display_this =0 ;}
            if ( world_drop.property("value") == "Population"  )        {query = 'Population_Millions' ;    dispay_this =1 ;}
            if ( world_drop.property("value") == "World Rank"   )       {query = 'World_Rank'  ;            display_this =2 ;}
            if ( world_drop.property("value") == "Government Integrity" ){query= 'Government_Integrity' ;   display_this=3 ;}
            if ( world_drop.property("value") == "Judical Effectiveness"){query= 'Judical_Effectiveness';   display_this=4 ;}
            if ( world_drop.property("value") == "Fiscal Health" )      {query = 'Fiscal_Health' ;          display_this =5 ;}
            if ( world_drop.property("value") == "Inflation"  )         {query = 'Inflation';               display_this =6 ;}
            if ( world_drop.property("value") == "Public Debt of GDP" ) {query = 'Public_Debtof_GDP' ;      display_this =7 ;}
            if ( world_drop.property("value") == "Income Tax Rate"   )  {query = 'Income_Tax_Rate' ;        display_this =8 ;}
            if ( world_drop.property("value") == "Corporate Tax Rate")  {query =  'Corporate_Tax_Rate';     display_this =9 ;}
            if ( world_drop.property("value") == "Unemployment"   )     {query = 'Unemployment' ;           display_this =10 ;}

           

            // info_box_two.remove();

            legend.remove();
            displayInfo.remove();
            
            // if ( info_box_two != undefined )
            // {
            // info_box_two.remove();
            /*
            ///////// THIS FREAKING WORKS WE CAN FIND HOW MANY EXIST /////////////
            var all_boxes =  d3.selectAll(".info3")
            console.log("<<<<----<><><><> All_BOXES ARE <><><><>--- >>>>>", all_boxes) ;
            console.log("<<<< The-----> AMOUNT <------- of All_boxes are >>>>>", (all_boxes._groups[0]).length) ;

            if (  (all_boxes._groups[0]).length > 1 )
                  {
                  d3.select(".info3").remove()
                  //  all_boxes.remove()
                  }
            //////////////////////////////////////////////////
*/

              // .remove()

            // }?


            // info_box.clear();
            // info_box_two.remove();
            // info_box_two.clear();

            // d3.select(".info3")
            // .remove()
            // mymap.removeLayer(displayInfo);
            d3.selectAll(".info2")
              .remove()
            geojson.remove();


            // top_tens(query); // original location

     
            draw_map();  // draws new map 
            if (box_count >=2 ) { top_tens(query); }// moved location for testing 

            
            // console.log(world_drop.property("value"));
            // console.log("drop down clicked");
            // console.log("display this value is:" , display_this);
            clickActions();
            // top_tens((world_drop.property("value")));

        });






      
    // function fillit(db_data) ///THIS DOESNT WORK TO COLOR MAP BUT DOES BRING IN JSON
    //     {
    //       console.log( "fillit db_data is: ", db_data) ;
        
    //       for (var d = 0; d < db_data.length; d++) 
    //           {
    //              if (    db_data[d].balance_rank > 175 ) {colorz = '#49006a';}
    //              if (    db_data[d].balance_rank > 150) {colorz = '#7a0177' ;}
    //              if (    db_data[d].balance_rank > 125 ) {colorz = '#ae017e' ;}
    //              if (    db_data[d].balance_rank > 100 ) {colorz =  '#dd3497' ;}
    //              if (    db_data[d].balance_rank > 75 ) {colorz =  '#f768a1' ;}
    //              if (    db_data[d].balance_rank > 50 ) {colorz =  '#fa9fb5' ;}
    //              if (    db_data[d].balance_rank > 25 ) {colorz =  '#fcc5c0' ;}
    //              if (    db_data[d].balance_rank < 10 ) {colorz = '#fde0dd' ;}
             
                          
    //         var  countrys = (`${db_data[d].country}`+`\xa0`+"leaflet-interactive");
    //            console.log("this is countrys", countrys);
    //         //  console.log( `${db_data[d].country}`);

    //          var   countries = d3.select(`.${countrys}`);
    //             countries.select("fill")
    //            .append("path")
    //            .attr("fill", colorz)
    //            .append("path")
    //            .attr("color", colorz)
    //            .attr("z-index", 2)

    //         // display_this = 2; //dictates color value thresholds -Hardcoded for now
    //         }
            
    //   }

    // button_3.on("click", function() 
    //     { 
    //         //  var url = `http://127.0.0.1:5000/samples/balrank`;
    //         var url = "/metadata/balrank";
    //         // url =  `/metadata/Germany`
    //         // url = `/names`
    //         console.log("this is the url ", url);
    //         // const dataPromise = d3.json(url);
    //         // console.log("Data Promise: ", dataPromise);

    //         d3.json(url).then(function(response) 
    //             {
    //             //  // my json looks just like this but wont take 
    //             // var url=  `https://api.spacexdata.com/v2/launchpads`;
    //             db_data = response;
    //             console.log("db_data.length", db_data.length);
    //             fillit(db_data);
    //             });
    //   });

     
////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////END OF DRAWMAP FUNCTION WRAP////////////////////////////////////////////////////////// 
}                                                                                     ////////////
/////////////END OF DRAWMAP FUNCTION WRAP////////////////////////////////////////////////////////


    //////////////////////////////////////////////////////////////////////////
    // OPTIONAL WAY OF EXTRACTING COUNTRY NAME
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


///////////////////////////////
//CALL CLICK FUNCTIONS 
 clickActions();

 ///////////////////////////////////////////////////////////////////////////////
 // INITIALIZER //////////////////////////////////////////////////////////////// 
///////////////////////////////////////////////////////////////////////////////
function init() {  draw_map(); }

 init(); 

 console.log("initialize is ", initialize);
 if (initialize == 0) {initialize = 1 ;}
 console.log("initialize is ", initialize);





///////////////////////////////////////////////////////////////////////////////////////////////////
////--- END OF ACTIVE CODE------------////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////











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