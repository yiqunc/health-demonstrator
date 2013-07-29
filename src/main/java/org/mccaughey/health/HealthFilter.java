package org.mccaughey.health;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.geotools.data.DataUtilities;
import org.geotools.data.FileDataStore;
import org.geotools.data.Query;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.data.simple.SimpleFeatureIterator;
import org.geotools.data.simple.SimpleFeatureSource;
import org.geotools.factory.CommonFactoryFinder;
import org.mccaughey.layer.config.LayerMapping;
import org.mccaughey.service.Config;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.filter.Filter;
import org.opengis.filter.FilterFactory2;
import org.opengis.filter.PropertyIsEqualTo;
import org.opengis.filter.PropertyIsGreaterThan;
import org.opengis.filter.PropertyIsGreaterThanOrEqualTo;
import org.opengis.filter.PropertyIsLessThan;
import org.opengis.filter.PropertyIsLessThanOrEqualTo;
import org.opengis.filter.expression.Expression;
import org.opengis.filter.expression.NilExpression;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.jayway.jsonpath.JsonPath;
import com.vividsolutions.jts.geom.Geometry;

public class HealthFilter {

	static final Logger LOGGER = LoggerFactory.getLogger(HealthFilter.class);
	
	public SimpleFeatureCollection filter(String queryJSON) throws Exception {
		LOGGER.info("JSON: {}", queryJSON);

		SimpleFeatureSource seifaSource = ((FileDataStore) Config
				.getDefaultFactory().getDataStore(LayerMapping.SEIFA_Layer))
				.getFeatureSource();

		SimpleFeatureSource diabetesSource = ((FileDataStore) Config
				.getDefaultFactory().getDataStore(
						LayerMapping.TYPE2_DIABETES_Layer)).getFeatureSource();

		SimpleFeatureSource depressionSource = ((FileDataStore) Config
				.getDefaultFactory()
				.getDataStore(LayerMapping.DEPRESSION_Layer))
				.getFeatureSource();
		SimpleFeatureSource obesitySource = ((FileDataStore) Config
				.getDefaultFactory().getDataStore(LayerMapping.OBESITY_Layer))
				.getFeatureSource();

		SimpleFeatureSource smokingSource = ((FileDataStore) Config
				.getDefaultFactory().getDataStore(LayerMapping.SMOKING_Layer))
				.getFeatureSource();

		// /
		List<SimpleFeatureCollection> layers = new ArrayList<SimpleFeatureCollection>();

		Boolean SEIFA = ((Boolean) (JsonPath.read(queryJSON,
				"$[?(@['METRIC_NAME'] == 'SEIFA_METRIC')].METRIC_INCLUSION[0]")));
		if (SEIFA) {
			String seifaVal = JsonPath.read(queryJSON,
					"$[?(@['METRIC_NAME'] == 'SEIFA_METRIC')].METRIC_VALUE[0]");
			String seifaOp = JsonPath.read(queryJSON,
					"[?(@['METRIC_NAME'] == 'SEIFA_METRIC')].OPERATOR[0]");
			SimpleFeatureCollection seifaFeatures = getAttributeFiltered_FeatureCollection(
					seifaSource, seifaOp, seifaVal, "IRSD_Decil");
			layers.add(seifaFeatures);
		}
		Boolean TYPE2_DIABETES = ((Boolean) (JsonPath
				.read(queryJSON,
						"$[?(@['METRIC_NAME'] == 'TYPE2_DIABETES')].METRIC_INCLUSION[0]")));
		if (TYPE2_DIABETES) {
			String diabetesValue = JsonPath
					.read(queryJSON,
							"$[?(@['METRIC_NAME'] == 'TYPE2_DIABETES')].METRIC_VALUE[0]");
			String diabetesOp = JsonPath.read(queryJSON,
					"[?(@['METRIC_NAME'] == 'TYPE2_DIABETES')].OPERATOR[0]");
			SimpleFeatureCollection diabetesFeatures = getAttributeFiltered_FeatureCollection(
					diabetesSource, diabetesOp, diabetesValue, "RatePer100");
			layers.add(diabetesFeatures);
		}
		Boolean DEPRESSION = ((Boolean) (JsonPath.read(queryJSON,
				"$[?(@['METRIC_NAME'] == 'DEPRESSION')].METRIC_INCLUSION[0]")));
		if (DEPRESSION) {
			String depressionValue = JsonPath.read(queryJSON,
					"$[?(@['METRIC_NAME'] == 'DEPRESSION')].METRIC_VALUE[0]");
			String depressionOp = JsonPath.read(queryJSON,
					"[?(@['METRIC_NAME'] == 'DEPRESSION')].OPERATOR[0]");
			SimpleFeatureCollection depressionFeatures = getAttributeFiltered_FeatureCollection(
					depressionSource, depressionOp, depressionValue,
					"RatePer100");
			layers.add(depressionFeatures);
		}
		Boolean OBESITY = ((Boolean) (JsonPath.read(queryJSON,
				"$[?(@['METRIC_NAME'] == 'OBESITY')].METRIC_INCLUSION[0]")));
		if (OBESITY) {
			String obesityValue = JsonPath.read(queryJSON,
					"$[?(@['METRIC_NAME'] == 'OBESITY')].METRIC_VALUE[0]");
			String obesityOp = JsonPath.read(queryJSON,
					"[?(@['METRIC_NAME'] == 'OBESITY')].OPERATOR[0]");
			SimpleFeatureCollection obesityFeatures = getAttributeFiltered_FeatureCollection(
					obesitySource, obesityOp, obesityValue, "Obese18_AS"); //ObesePeopl
			layers.add(obesityFeatures);
		}
		Boolean SMOKING = ((Boolean) (JsonPath.read(queryJSON,
				"$[?(@['METRIC_NAME'] == 'SMOKING')].METRIC_INCLUSION[0]")));
		if (SMOKING) {
			String smokingValue = JsonPath.read(queryJSON,
					"$[?(@['METRIC_NAME'] == 'SMOKING')].METRIC_VALUE[0]");
			String smokingOp = JsonPath.read(queryJSON,
					"[?(@['METRIC_NAME'] == 'SMOKING')].OPERATOR[0]");
			SimpleFeatureCollection smokingFeatures = getAttributeFiltered_FeatureCollection(
					smokingSource, smokingOp, smokingValue, "Smoke18_AS"); //SmokePop
			layers.add(smokingFeatures);
		}
		
		Boolean NO_ACCESS_TO_GENERAL_PRACTICE = ((Boolean) (JsonPath
				.read(queryJSON,
						"$[?(@['METRIC_NAME'] == 'NO_ACCESS_TO_GENERAL_PRACTICE')].METRIC_INCLUSION[0]")));
		SimpleFeatureCollection gpBuffers = null;
		if (NO_ACCESS_TO_GENERAL_PRACTICE) {
			String gpDistance = JsonPath
					.read(queryJSON,
							"$[?(@['METRIC_NAME'] == 'NO_ACCESS_TO_GENERAL_PRACTICE')].METRIC_VALUE[0]");
			SimpleFeatureSource gpSource = ((FileDataStore) Config
					.getDefaultFactory().getDataStore(
							"GP_Buffers_" + gpDistance + "m"))
					.getFeatureSource();
			gpBuffers = filterGPAttributes(gpSource, queryJSON);
		}
		
		SimpleFeatureCollection filteredFeatures = null; // = seifaFeatures;
		for (SimpleFeatureCollection intersectFeatures : layers) {
			LOGGER.info("Layer size {}", intersectFeatures.size());
			if ((filteredFeatures == null)) { // && (intersectFeatures.size() >
												// 0)) {
				filteredFeatures = intersectFeatures;
				LOGGER.info("Filtered features: {}", filteredFeatures.size());
			} else if ((filteredFeatures != null)) {
				// && (intersectFeatures.size() > 0)) {
				filteredFeatures = intersection2(intersectFeatures,filteredFeatures);
				LOGGER.info("Filtered/intersected features: {}",
						filteredFeatures.size());
			}

		}
		SimpleFeatureCollection gpExcluded = difference2(filteredFeatures,
				gpBuffers);
		if (gpExcluded!= null){
			LOGGER.info("Filtered total features: {}", gpExcluded.size());
		} else
		{
			LOGGER.info("=========== no polygon returns ===========");
		}
		return gpExcluded;
	}

