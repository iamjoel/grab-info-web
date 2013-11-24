$(document).ready(function(){
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
      return this;
    }
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
  var modules = new Modules();
  var view = new ModuleListView(modules);

  modules.fetch().done(function(data){
    
  });
});
       