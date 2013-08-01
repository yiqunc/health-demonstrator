package org.mccaughey.health;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.lf5.util.StreamUtils;
import org.geotools.data.DataUtilities;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.feature.FeatureIterator;
import org.geotools.feature.simple.SimpleFeatureBuilder;
import org.geotools.feature.simple.SimpleFeatureTypeBuilder;
import org.geotools.geometry.jts.JTS;
import org.geotools.referencing.CRS;
import org.mccaughey.health.util.GeoJSONUtility;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.opengis.geometry.MismatchedDimensionException;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.opengis.referencing.operation.MathTransform;
import org.opengis.referencing.operation.TransformException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.vividsolutions.jts.geom.Geometry;

import org.mccaughey.geotools.util.ShapeFile;

@Controller
@RequestMapping("/health-filter")
public class HealthFilterResource {
  static final Logger LOGGER = LoggerFactory
      .getLogger(HealthFilterResource.class);
  
  private static final String ZIP_FILE_LOCATION_ATTRIBUTE = "Generated_ZipFile_Location";

  @RequestMapping(method = RequestMethod.POST, value = "/runAnalysis", consumes = "application/json")
  public void handleFilteringRequest(
      @RequestBody Map<String, Object> uiParameters,
      HttpServletRequest request, HttpServletResponse response)
      throws Exception {

	  synchronized (request.getSession()) {
		  
	    HealthFilter healthFilter = new HealthFilter();
	
	    SimpleFeatureCollection outputfeatures = healthFilter
	        .filter(uiParameters.get("params").toString().replace("=",":")); //convert back to json
	    
	    SimpleFeatureCollection outputfeatures_GP = healthFilter
	            .filterGP(uiParameters.get("params").toString().replace("=",":")); //convert back to json
	    
	    if(outputfeatures!=null && outputfeatures.size()>0){
		    CoordinateReferenceSystem fromCRS = outputfeatures.getSchema()
		        .getCoordinateReferenceSystem();
		    CoordinateReferenceSystem toCRS = CRS.decode("EPSG:3857");
		    // Mod by Benny, skip using temporary file
		    String tmpRltJSONString = GeoJSONUtility.createFeaturesJSONString(reproject(outputfeatures, fromCRS, toCRS));
		    request.getSession().setAttribute("tmpRltJSONString", tmpRltJSONString);
		    request.getSession().setAttribute("tmpRltSize", outputfeatures.size());
		    
			File zipfile = ShapeFile.createShapeFileAndReturnAsZipFile(
					"output.shp", null, outputfeatures, request.getSession());
			request.getSession().setAttribute(ZIP_FILE_LOCATION_ATTRIBUTE,
					zipfile.getAbsolutePath());
			//
			LOGGER.info("Writing zip to file {}", zipfile.getAbsoluteFile());
			
	    }
	    else
	    {
	    	request.getSession().setAttribute(ZIP_FILE_LOCATION_ATTRIBUTE,null);
	    	request.getSession().setAttribute("tmpRltJSONString", "");
	    	request.getSession().setAttribute("tmpRltSize", 0);
	    }
	    
	    if(outputfeatures_GP!=null && outputfeatures_GP.size()>0){
	        CoordinateReferenceSystem fromCRS = outputfeatures_GP.getSchema()
	            .getCoordinateReferenceSystem();
	        CoordinateReferenceSystem toCRS = CRS.decode("EPSG:3857");
	        // Mod by Benny, skip using temporary file
	        String tmpRltJSONStringGP = GeoJSONUtility.createFeaturesJSONString(reproject(outputfeatures_GP, fromCRS, toCRS));
	        request.getSession().setAttribute("tmpRltJSONStringGP", tmpRltJSONStringGP);
	    }
	    else
	    {
	    	 request.getSession().setAttribute("tmpRltJSONStringGP", "");
	    }
	    
	    response.setContentType("text/html");
		  PrintWriter pw = response.getWriter();
		  pw.print(request.getSession().getAttribute("tmpRltSize").toString());
		  pw.close();
	  }
  }

  @RequestMapping(method = RequestMethod.GET, value = "filterResult", produces = "application/json")
  public void getFilterResult(HttpServletRequest request,
      HttpServletResponse response) throws Exception {
 
	  // Mod by Benny, skip using temporary file
	  if(request.getSession().getAttribute("tmpRltJSONString")!=null){
		  InputStream instream = new ByteArrayInputStream(request.getSession().getAttribute("tmpRltJSONString").toString().getBytes());
		  StreamUtils.copy(instream, response.getOutputStream());
	  } 
  }
  
  @RequestMapping(method = RequestMethod.GET, value = "filterResultGP", produces = "application/json")
  public void getFilterResultGP(HttpServletRequest request,
      HttpServletResponse response) throws Exception {
 
	  // Mod by Benny, skip using temporary file
	  if(request.getSession().getAttribute("tmpRltJSONStringGP")!=null){
		  InputStream instream = new ByteArrayInputStream(request.getSession().getAttribute("tmpRltJSONStringGP").toString().getBytes());
		  StreamUtils.copy(instream, response.getOutputStream());
	  } 
  }

  private SimpleFeatureCollection reproject(SimpleFeatureCollection collection,
      CoordinateReferenceSystem fromCRS, CoordinateReferenceSystem toCRS)
      throws MismatchedDimensionException, TransformException, FactoryException {

    boolean lenient = true; // allow for some error due to different datums
    MathTransform transform = CRS.findMathTransform(fromCRS, toCRS, lenient);
    SimpleFeatureTypeBuilder ftb = new SimpleFeatureTypeBuilder();
    ftb.setName("reprojected");
    ftb.crs(toCRS);
    ftb.setAttributes(collection.getSchema().getAttributeDescriptors());
   
   
    SimpleFeatureType ft = ftb.buildFeatureType();
    LOGGER.info("NEW CRS " + ft.getCoordinateReferenceSystem());
    FeatureIterator iter = collection.features();
    List<SimpleFeature> reprojected = new ArrayList();
    try {
      while (iter.hasNext()) {
        SimpleFeature feature = (SimpleFeature) iter.next();
        Geometry fromGeom = (Geometry) feature.getDefaultGeometry();
        Geometry toGeom = JTS.transform(fromGeom, transform);

        reprojected.add(buildNewFeature(feature, toGeom, ft));

      }
      return DataUtilities.collection(reprojected);
    } finally {
      iter.close();
    }

  }

  private SimpleFeature buildNewFeature(SimpleFeature feature, Geometry geom,
      SimpleFeatureType ft) {

    SimpleFeatureBuilder featureBuilder = new SimpleFeatureBuilder(ft);
    featureBuilder.addAll(feature.getAttributes());
    featureBuilder.set(feature.getDefaultGeometryProperty().getName(), geom);
    return featureBuilder.buildFeature(feature.getID());

  }
  
  @RequestMapping(value = "downloadGeneratedOutputAzShpZip", method = RequestMethod.GET)
	public void downloadGeneratedOutputAzShpZip(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		synchronized (request.getSession()) {
			if (request.getSession().getAttribute(ZIP_FILE_LOCATION_ATTRIBUTE) == null) {
				response.setContentType("text/html");
				PrintWriter pw = response.getWriter();
			    pw.println("No Results Generated");
			    pw.close();
				return;
			}
			File file = new File((String) request.getSession().getAttribute(
					ZIP_FILE_LOCATION_ATTRIBUTE));
			response.setContentType("application/x-download");
			response.setHeader("Content-disposition", "attachment; filename="
					+ "health_output.zip");
			FileCopyUtils.copy(new FileInputStream(file),response.getOutputStream());
		}
	}
}
