window['map_init'] = function() {
	// Map
	var controls = [ new OpenLayers.Control.Navigation(),
			new OpenLayers.Control.PanZoomBar(),
			new OpenLayers.Control.LayerSwitcher({
				'ascending' : false
			}), new OpenLayers.Control.Permalink(),
			new OpenLayers.Control.ScaleLine(),
			new OpenLayers.Control.Permalink('permalink'),
			new OpenLayers.Control.MousePosition(),
			new OpenLayers.Control.OverviewMap(),
			new OpenLayers.Control.KeyboardDefaults()];
	map = new OpenLayers.Map('mappanel', {
		controls : controls
	});
	
	var osm = new OpenLayers.Layer.OSM();
	osm.setIsBaseLayer(true);
	
	var mercator = new OpenLayers.Projection("EPSG:900913");
	var saveStrategy = new OpenLayers.Strategy.Save();
	var styles = new OpenLayers.StyleMap({
		"default" : new OpenLayers.Style(null, {
			rules : [ new OpenLayers.Rule({
				symbolizer : {
					"Point" : {
						pointRadius : 6,
						graphicName : "circle",
						fillColor : "yellow",
						fillOpacity : 0.25,
						strokeWidth : 1,
						strokeOpacity : 1,
						strokeColor : "#333333"
					},
					"Line" : {
						strokeWidth : 3,
						strokeOpacity : 1,
						strokeColor : "#666666"
					},
					"Polygon" : {
						strokeWidth : 1,
						strokeOpacity : 1,
						strokeColor : "#000000",
						fillColor : "#1E90FF",
						fillOpacity : 0.5
					}
				}
			}) ]
		})
	});
	
	lyr_results = new OpenLayers.Layer.Vector("Results", {
		projection : mercator,
		strategies : [ new OpenLayers.Strategy.Fixed() ],
		styleMap : styles,
		protocol : new OpenLayers.Protocol.HTTP({
			url : "/health-demonstrator/service/health-filter/filterResult",
			format : new OpenLayers.Format.GeoJSON()
		}),
		renderers : [ "Canvas", "SVG", "VML" ]
	});

	lyr_results_gps = new OpenLayers.Layer.Vector("Selected GPs", {
		projection : mercator,
		strategies : [ new OpenLayers.Strategy.Fixed() ],
		styleMap : styles,
		protocol : new OpenLayers.Protocol.HTTP({
			url : "/health-demonstrator/service/health-filter/filterResultGP",
			format : new OpenLayers.Format.GeoJSON()
		}),
		renderers : [ "Canvas", "SVG", "VML" ]
	});
	lyr_results_gps.setVisibility(false);
	
	// define SEIFA layers
	lyr_SEIFA = new OpenLayers.Layer.WMS("SEIFA",
			"/health-demonstrator/geoserver/wms", {
				LAYERS : 'CSDILA_local:nwmm_seifa2011',
				STYLES : '',
				format : 'image/png',
				tiled : true,
				transparent : true,
				tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom
			}, {
				buffer : 0,
				displayOutsideMaxExtent : true,
				projection : mercator,
				reproject : true
			});
	lyr_SEIFA.setIsBaseLayer(false);
	lyr_SEIFA.setVisibility(false);
	lyr_SEIFA.setOpacity(0.5);

	
	//define GPs layers
	lyr_GP = new OpenLayers.Layer.WMS("All GPs",
			"/health-demonstrator/geoserver/wms", {
				LAYERS : 'CSDILA_local:nwmm_gps',
				STYLES : '',
				format : 'image/png',
				tiled : true,
				transparent : true,
				tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom
			}, {
				buffer : 0,
				displayOutsideMaxExtent : true,
				projection : mercator,
				reproject : true
			});
	lyr_GP.setIsBaseLayer(false);
	lyr_GP.setVisibility(false);
	lyr_GP.setOpacity(0.5);

	//define Diabetes layers
	lyr_Diabetes = new OpenLayers.Layer.WMS("Type 2 Diabetes",
			"/health-demonstrator/geoserver/wms", {
				LAYERS : 'CSDILA_local:nwmm_type2diabetes',
				STYLES : '',
				format : 'image/png',
				tiled : true,
				transparent : true,
				tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom
			}, {
				buffer : 0,
				displayOutsideMaxExtent : true,
				projection : mercator,
				reproject : true
			});
	lyr_Diabetes.setIsBaseLayer(false);
	lyr_Diabetes.setVisibility(false);
	lyr_Diabetes.setOpacity(0.5);

	//define Depression layers
	lyr_Depression = new OpenLayers.Layer.WMS("Depression",
			"/health-demonstrator/geoserver/wms", {
				LAYERS : 'CSDILA_local:nwmm_moodproblems',
				STYLES : '',
				format : 'image/png',
				tiled : true,
				transparent : true,
				tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom
			}, {
				buffer : 0,
				displayOutsideMaxExtent : true,
				projection : mercator,
				reproject : true
			});
	lyr_Depression.setIsBaseLayer(false);
	lyr_Depression.setVisibility(false);
	lyr_Depression.setOpacity(0.5);
	
	//define Obesity layers
	lyr_Obesity = new OpenLayers.Layer.WMS("Obesity",
			"/health-demonstrator/geoserver/wms", {
				LAYERS : 'CSDILA_local:nwmm_obesity',
				STYLES : '',
				format : 'image/png',
				tiled : true,
				transparent : true,
				tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom
			}, {
				buffer : 0,
				displayOutsideMaxExtent : true,
				projection : mercator,
				reproject : true
			});
	lyr_Obesity.setIsBaseLayer(false);
	lyr_Obesity.setVisibility(false);
	lyr_Obesity.setOpacity(0.5);
	
	//define Smoking layers
	lyr_Smoking = new OpenLayers.Layer.WMS("Smoking",
			"/health-demonstrator/geoserver/wms", {
				LAYERS : 'CSDILA_local:nwmm_smoking',
				STYLES : '',
				format : 'image/png',
				tiled : true,
				transparent : true,
				tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom
			}, {
				buffer : 0,
				displayOutsideMaxExtent : true,
				projection : mercator,
				reproject : true
			});
	lyr_Smoking.setIsBaseLayer(false);
	lyr_Smoking.setVisibility(false);
	lyr_Smoking.setOpacity(0.5);
	/*
	wfs = new OpenLayers.Layer.Vector(
			"gp-wfs",
			{
				strategies : [ new OpenLayers.Strategy.BBOX(), saveStrategy ],
				projection : mercator,
				styleMap : '',
				protocol : new OpenLayers.Protocol.WFS(
						{
							version : "1.1.0",
							srsName : "EPSG:900913",
							url : "/health-demonstrator/geoserver/wfs",
							featureType : "gps_inwmml",
							geometryName : "geom",
							schema : "/health-demonstrator/geoserver/wfs/DescribeFeatureType?version=1.1.0&typename=CSDILA_local:gps_inwmml"
						})
			});
	*/
	map.addLayers([osm, lyr_results,lyr_results_gps,lyr_SEIFA, lyr_Diabetes, lyr_Depression, lyr_Obesity, lyr_Smoking, lyr_GP]);

	map.setCenter(new OpenLayers.LonLat(16133371, -4544265), 12);

};
window['map_init']();