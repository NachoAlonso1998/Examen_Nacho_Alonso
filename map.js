var map;
var serviceAreaTask;
var clickpoint;

require(["esri/map",
    "esri/geometry/Extent",
    "dojo/on",

    "esri/layers/FeatureLayer",

    "esri/tasks/ServiceAreaTask", "esri/tasks/ServiceAreaParameters", "esri/tasks/FeatureSet",

    "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol",

    "esri/geometry/Point", "esri/graphic",

    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/tasks/FeatureSet",

    "esri/arcgis/utils",

    "dojo/domReady!"],
    function (
        Map,
        Extent,
        on,
        FeatureLayer,
        ServiceAreaTask, ServiceAreaParameters, FeatureSet,
        SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
      Point, Graphic, Query, QueryTask, FeatureSet, arcgisUtils){

//Se añade el mapa con la extensión de Madrid
        map = new Map("map", {
            basemap: "topo",
            center: [-3.658438,40.414340],
            zoom: 12,
            sliderStyle: "small"
            });

//Se define la capa que se va a añadir
        var hospitales = new FeatureLayer("https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/Centros_Salud_Nacho/FeatureServer/0",{
            outFields: ["*"],
            });

//Se añade la capa el mapa
        map.addLayers([hospitales]);


//Se hace una Query para obtener las coordenadas de todos los hospitales

        var queryTask = new QueryTask("https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/Centros_Salud_Nacho/FeatureServer/0");


        var queryPoints = new Query();
        queryPoints.where = '1 = 1';
        hospitales.selectFeatures(queryPoints);

        hospitales.on('selection-complete', saveCentros)

        
        function saveCentros(result) {
        console.log('result', result)

        // var features= result;
        // var featureSet = new FeatureSet();
        // featureSet.features = features;

        // console.log(featureSet)

//Se ajustan los parámetros del ServiceArea

        params = new ServiceAreaParameters();
        params.defaultBreaks= [3];
        params.outSpatialReference = map.spatialReference;
        params.returnFacilities = true;
        params.impedanceAttributeName = "WalkTime"

// Recorrer result para ir construyendo el FeatureSet de params que vas a enviar (solve)
    map.graphics.add(location);
    var features = [];
    result.push(location);
    var facilities = new FeatureSet();
    facilities.features = features;
    params.facilities = facilities;

//Se añade el servicio de rutas como serviceAreaTask

        serviceAreaTask = new ServiceAreaTask("https://formacion.esri.es/server/rest/services/RedMadrid/NAServer/Service%20Area");


//Resolvemos el service area
            serviceAreaTask.solve(params,function(solveResult){
            var polygonSymbol = new SimpleFillSymbol(
            "solid",
            new SimpleLineSymbol("solid", new Color([232,104,80]), 2),
                new Color([232,104,80,0.25])
            );
              
            arrayUtils.forEach(solveResult.serviceAreaPolygons, function(serviceArea){
                serviceArea.setSymbol(polygonSymbol);
                map.graphics.add(serviceArea);
              });
            });

    

        };
  
        });
        