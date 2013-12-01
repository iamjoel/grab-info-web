define(function(require){
    var config = require('script/config');
    require('lib/lodash.min');
    require('constellation/main.css');

    var $root = $('#constellation');
    var tpl = require('constellation/main.html#');
    $root.append(tpl);
    var mainTpl  = $('.mainTemp', $root).html();

    $('.panel-body',$root).html(mainTpl);

    getConstellationData(function(data){
        renderRestaurantRankData(data);
    });

    $('.refreshBtn',$root).click(function(){
        getConstellationData(function(data){
            renderRestaurantRankData(data);
        });
    });
    
    function getConstellationData(callback){
        var loadNum = 0;
        for(var i = 0; i < 12; i++){
            $.ajax({
                url: config.URL.constellation
                ,data: {
                    fun : 'day'
                    ,id : i
                    ,format : 'jsonp'
                }
                ,dataType: 'jsonp'
            }).done(function(data){
                loadNum ++;
                data = formatConstellationData(data);
                if(callback && _.isFunction(callback)){
                    callback(data);
                }
                if(loadNum == 12){
                    $('.scrollWrap',$root).perfectScrollbar();
                }
            }).always(function(){
                $('.panel-body', $root).unblock();
            });
        }
    };

    function renderRestaurantRankData(data){
        var itemTpl = $('.itemTemp', $root).html();
        var $wrap = $('#constellationWrap');

        if(data){
            $wrap.append(_.template(itemTpl,data));
        }else{
        }

    };

    function formatConstellationData(data){
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