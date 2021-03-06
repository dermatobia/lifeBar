window.importExport = {

  save: function(lifeBar) {
    var lifeBarJSON = {};
    this.saveGoals(lifeBar, lifeBarJSON);
    this.saveConnections(lifeBar, lifeBarJSON);
    return lifeBarJSON;
  },

  saveGoals: function(lifeBar, lifeBarJSON) {
    var exportedGoals = [];
    var maxId = 0;
     _.each(lifeBar.goals, function(goal){
      var goalData = {};
      goalData.id = goal.id;
      goalData.x = goal.x;
      goalData.y = goal.y;
      goalData.title = goal.title;
      goalData.completed = goal.completed;
      goalData.reflection = goal.reflection;
      exportedGoals.push(goalData);
      if(goalData.id > maxId) {
        maxId = goalData.id;
      };
    })
    lifeBarJSON.maxId = maxId;
    lifeBarJSON.goals = exportedGoals;
  },

  saveConnections: function(lifeBar, lifeBarJSON) {
    var exportedConnections = [];
    _.each(lifeBar.connections, function(connection){
      var connectionData = {};
      connectionData.from = connection.from.model.id;
      connectionData.to = connection.to.model.id;
      exportedConnections.push(connectionData);
    })
    lifeBarJSON.connections = exportedConnections;
  },


  populate: function(lifeBar, data) {
    if(data.goals){ this.populateGoals(lifeBar, data); }
    if(data.connections) { this.populateConnections(lifeBar, data); }
  },

  populateGoals: function(lifeBar, data) {
    if(data === {}) { // figure out what non-existent object from mongodb will be here
      return;
    }
    lifeBar.goalCounter = data.maxId + 1;
    _.each(data.goals,function(goal) {
      lifeBar.createGoal(goal);
    })
  },

  populateConnections: function(lifeBar, data) {
    _.each(data.connections, function(connection) {
      var fromgoal = lifeBar.findGoalById(connection.from);
      var togoal = lifeBar.findGoalById(connection.to);
      lifeBar.createConnection(fromgoal.elem, togoal.elem);
    })
  },



  saveLifeData: function(){
    var data = {life_data: this.save(lifeBar)};
    $.ajax({
      async:false,
      type: "POST",
      url: '/save',
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data),
      dataType: "json"
    });
  },

  loadLifeData: function() {
    var that = this;
    $.ajax({
      type: "GET",
      url: '/load',
      dataType: "json",
      success: function(data) {
        that.populate(window.lifeBar, data);
      }
    })
  }

}
window.autoSave = function() {
  if ($("#logged-in").length) {
    importExport.saveLifeData();
  };
};
