define(function(require, exports){
  var config = require('script/config');
  var Module = Backbone.Model.extend({
    
  });

  var Modules = Backbone.Collection.extend({
    model : Module
    , url : '/api/module'
    , parse : function(data){
      var modelData = [];
      if(data.success == 1){
        this.total = data.total;
        modelData = data.data; 
      }else{
        this.total = 0;
      }
      return modelData;
    }
  });

  var ModelItemView = Backbone.View.extend({
    initialize : function(model){
      this.model = model;
    }
    , render : function(){
      this.$el.html(_.template(this.template, {
        module : this.model
      }));
      this.$('.panel-body').block(config.LOADING_CONFIG);
      this.$('.panel-heading .refreshBtn').click(function(){
          var $panelBody = $(this).closest('.panel').find('.panel-body');
          $panelBody.block(config.LOADING_CONFIG);
      });
      require.async(_.template(this.jsPath, {id : this.model.get('id')}))
      return this;
    }
    , jsPath : '/public/modules/<%= id %>/main.js'
    , template : 
      '<div class="<%= module.get(\'width\') %> blockItem" id = "<%= module.get(\'id\') %>">' + 
          '<div class="panel panel-info">' + 
            '<div class="panel-heading"><%= module.get(\'name\') %><a class = "pull-right refreshBtn" href = "javascript:void(0);"><i class = "glyphicon glyphicon-refresh"></i></a></div>' +
            '<div class="panel-body"><!--用js来渲染 --></div>' +
          '</div>' +
      '</div>'
  });

  var ModuleListView = Backbone.View.extend({
    el : '#main'
    , initialize : function(models){
      this.model = models;
      this.renderedModel = new Modules();
      this.listenTo(this.model, 'add', this.render);
      // this.listenTo(this.model, 'remove', this.render);
      // this.listenTo(this.model, 'change', this.render);
    }
    , render : function(){
      var self = this;
      this.model.forEach(function(each){// 保证每个格子只渲染一次
        if(self.renderedModel.indexOf(each) < 0) {
          self.renderedModel.add(each);
          self.$el.append(new ModelItemView(each).render().$el);
        }
      });
      return this;
    }
    
  });

  
  exports.Modules = Modules;
  exports.View = ModuleListView;
  
});

       