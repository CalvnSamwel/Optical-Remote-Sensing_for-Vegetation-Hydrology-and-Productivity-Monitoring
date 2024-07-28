# Optical-Vegetation-Water-Content-and-Productivity-Monitoring

## Introduction
Welcome to the Vegetation Indices Estimation Repository! This repository contains JavaScript code for estimating vegetation indices using Google Earth Engine (GEE). The code is designed to analyze the dynamics of vegetation properties, especially under drought conditions, using two key vegetation condition indices: the Near-Infrared Reflectance of Vegetation (NIRv) and the Normalized Difference Water Index (NDWI).

The repository includes scripts for preprocessing MODIS satellite data to remove clouds and no-data pixels, computing vegetation indices, and visualizing the results. This code can be used to monitor vegetation health and hydrology conditions over time.

![Veg Indices](https://github.com/user-attachments/assets/4b6d4e43-0e14-49f2-aa98-52d655ae0369)


## Vegetation Indices
* Near-Infrared Reflectance of Vegetation (NIRv)
NIRv is a robust index that quantifies the contribution of vegetation to pixel reflectance. It is computed as a product of the Normalized Difference Vegetation Index (NDVI) and the near-infrared (NIR) band reflectance. NDVI itself is the normalized difference between the Red and NIR bands. NIRv enhances the impact of vegetation on NDVI by emphasizing NIR reflectance, thereby reducing background noise contributions. This makes NIRv a reliable indicator of vegetation health and biomass.

* Normalized Difference Water Index (NDWI)
NDWI monitors plant hydrology conditions by utilizing high reflectance from the cell mesophyll and water absorptions at NIR (860 nm) and SWIR (1240 nm) wavelengths. It is particularly sensitive to the water content in vegetation and is less affected by clouds compared to other indices such as the red-edge Normalized Difference Vegetation Index (NDVIre). This makes NDWI an effective tool for assessing vegetation water status during drought conditions.

## Code Overview
* Data Preprocessing
The script begins by defining the region of interest (ROI) and applying cloud masking to MODIS satellite images. The cloud masking functions remove cloudy and no-value pixels to ensure that only valid data is used for analysis.

* Vegetation Indices Computation
The main part of the script computes NIRv and NDWI for each image in the filtered and cloud-masked collection. The equations imployed are presented in the methodology design folder: https://github.com/CalvnSamwel/Optical-Vegetation-Hydrology-and-Productivity-Monitoring/blob/main/Methodology%20Design/Methodolgy%20Framework.pdf

* Visualization and Analysis
The script generates time series plots of NIRv and NDWI to visualize vegetation conditions over time. It also includes functions to compute vegetation anomalies, which represent the deviation of vegetation indices from their mean values over a 20-year period. This helps identify and quantify abnormal vegetation conditions such as those caused by drought.

* Image Statistics
Additional layers are added to the map for visualization, including the median of the masked collection, the count of total observations, and the ratio of clear to total observations. These layers help in understanding the quality and coverage of the data used for analysis.


### Getting Started
To use the scripts in this repository, you will need a Google Earth Engine account. Follow these steps to get started:

* Clone or download the repository.
* Open the Google Earth Engine Code Editor.
* Create a new script and paste the code from the repository.
* Modify the table and table2 variables to match your input data.
* Run the script to generate the vegetation indices and visualize the results.


## References
Zeng, Y., Hao, D., Huete, A., Dechant, B., Berry, J., Chen, J. M., Joiner, J., Frankenberg, C., Bond-Lamberty, B., Ryu, Y., Xiao, J., Asrar, G. R., & Chen, M. (2022). Optical vegetation indices for monitoring terrestrial ecosystems globally. Nature Reviews Earth and Environment, 3(7), 477–493. https://doi.org/10.1038/s43017-022-00298-5

Happy coding😊!
