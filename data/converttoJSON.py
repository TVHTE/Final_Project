# Toon van Holthe tot Echten
# 10798595
# JSON and csv formatter

"""
Convert csv files to JSON
"""

import json
import csv
import copy

# define headers raw data
raw_data = open("fossil\API_EG.ELC.FOSL.ZS_DS2_en_csv_v2.csv", 'r')

def reformat_txt(raw_data):

    tmp_data = []

    with raw_data as in_file:
        for i in range(5):
            next(raw_data)
        for line in raw_data:
            tmp_data.append(line.strip().split(','))

        list_dict = []
        i = 0
        values = []

        for line in tmp_data:
            list_dict.append({'CC':line[1].strip("\""),'TYPE':'FOSL'})

            # i += 1

            for el in line[6:]:
                values.append(el.strip("\""))

        new_dict  = []

        for line in list_dict:
            for i in range(2017-1960+1):
                year = 1960 + i
                new_dict.append(copy.deepcopy(line)
                # line.update({'YEAR':year})
                i += 1

        print(list_dict)

        json_data = json.dumps(list_dict)
        j = json.loads(json_data)

        with open('DATA_FOSSIL.json', 'w') as outfile:
            json.dump(j, outfile)

reformat_txt(raw_data)
