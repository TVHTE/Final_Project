# Toon van Holthe tot Echten
# 10798595
# JSON and csv formatter

"""
Convert csv files to JSON
"""

import json
import csv
import copy
import numpy as np
import pandas as pd

# define headers raw data
raw_data_FOSL = open("fossil\API_EG.ELC.FOSL.ZS_DS2_en_csv_v2.csv", 'r')
raw_data_REN = open("renewable\API_EG.ELC.RNWX.ZS_DS2_en_csv_v2.csv", 'r')

def reformat_txt(raw_data, output):

    tmp_data = []

    with raw_data as in_file:
        for i in range(5):
            next(raw_data)
        for line in raw_data:
            tmp_data.append(line.strip().split(','))

    list_csv = []
    j = 0
    list_csv_2 = []
    json = {}
    land = []
    all_val = []


    for line in tmp_data:

        # check for outliers
        for el in line[6:]:
            j+=1
            if j > 58:
                del line[-1]

        j = 0
        values = []
        list_csv_tmp = []

        # convert no values to nan and values to floats
        for el in line[6:]:
            el = el.strip("\"")
            if el == '':
                el = 0
            else:
                el = float(el)

            values.append(el)

            cc = [line[1].strip("\"")]
            list_csv_tmp = cc + values

        all_val.append(values)

        list_csv.append(list_csv_tmp)

        land.append(line[1].strip("\""))

        # for i in range(2017-1959):
        #     tmp_dict = {line[1].strip("\""):line[6 + i].strip("\"")}
        #     json[1960 + i] = tmp_dict

    years = []

    for i in range(2018-1960):
        years.append(1960+i)

    print(years)

    csvfile = output

    with open(csvfile, "w") as output:
        writer = csv.writer(output, lineterminator='\n')
        writer.writerow(['CC',1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986,
        1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013,
        2014, 2015, 2016, 2017])
        writer.writerows(list_csv)

reformat_txt(raw_data_REN, 'bar_REN.csv')