	public SimpleFeatureCollection filterGP(String queryJSON) throws Exception {
		LOGGER.info("JSON: {}", queryJSON);

		SimpleFeatureSource gp = ((FileDataStore) Config
				.getDefaultFactory().getDataStore(LayerMapping.GENERAL_PRACTICE_Layer))
				.getFeatureSource();
		
		Boolean NO_ACCESS_TO_GENERAL_PRACTICE = ((Boolean) (JsonPath
				.read(queryJSON,
						"$[?(@['METRIC_NAME'] == 'NO_ACCESS_TO_GENERAL_PRACTICE')].METRIC_INCLUSION[0]")));
		
		if (NO_ACCESS_TO_GENERAL_PRACTICE) 
		{
			return filterGPAttributes(gp, queryJSON);
		}
		
		return gp.getFeatures();
		
	}
	
	private SimpleFeatureCollection filterGPAttributes(
			SimpleFeatureSource source, String queryJSON) throws IOException {
		String attrPreFix ="GPs_";
		FilterFactory2 ff = CommonFactoryFinder.getFilterFactory2();
		Query query = new Query();
		List<Filter> filters = new ArrayList<Filter>();
		Boolean BULK_BILLING_AND_FEE_BASED_SERVICE = ((Boolean) (JsonPath
				.read(queryJSON,
						"$[?(@['METRIC_NAME'] == 'BULK_BILLING_AND_FEE_BASED_SERVICE')].METRIC_INCLUSION[0]")));
		if (BULK_BILLING_AND_FEE_BASED_SERVICE) {
			//FreeProvis
			//Exclude records whose Fee_Servic is NULL, isNull doesn't function properly here
			List<Filter> fltAnd = new ArrayList<Filter>();
			fltAnd.add(ff.greater(ff.property(attrPreFix+"Fee_Se"), ff.literal("")));
			fltAnd.add(ff.notEqual(ff.property(attrPreFix+"Fee_Se"), ff.literal("Other")));
			fltAnd.add(ff.notEqual(ff.property(attrPreFix+"Fee_Se"), ff.literal("No Bulk Bill")));
			fltAnd.add(ff.notEqual(ff.property(attrPreFix+"Fee_Se"), ff.literal("No Fee")));
			filters.add(ff.and(fltAnd));
			
		}
		
		//attention: use ff.equals NOT ff.equal
		Boolean BULK_BILLING_ONLY = ((Boolean) (JsonPath
				.read(queryJSON,
						"$[?(@['METRIC_NAME'] == 'BULK_BILLING_ONLY')].METRIC_INCLUSION[0]")));
		if (BULK_BILLING_ONLY) {
			
			List<Filter> fltOr = new ArrayList<Filter>();
			fltOr.add(ff.equals(ff.property(attrPreFix+"Fee_Se"), ff.literal("Bulkbilling only")));
			fltOr.add(ff.equals(ff.property(attrPreFix+"Fee_Se"), ff.literal("Bulk Bill")));
			fltOr.add(ff.equals(ff.property(attrPreFix+"Fee_Se"), ff.literal("Bulk Billing")));
			fltOr.add(ff.equals(ff.property(attrPreFix+"Fee_Se"), ff.literal("No Fee")));
			filters.add(ff.or(fltOr));
		}
		
		Boolean FEE_ONLY = ((Boolean) (JsonPath.read(queryJSON,
				"$[?(@['METRIC_NAME'] == 'FEE_ONLY')].METRIC_INCLUSION[0]")));
		if (FEE_ONLY) {

			filters.add(ff.or(ff.equals(ff.property(attrPreFix+"Fee_Se"),ff.literal("Fees Apply")), ff.equals(ff.property(attrPreFix+"Fee_Se"),ff.literal("No Bulk Bill"))));

		}
		
		Boolean AFTER_5_UP_UNTIL_8_PM_ON_WEEKDAYS = ((Boolean) (JsonPath
				.read(queryJSON,
						"$[?(@['METRIC_NAME'] == 'AFTER_5_UP_UNTIL_8_PM_ON_WEEKDAYS')].METRIC_INCLUSION[0]")));
		if (AFTER_5_UP_UNTIL_8_PM_ON_WEEKDAYS) {
			// from Monday to Friday, if any weekday the GP still open from 5pm to 8pm, return true;
			
			List<Filter> weekdayfilter = new ArrayList<Filter>();
			
			weekdayfilter.add(ff.and(ff.greater(ff.property(attrPreFix+"Mo_CL"), ff.literal("1700")), ff.lessOrEqual(ff.property(attrPreFix+"Mo_CL"), ff.literal("2000"))));
			weekdayfilter.add(ff.and(ff.greater(ff.property(attrPreFix+"Tu_CL"), ff.literal("1700")), ff.lessOrEqual(ff.property(attrPreFix+"Tu_CL"), ff.literal("2000"))));
			weekdayfilter.add(ff.and(ff.greater(ff.property(attrPreFix+"We_CL"), ff.literal("1700")), ff.lessOrEqual(ff.property(attrPreFix+"We_CL"), ff.literal("2000"))));
			weekdayfilter.add(ff.and(ff.greater(ff.property(attrPreFix+"Th_CL"), ff.literal("1700")), ff.lessOrEqual(ff.property(attrPreFix+"Th_CL"), ff.literal("2000"))));
			weekdayfilter.add(ff.and(ff.greater(ff.property(attrPreFix+"Fr_CL"), ff.literal("1700")), ff.lessOrEqual(ff.property(attrPreFix+"Fr_CL"), ff.literal("2000"))));
				
			filters.add(ff.or(weekdayfilter));

		}
		
		Boolean AFTER_8_PM_ON_WEEKDAYS = ((Boolean) (JsonPath.read(queryJSON,
		 "$[?(@['METRIC_NAME'] == 'AFTER_8_PM_ON_WEEKDAYS')].METRIC_INCLUSION[0]")));
		if (AFTER_8_PM_ON_WEEKDAYS) {
				// from Monday to Friday, if any weekday the GP open after 8pm, return true;
				
				List<Filter> weekdayfilter = new ArrayList<Filter>();
			
				weekdayfilter.add(ff.and(ff.greater(ff.property(attrPreFix+"Mo_CL"), ff.literal("2000")), ff.notEqual(ff.property(attrPreFix+"Mo_CL"), ff.literal("NULL"))));
				weekdayfilter.add(ff.and(ff.greater(ff.property(attrPreFix+"Tu_CL"), ff.literal("2000")), ff.notEqual(ff.property(attrPreFix+"Tu_CL"), ff.literal("NULL"))));
				weekdayfilter.add(ff.and(ff.greater(ff.property(attrPreFix+"We_CL"), ff.literal("2000")), ff.notEqual(ff.property(attrPreFix+"We_CL"), ff.literal("NULL"))));
				weekdayfilter.add(ff.and(ff.greater(ff.property(attrPreFix+"Th_CL"), ff.literal("2000")), ff.notEqual(ff.property(attrPreFix+"Th_CL"), ff.literal("NULL"))));
				weekdayfilter.add(ff.and(ff.greater(ff.property(attrPreFix+"Fr_CL"), ff.literal("2000")), ff.notEqual(ff.property(attrPreFix+"Fr_CL"), ff.literal("NULL"))));

				filters.add(ff.or(weekdayfilter));
			}
		 
		Boolean ANY_SATURDAY_SERVICE_AFTER_12_NOON = ((Boolean) (JsonPath.read(queryJSON,
		 "$[?(@['METRIC_NAME'] == 'ANY_SATURDAY_SERVICE_AFTER_12_NOON')].METRIC_INCLUSION[0]")));
		if (ANY_SATURDAY_SERVICE_AFTER_12_NOON) {
				filters.add(ff.and(ff.greater(ff.property(attrPreFix+"Sa_CL"), ff.literal("1200")), ff.notEqual(ff.property(attrPreFix+"Sa_CL"), ff.literal("NULL"))));
			}
		
		Boolean ANY_SUNDAY_SERVICE = ((Boolean) (JsonPath
				.read(queryJSON,
						"$[?(@['METRIC_NAME'] == 'ANY_SUNDAY_SERVICE')].METRIC_INCLUSION[0]")));
		if (ANY_SUNDAY_SERVICE) {
			//filters.add(ff.notEqual(ff.property("Sunday"), ff.literal("None")));
			
			filters.add(ff.and(ff.greater(ff.property(attrPreFix+"Sunday"),ff.literal("")), ff.and(ff.notEqual(ff.property(attrPreFix+"Sunday"), ff.literal("None")),ff.notEqual(ff.property(attrPreFix+"Sunday"), ff.literal("NULL")))));
			
		}
		// Boolean COMMUNITY_HEALTH_CENTRE = ((Boolean) (JsonPath
		// .read(queryJSON,
		// "$[?(@['METRIC_NAME'] == 'COMMUNITY_HEALTH_CENTRE')].METRIC_INCLUSION[0]")));
		// Boolean MENTAL_HEALTH_SERVICE_PROVIDER = ((Boolean) (JsonPath
		// .read(queryJSON,
		// "$[?(@['METRIC_NAME'] == 'MENTAL_HEALTH_SERVICE_PROVIDER')].METRIC_INCLUSION[0]")));
		
		query.setFilter(ff.and(filters));
		
		LOGGER.info("Query: {}", query.toString());
		SimpleFeatureCollection gpClinics = source.getFeatures(query);
		LOGGER.info("Found {} gp clinics", gpClinics.size());
	
		return gpClinics;
	}

