# REPORT - Toon van Holthe tot Echten - 10798595

## Intro

For the minor programming, The students were asked to create one final product.
This product could either be an app for mobile devices or a website visualising
data according to a chosen theme. For this final product the visualization of
the difference between energy produced from fossil & renewable sources was
chosen. A country can be selected by clicking on the world map. The changes
of energy used over the years is shown in a line graph. And the difference
between the two sources and between the selected countries is shown in a
horizontal bar chart. This way not only the transition of energy sources is
shown for a country, but also different countries can be compared.

### Final product
![alt text](https://github.com/TVHTE/Final_Project/blob/master/doc/final_product.png)

## Technical design

For this product there are several key components:

    * Data
    * Functions
    * Linking
    * Style

The data is the basis of the product. Using functions, the data can be filtered
and used for different visualizations (updated). The functions are also used to link
everything together. To put all these components together, one main script is used.
The main component for this poduct is the worldmap. Through the world map the data
and the functions are linked. To visualise everything nicely, the style can be changed.

### Data

The data was collected from the data worldbank. This database provides csv files
with the data needed to create the visualizations. For this project two
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

### Functions

In this product, the following functions are used:

    * analyze()
    * update_bar()
    * update_graph()
    * clear_all()
    * filter_JSON()

#### analyze()

This function is the key component of the product. This function directs the
users input in the right way. when using the slider or when clicking on the world
map, other functions are called upon. Here also all the data is loaded and can
be used for analysation. For the world map, datamaps is used which has a lot of
built-in features.

#### update_bar()

Update_bar() requires two input arguments, the year selected using the slider
and the data gained by clicking on the worldmap. For each country that is clicked,
the data is added to the bar chart. this chart is constantly updated when using
the slider.

#### update_graph()

In order to give an overview of which energy sources a country uses over time,
the line graph is given. This function only requires one input argument since
all years are given to show a complete overview.

#### clear_all()

This function clears the selected countries by removing the svg.

#### filter_JSON()

Depending on which country is selected, this function filters the 'raw' data.
This function requires three input arguments, the raw data, the key on which
to filter and the value. it returns the filtered data.

### Challenges

During this project, there were several challanges. At first ignorance is no
bless when designing your own site. Things such as datamaps, are very helpful
when the existence is known.

Linking different visualizations was also harder than expected. For a lot of
graphs and charts examples are given. However, most of the time the input data
which is used for these examples completely differ. In order to link everything
nicely, the data needs to be reformatted several times.

During the creation of the product there were some trade-offs. It would have been
nice to see the percentual change in the source of the energy of the years as
well as a change in the color of the world map according to GDP. It is a lot more
work to design your own charts and linking them together in a nice way than
making your data similar to data used for example graphs etc and using these for
the visualizations.

### Recap

During the project there were some pitfalls. Linking the whole site was definately
one of those. It was harder than expected to draw some bars and have them up and
running on the selected data. A lot of time was spend on getting the links working
properly this is why there wasn't much time for styling and css. However style is
a very important part of the product, without style the site isn't very attractive.
Next time more time will be spend on this part of the product.
