export const random = (from, to) => {
  if (!to) {
    to = from
    from = 0
  }
  return parseInt(Math.random() * (to - from) + from)
}

export const mergyApi = (api = {}, ...prefix) => {
  for (let key in api) {
    if (typeof api[key] === 'object') {
      mergyApi(api[key], prefix)
    } else {
      prefix.forEach(item => (api[key] = `${item}${api[key]}`))
    }
  }

  return api
}

export function formatDate (d, type = 'second', split = ['-', ':']) {
  if(!d)
  {
    return;
  }

  const date = new Date(d);
  const year = date.getFullYear();
  const month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  const second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

  switch (type) {
    case 'day':
      const splitStr = split[0] + '';
      return year + splitStr + month + splitStr + day;
    default:
    return year + split[0] + month + split[0] + day + ' ' + hour + split[1] + minute + split[1] + second;
  }
}

export function convertQueryString (params) {
    var query = '';
    if(!params)
    {
      return query;
    }
    for(let key in params)
    {
        if(params[key] || params[key] === 0)
        {
            if(query.indexOf('?') === -1)
            {
                query = query + `?${key}=${params[key]}`;
            }else{
                query = query + `&${key}=${params[key]}`;
            }
        }
    }
    return query;
}

export const deepCopy = obj => {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  let result = obj instanceof Array ? [] : {}
  for (let key in obj) {
    result[key] = deepCopy(obj[key])
  }

  return result
}

let Trim = function(str,is_global){
  var result;
  result = str.replace(/(^\s+)|(\s+$)/g,"");
  if(is_global.toLowerCase()=="g")
  {
    result = result.replace(/\s/g,"");
  }
  return result;
}


//身份验证
export const  handleID = (data) => {
  let newData = Trim(data,'g')
  if((/\s/g).test(newData)){
    return '---';
  }else if( newData.length > 6 && newData.length < 12 ){
    return (newData.substr(0, 3) + '****'+newData.substr(7, 12))
  } else if( newData.length === 15 ){
    return (newData.substr(0, 6) + '******'+newData.substr(12, 15))
  } else if( newData.length === 18 ){
    return (newData.substr(0, 6) + '*******'+newData.substr(14, 18))
  }else{
    return '---'
  }
}
