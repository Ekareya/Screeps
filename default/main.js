global.jlog = function (string) { console.log(JSON.stringify(string)); };
global.s = require('state');
global.r = require('role');
global.RC = require('RC');
global.c = require('console');
var spawner = require('spawner');

module.exports.loop = function ()
{

    RC.emitLog("E67S14");
    for (var name in Memory.creeps)
    {
        if (!Game.creeps[name])
        {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }

    }
    var towers = Game.rooms['E67S14'].find(FIND_MY_STRUCTURES, { filter: struc => struc.structureType === "tower" });
    for (let towerId in towers)
    {
        let tower = towers[towerId];
        if (tower)
        {
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile)
            {
                tower.attack(closestHostile);
            }
            var closestDamagedCreeps = tower.pos.findClosestByRange(FIND_MY_CREEPS, { filter: creep => creep.hits < creep.hitsMax })
            if (closestDamagedCreeps)
            {
                tower.heal(closestDamagedCreeps);
            }
        }
    }

    //look up table of creep by role, with at least an empty array
    var creepByRole = _.indexBy(Object.keys(r));
    for (var role in creepByRole)
    {
        creepByRole[role] = [];
    }
    creepByRole = _.merge(creepByRole, _.groupBy(Game.creeps, creep =>creep.memory.role));
    spawner.spawn(creepByRole);

    for (let name in Game.creeps)
    {

        let creep = Game.creeps[name];

        r[creep.memory.role].run(creep);
    }
}