	private SimpleFeatureCollection getAttributeFiltered_FeatureCollection(
			SimpleFeatureSource featureSource, String operator,
			String metricValue, String attributeName) throws Exception {

		FilterFactory2 ff = CommonFactoryFinder.getFilterFactory2();
		Query query = new Query();

		if (operator.equals("EQUAL_OR_GREATER_THAN")) {
			PropertyIsGreaterThanOrEqualTo filter = ff.greaterOrEqual(
					ff.property(attributeName), ff.literal(metricValue));
			query.setFilter(filter);
		}
		if (operator.equals("EQUAL_OR_LESS_THAN")) {
			PropertyIsLessThanOrEqualTo filter = ff.lessOrEqual(
					ff.property(attributeName), ff.literal(metricValue));
			query.setFilter(filter);
		}
		if (operator.equals("GREATER_THAN")) {
			PropertyIsGreaterThan filter = ff.greater(
					ff.property(attributeName), ff.literal(metricValue));
			query.setFilter(filter);
		}
		if (operator.equals("LESS_THAN")) {
			PropertyIsLessThan filter = ff.less(ff.property(attributeName),
					ff.literal(metricValue));
			query.setFilter(filter);
		}
		if (operator.equals("EQUAL")) {
			PropertyIsEqualTo filter = ff.equals(ff.property(attributeName),
					ff.literal(metricValue));
			query.setFilter(filter);
		}
		// get a feature collection of filtered features
		// SimpleFeatureCollection fCollection = featureSource.getFeatures();
		SimpleFeatureCollection fCollection = featureSource.getFeatures(query);
		return fCollection;
	}

