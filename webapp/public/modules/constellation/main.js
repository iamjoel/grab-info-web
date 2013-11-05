define(function(require){
    require('lodash.min');
    require('/public/modules/constellation/main.css');

    var ROOT_PATH = '/public/modules/constellation/';
    var mainTpl  = require('/public/modules/constellation/main.html#');
    var itemTpl = require('/public/modules/constellation/item.html#');
    var $wrap;

    $('#constellation .panel-body').html(mainTpl);
    $wrap = $('#constellationWrap');
    for(var i = 0; i < 12; i++){
        $.ajax({
            url:'http://api.uihoo.com/astro/astro.http.php'
            ,data:{
                fun : 'day'
                ,id : i
                ,format : 'jsonp'
            }
            ,dataType:'jsonp'
        }).done(function(data){
            data = getConstellationData(data);
            $wrap.append(_.template(itemTpl,data));
            $('#constellation .panel-body').unblock();
        });
    }
    

    function getConstellationData(data){
        var info = {};
        data.forEach(function(each){
            if(_.isObject(each)  && !_.isArray(each)){
                if(each.cn){
                    info.name = each.cn;
                }else if(each.title === '综合概述'){
                    info.sugg = each.value;
                }
            }
        });
        return info;
    }

});