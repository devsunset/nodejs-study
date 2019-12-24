import uuid4 from 'uuid4'

//json object concat
function jsonConcat (o1, o2) {
    for (var key in o2) {
     o1[key] = o2[key];
    }
    return o1;
}

//request get parameter Object Type
exports.getParamsObj = function (req){
    var params = req.query;
    params = jsonConcat(params,req.params);
    params = jsonConcat(params,req.body);
    return params;
}
  
//request get parameter Json Type
exports.getParamsJson = function (req){
    var params = req.query;
    params = jsonConcat(params,req.params);
    params = jsonConcat(params,req.body);
    return JSON.parse(JSON.stringify(params));
}

exports.uuid = () => {
  const tokens = uuid4().split('-')
  return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4]
}