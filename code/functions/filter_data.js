function filter_JSON(json, key, value) {
    var result = [];
    json.forEach(function(val,idx,arr){
        if(val[key] == value){
            result.push(val)
        }
    })
    return result
    }
