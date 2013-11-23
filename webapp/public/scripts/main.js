$(document).ready(function(){
  var Module = Backbone.Model.extend({});

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
  var ModuleList = Backbone.View.extend({
    el : '#main'
    , initialize : function(models){
      this.$el = $(this.el);
      this.rendered = false;
      this.model = models;
      this.listenTo(this.model, 'add', this.render);
      // this.listenTo(this.model, 'remove', this.render);
      // this.listenTo(this.model, 'change', this.render);
    }
    , render : function(){
      if(this.model.length === this.model.total && !this.rendered){//为了保证只渲染一次
        this.rendered = true;
        this.$el.html(_.template(this.template, {
          modules : this.model.models
        }));
        return this;
      }
      
    }
    , template : 
      '<% modules.forEach(function(module){ %>' + 
        '<div class="<%= module.get(\'width\') %> blockItem" id = "<%= module.get(\'id\') %>">' + 
            '<div class="panel panel-info">' + 
              '<div class="panel-heading"><%= module.get(\'name\') %><a class = "pull-right refreshBtn" href = "javascript:void(0);"><i class = "glyphicon glyphicon-refresh"></i></a></div>' +
              '<div class="panel-body"><!--用js来渲染 --></div>' +
            '</div>' +
        '</div>' +
      '<% }); %>'
  });
  var modules = new Modules();
  var view = new ModuleList(modules);

  modules.fetch().done(function(data){
    
  });
});
       