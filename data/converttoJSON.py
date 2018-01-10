# Toon van Holthe tot Echten
# 10798595
# JSON and csv formatter

"""
Convert txt files to JSON
"""

import json
import csv

# define headers raw data
header = '#'
raw_data = open("KNMI_DATA_2.txt", 'r')
ITEM_0 = 0
ITEM_1 = 1
ITEM_2 = 2
ITEM_3 = 3
ITEM_4 = 4

def reformat_txt(raw_data):

    tmp_data = []

    with raw_data as in_file:
        for line in raw_data:
            if line[0] != header:
                tmp_data.append(line.strip().split(','))

        list_dict_FHX = []
        list_dict_T10N = []
        list_dict_TX = []
        list_dict = []

        for line in tmp_data:
            if line[0] == '240':
                line[0] = 'Noord-Holland'
            if line[0] == '260':
                line[0] = 'Utrecht'
            if line[0] == '269':
                line[0] = 'Flevoland'
            if line[0] == '270':
                line[0] = 'Friesland'
            if line[0] == '280':
                line[0] = 'Groningen'
            if line[0] == '283':
                line[0] = 'Overijssel'
            if line[0] == '290':
                line[0] = 'Gelderland'
            if line[0] == '312':
                line[0] = 'Zeeland'
            if line[0] == '319':
                line[0] = 'Drenthe'
            if line[0] == '344':
                line[0] = 'Zuid-Holland'
            if line[0] == '370':
                line[0] = 'Noord-Brabant'
            if line[0] == '380':
                line[0] = 'Limburg'

        for line in tmp_data:
            list_dict.append({'STN':line[ITEM_0],'DATE':int(line[ITEM_1]),'TYPE':'TX','VALUE':line[ITEM_2].strip()})

        # for line in tmp_data:
        #     list_dict_T10N.append({'STN':line[ITEM_0],'DATE':int(line[ITEM_1]),'TYPE':'T10N','VALUE':line[ITEM_4].strip()})
        #
        # for line in tmp_data:
        #     list_dict_TX.append({'STN':line[ITEM_0],'DATE':int(line[ITEM_1]),'TYPE':'TX','VALUE':line[ITEM_3].strip()})

        # list_dict = list_dict_FHX  + [x for x in list_dict_T10N if x not in list_dict_FHX]
        # list_dict = list_dict + [x for x in list_dict_TX if x not in list_dict]

        json_data = json.dumps(list_dict)
        j = json.loads(json_data)

        with open('DATA_w6_2.json', 'w') as outfile:
            json.dump(j, outfile)

reformat_txt(raw_data)
