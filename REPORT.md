# REPORT - Toon van Holthe tot Echten - 10798595

## Intro

For the minor programming, The students were asked to create one final product.
This product could either be an app for mobile devices or a website visualising
data according to a chosen theme. For this final product the visualisation of
the difference between energy produced from fossil & renewable sources was
chosen. A country can be selected by clicking on the world map. The changes
of energy used over the years is shown in a line graph. And the difference
between the two sources and between the selected countries is shown in a
horizontal bar chart. This way not only the transition of energy sources is
shown for a country, but also different countries can be compared.

### Final product
![alt text](https://github.com/TVHTE/Final_Project/blob/master/doc/final_product.png)

## Technical design

### Data

The data was collected from the data worldbank. This database provides csv files
with the data needed to create the visualisations. For this project two
databases were used:

    * % of total energy produced from fossil fuels
    * % of total energy produced from renewable sources
    (excluding hydroenergy)

The datasets were converted to .json files. An example of an element from one
of the datasets is: "{"CC": "AFG", "TYPE": "FOSL", "YEAR": 2010, "VALUE": null}".
For each element there are four components :

    * "CC" - Country Code
    * "TYPE" -  FOSL or REN = Fossil or renewable
    * "YEAR" - Year
    * "VALUE" - % of total energy produced

With the
