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

# define headers raw data
raw_data_FOSL = open("fossil\API_EG.ELC.FOSL.ZS_DS2_en_csv_v2.csv", 'r')
raw_data_REN = open("renewable\API_EG.ELC.RNWX.ZS_DS2_en_csv_v2.csv", 'r')

def reformat_txt(raw_data, type, output_name):

    tmp_data = []

    with raw_data as in_file:
        for i in range(5):
            next(raw_data)
        for line in raw_data:
            tmp_data.append(line.strip().split(','))

        list_dict = []
        i = 0
        j = 0
        values = []

        for line in tmp_data:
            list_dict.append({'CC':line[1].strip("\""),'TYPE':type})

            # check for outliers
            for el in line[6:]:
                j+=1
                if j > 58:
                    del line[-1]

            # convert no values to nan and values to floats
            for el in line[6:]:
                el = el.strip("\"")
                if el == '':
                    # el = np.nan
                    el = None
                else:
                    el = float(el)
                values.append(el)

            j = 0

        new_dict  = []

        # get all years
        for line in list_dict:
            for i in range(2017-1960+1):
                year = 1960 + i
                line.update({'YEAR':year})
                new_dict.append(copy.deepcopy(line))
                i += 1

        print(len(values))
        print(len(new_dict))

        #  add values to dict
        for i in range(len(values)):
            new_dict[i]['VALUE'] = values[i]

        print(new_dict)

        # write data
        json_data = json.dumps(new_dict)
        j = json.loads(json_data)

        with open(output_name, 'w') as outfile:
            json.dump(j, outfile)

reformat_txt(raw_data_FOSL, 'FOSL', 'data_fosl.json')
reformat_txt(raw_data_REN, 'REN', 'data_ren.json')

def merge_JSON(data_1, data_2, output_name):

    data_1 = json.load(open(data_1))
    data_2 = json.load(open(data_2))

    data_project = data_1 + data_2

    json_data = json.dumps(data_project)
    j = json.loads(json_data)

    with open(output_name, 'w') as outfile:
        json.dump(j, outfile)


merge_JSON('data_fosl.json','data_ren.json', 'data_project.json')
