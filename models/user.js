var fs = require('fs');
var filename = require('../config').basePath + '/datas/user.json';

function findBy(id) {
    var user;
    if (id == undefined) {
        console.error('@param:userId is needed');
        return false;
    }
    var allUsers = JSON.parse(fs.readFileSync(filename, 'utf8'));
    var modules = null;
    var isFind = false;
    allUsers.forEach(function(each) {
        if (!isFind) {
            if (each.id === id) {
                user = each;
                isFind = true;
            }
        }

    });
    return user;
}

function getModules(id) {
    var user = findBy(id);
    var detailModules = null;
    if (user) {
        var orginModules = user.modules;
        detailModules = [];
        orginModules.forEach(function(each) {
            var tagModules = {
                id: each.id,
                name: each.name,
                modules: []
            };
            each.list.forEach(function(eachModuleName) {
                tagModules.modules.push(require('../modules/' + eachModuleName + '/config'));
            });
            detailModules.push(tagModules);
        });
    }
    return detailModules;
}


module.exports.getModules = getModules;