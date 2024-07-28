// ------------Introduction--------------------------------------------------------

// Author: Calvin Samwel Swai
// Date: July 2024
// Objective: Retrieving Optical Vegetation Indices Time series using MODIS Dataset (MOD09GA.061 Terra Surface Reflectance)
// Project: MSc Thesis: Unraveling The Spatial-Temporal Dynamics Of Drought Anomalies And Their Interactions With Vegetation

// --- Instructions ---
//  - To assess the time series of vegetation index of interest, open the Console tab
//  - Turn off/on maps in the viewer (below) at 'Layers' (right)
//  - Import the area of location as a pont dataset (table)
//  - The boundary of interest should be named as table2



// Define the location for the retrieval of vegetation indices. Feel free to change the buffer area
var Point_Location=ee.FeatureCollection(table).filter(
  ee.Filter.inList('Well_id', ['B22C0567-001']))
var roi = Point_Location.map(function(f) { 
  return f.buffer(1000); 
}); 

// -------------------------------------------- Modis Cloud Masking.-------------------------------------
// Romoving cloudy and non-value pixels
// Calculate how frequently a location is labeled as clear (i.e. non-cloudy)
// according to the "internal cloud algorithm flag" of the MODIS "state 1km"
// QA band.

// A function to mask out pixels that did not have observations.
var maskEmptyPixels = function(image) {
  // Find pixels that had observations.
  var withObs = image.select('num_observations_1km').gt(0)
  return image.updateMask(withObs)
}

// A function to mask out cloudy pixels.
var maskClouds = function(image) {
  // Select the QA band.
  var QA = image.select('state_1km')
  // Make a mask to get bit 10, the internal_cloud_algorithm_flag bit.
  var bitMask = 1 << 10;
  // Return an image masking out cloudy areas.
  return image.updateMask(QA.bitwiseAnd(bitMask).eq(0))
}

// Start with an image collection for a 1 month period.
// and mask out areas that were not observed.
var collection = ee.ImageCollection('MODIS/006/MOD09GA').filterBounds(table2)
        .filterDate('2010-01-01', '2020-12-31')
        .map(maskEmptyPixels)

// Get the total number of potential observations for the time interval.
var totalObsCount = collection
        .select('num_observations_1km')
        .count()


// Map the cloud masking function over the collection.
var collectionCloudMasked = collection.map(maskClouds)


// ----------------------------- Computing Vegetation Indices of Interest (Zeng et al., 2022)-------------------------
var addVariables = function(image) {
  // Compute time in fractional years since the epoch.
  var date = image.date();
  var years = date.difference(ee.Date('1970-01-01'), 'year');
  
  // Compute Normalized Vegetation index (NDVI) index.
  var ndvi = image.expression(
    '(sur_refl_b02 - sur_refl_b01) / (sur_refl_b02 + sur_refl_b01)', {
      'sur_refl_b02': image.select('sur_refl_b02'),
      'sur_refl_b01': image.select('sur_refl_b01')
    }
    ).rename('NDVI');
    
  // Compute Near-Infrared Reflectance of vegetation  (NIRv) index.
  var nirv = image.expression(
    '(sur_refl_b02 - sur_refl_b01) / (sur_refl_b02 + sur_refl_b01) * sur_refl_b02/10000', {
      'sur_refl_b02': image.select('sur_refl_b02'),
      'sur_refl_b01': image.select('sur_refl_b01')
    }
  
  ).rename('NIRv');
  
  // Compute Normalized Difference Water Index (NDWI) index.
  var ndwi = image.expression(
    '(sur_refl_b02 - sur_refl_b05) / (sur_refl_b02 + sur_refl_b05)', {
      'sur_refl_b02': image.select('sur_refl_b02'),
      'sur_refl_b05': image.select('sur_refl_b05'),
      // 'B1': image.select('B1')
    }
  ).rename('NDWI');
  // Return the image with the added bands.
  return image
  .addBands(nirv)
  .addBands(ndwi)
  .addBands(ndvi)
  // Add a time band.
  .addBands(ee.Image(years).rename('t')).float()
  // Add a constant band.
  .addBands(ee.Image.constant(1));
};


var filteredLandsat = collectionCloudMasked
  // .filterDate('2000-01-01', '2021-01-01')
  // .map(maskL8sr)
  .map(addVariables);
print(filteredLandsat);  


  // Plot a time series of NDVI at a single location.
Map.centerObject(roi, 11);
Map.addLayer(filteredLandsat,
  {bands: 'NIRv', min: 0.1, max: 0.9, palette: ['white', 'green']},
  'NDWI Mosaic');
Map.addLayer(roi, {color: 'yellow'}, 'ROI');
var l8Chart = ui.Chart.image.series(filteredLandsat.select( 'NDWI', 'NDVI', 'NIRv'), Point_Location)
  .setChartType('ScatterChart')
  .setOptions({
   title: 'Vegetation Indices Time Series at ROI',
   trendlines: {
     0: {color: 'CC0000'}
   },
   lineWidth: 1,
   pointSize: 3,
  });
print(l8Chart);


// ------------------- Image Statistics---------------------------------------
// Get the total number of observations for non-cloudy pixels for the time
// interval.  The result is unmasked to set to unity so that all locations
// have counts, and the ratios later computed have values everywhere.
var clearObsCount = collectionCloudMasked
        .select('num_observations_1km')
        .count()
        .unmask(0)

Map.addLayer(
    collectionCloudMasked.median(),
    {bands: ['sur_refl_b01', 'sur_refl_b04', 'sur_refl_b03'],
    gain: 0.07,
    gamma: 1.4
    },
    'median of masked collection'
  )
Map.addLayer(
    totalObsCount,
    {min: 84, max: 92},
    'count of total observations',
    false
  )
Map.addLayer(
    clearObsCount,
    {min: 0, max: 90},
    'count of clear observations',
    false
  )
Map.addLayer(
    clearObsCount.toFloat().divide(totalObsCount),
    {min: 0, max: 1},
    'ratio of clear to total observations'
  )



// References
// Zeng, Y., Hao, D., Huete, A., Dechant, B., Berry, J., Chen, J. M., Joiner, J., Frankenberg, C., Bond-Lamberty, B., Ryu, Y., Xiao, J., Asrar, G. R., & Chen, M. (2022). 
// Optical vegetation indices for monitoring terrestrial ecosystems globally. 
// Nature Reviews Earth and Environment, 3(7), 477–493. https://doi.org/10.1038/s43017-022-00298-5


