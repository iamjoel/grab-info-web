$.ajaxSetup({
  timeout: 5000
});
define(function(require, exports) {
  var config = require('script/config');
  var Module = Backbone.Model.extend({

  });

  var TagModules = Backbone.Model.extend({});
  // moudles可包含多个 tagModule
  var Modules = Backbone.Collection.extend({
    model: TagModules,
    url: '/api/module',
    parse: function(data) {
      var modelData = [];
      if (data.success == 1) {
        this.total = data.total;
        modelData = data.data;
      } else {
        this.total = 0;
      }
      return modelData;
    }
  });


  var ModelItemView = Backbone.View.extend({
    initialize: function(model) {
      this.model = model;
    },
    render: function() {
      this.$el.html(_.template(this.template, {
        module: this.model
      }));
      this.$('.panel-body').block(config.LOADING_CONFIG);
      this.$('.panel-heading .refreshBtn').click(function() {
        var $panelBody = $(this).closest('.panel').find('.panel-body');
        $panelBody.block(config.LOADING_CONFIG);
      });
      require.async(_.template(this.jsPath, {
        id: this.model.id
      }))
      return this;
    },
    jsPath: '/public/modules/<%= id %>/main.js',
    template: '<div class="<%= module.width %> blockItem" id = "<%= module.id %>">' +
      '<div class="panel panel-info">' +
      '<div class="panel-heading"><%= module.name %><a class = "pull-right refreshBtn" href = "javascript:void(0);"><i class = "glyphicon glyphicon-refresh"></i></a></div>' +
      '<div class="panel-body"><!--用js来渲染 --></div>' +
      '</div>' +
      '</div>'
  });
  var ModulesTagView = Backbone.View.extend({
    initialize: function(param) {
      this.el = param.el;
      this.$el = $(param.el);
      this.model = param.model;
      this.render();
    },
    render: function() {
      var self = this;
      this.model.get('modules').forEach(function(each) { // 保证每个格子只渲染一次
        self.$el.append(new ModelItemView(each).render().$el);
      });
      return this;
    }
  });
  var ModulesView = Backbone.View.extend({
    el: '#main',
    initialize: function(models) {
      this.model = models;
      this.renderedModel = new Modules();
      this.views = [];
      this.listenTo(this.model, 'add', this.addTagModel);

      // this.listenTo(this.model, 'remove', this.render);
      // this.listenTo(this.model, 'change', this.render);
    },
    addTagModel: function() {
      var self = this;
      this.model.forEach(function(each) { // 保证每个格子只渲染一次
        if (self.renderedModel.indexOf(each) < 0) {
          self.renderedModel.add(each);
          self.views.push({
            model: each,
            view: new ModulesTagView({
              el: '#model-tag-' + each.get('id'),
              model: each
            })
          });
        }
      });
      return this;
    }

  });



  exports.Modules = Modules;
  exports.View = ModulesView;

});