	private SimpleFeatureCollection intersection(SimpleFeatureCollection B,
			SimpleFeatureCollection A) throws IOException {
		SimpleFeatureIterator AFeatures = A.features();
		FilterFactory2 ff = CommonFactoryFinder.getFilterFactory2();
		// LOGGER.info(B.size() + " " + A.size());
		SimpleFeatureSource BSource = DataUtilities.source(B);
		List<SimpleFeature> intersectionFeatures = new ArrayList<SimpleFeature>();
		while (AFeatures.hasNext()) {
			SimpleFeature featureA = AFeatures.next();
			Geometry geometryA = (Geometry) featureA.getDefaultGeometry();

			Filter filter = ff.intersects(ff.property(A.getSchema()
					.getGeometryDescriptor().getName()), ff.literal(geometryA));
			// SimpleFeatureCollection i = BSource.getFeatures(filter);
			// LOGGER.info("found " + i.size());
			intersectionFeatures.addAll(DataUtilities.list(BSource
					.getFeatures(filter)));
		}
		AFeatures.close();
		// LOGGER.info("Ding!" + intersectionFeatures.size());
		return DataUtilities.collection(intersectionFeatures);
	}
	
	private SimpleFeatureCollection intersection2(SimpleFeatureCollection A,
			SimpleFeatureCollection B) throws IOException {
		SimpleFeatureIterator AFeatures = A.features();
		FilterFactory2 ff = CommonFactoryFinder.getFilterFactory2();
		//LOGGER.info("A.size:"+A.size() + " B.size:" + B.size());
		SimpleFeatureSource BSource = DataUtilities.source(B);

		List<Filter> fltOr = new ArrayList<Filter>();
		while (AFeatures.hasNext()) {
			SimpleFeature featureA = AFeatures.next();
			Geometry geometryA = (Geometry) featureA.getDefaultGeometry();
			fltOr.add(ff.intersects(ff.property(B.getSchema().getGeometryDescriptor().getName()), ff.literal(geometryA)));
		}
		
		AFeatures.close();

		Filter filter = ff.or(fltOr);
		return BSource.getFeatures(filter);
	}


