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
raw_data = open("fossil/Metadata_Country_API_EG.ELC.FOSL.ZS_DS2_en_csv_v2.csv", 'r')
type = 'FOSL'

def reformat_txt(raw_data):

    tmp_data = []

    with raw_data as in_file:

        next(raw_data)

        for line in raw_data:
            tmp_data.append(line.strip().split(','))

        list_dict = []

        for line in tmp_data:
            if len(line[0]) == 5:
                list_dict.append({'CC':line[0].strip("\""),'CLASS':line[2].strip('\"')})

        for el in list_dict:
            print(el['CLASS'])
            if el['CLASS'] == 'High income':
                el['CLASS'] = 4
            elif el['CLASS'] == 'Upper middle income':
                el['CLASS'] = 3
            elif el['CLASS'] == 'Lower middle income':
                el['CLASS'] = 2
            elif el['CLASS'] == 'Low income':
                el['CLASS'] = 1
            else:
                el['CLASS'] = 0

        # write data
        json_data = json.dumps(list_dict)
        j = json.loads(json_data)

        with open('META.json', 'w') as outfile:
            json.dump(j, outfile)

reformat_txt(raw_data)