	private SimpleFeatureCollection difference(SimpleFeatureCollection A,
			SimpleFeatureCollection B) throws IOException {
		if (B == null) {
			return A;
		}
		
		LOGGER.info("GPBuffer polygon number: {}", B.size());
		SimpleFeatureIterator BFeatures = B.features();
		//List<SimpleFeature> difference = new ArrayList<SimpleFeature>();
		
		SimpleFeatureSource ASource = DataUtilities.source(A);
		FilterFactory2 ff = CommonFactoryFinder.getFilterFactory2();
		
		Geometry union = null;
		while (BFeatures.hasNext()) {
			SimpleFeature featureB = BFeatures.next();
			Geometry geometryB = (Geometry) featureB.getDefaultGeometry();
			if (union == null) {
				union = geometryB;
			} else {
				union = union.union(geometryB);
			}
		}
		
		BFeatures.close();
		LOGGER.info("Union area {}", union.getArea());
		Filter filter = ff.not(ff.intersects(
				ff.property(B.getSchema().getGeometryDescriptor().getName()),
				ff.literal(union)));
		// SimpleFeatureCollection i = BSource.getFeatures(filter);
		// LOGGER.info("found " + i.size());
		return ASource.getFeatures(filter);
	}
	
	private SimpleFeatureCollection difference2(SimpleFeatureCollection A,
			SimpleFeatureCollection B) throws IOException {
		
		if (A == null || A.size() == 0) return null;
		
		if (B == null || B.size() == 0) return A;
		
		LOGGER.info("GPBuffer polygon number: {}", B.size());
		SimpleFeatureIterator BFeatures = B.features();
		
		SimpleFeatureSource ASource = DataUtilities.source(A);
		FilterFactory2 ff = CommonFactoryFinder.getFilterFactory2();
		
		List<Filter> fltOr = new ArrayList<Filter>();
		while (BFeatures.hasNext()) {
			SimpleFeature featureB = BFeatures.next();
			Geometry geometryB = (Geometry) featureB.getDefaultGeometry();
			fltOr.add(ff.intersects(ff.property(A.getSchema().getGeometryDescriptor().getName()), ff.literal(geometryB)));
		}
		Filter filter = ff.not(ff.or(fltOr));
		BFeatures.close();
		return ASource.getFeatures(filter);
	}
}
