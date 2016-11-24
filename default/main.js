//pouet 
var state = require('state');
var role = require('role');
module.exports.loop = function ()
{
    var tower = Game.getObjectById('583457fc644ca53a54bac80e');
    if(tower) 
    {
        /*var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }*/
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile)
        {
            tower.attack(closestHostile);
        }
    }
    
    for(var name in Memory.creeps) 
    {
        if(!Game.creeps[name]) 
        {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    var runners = _.filter(Game.creeps, (creep) => creep.memory.role == 'runner');
    var runners2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'runner2');
    //console.log('Harvesters: ' + harvesters.length+' | Upgraders: ' + upgraders.length+' | Builders: ' + builders.length);


    if(harvesters.length < 2) 
    {
        var sour;
        var body;
        var newName;
        if(harvesters.length<1)
        {sour = 1;
            body= [WORK,CARRY,MOVE];
        }
        else
        {
            sour = (harvesters[0].memory.source==0)?1:0;
            if(sour==1)
            {
                body=[WORK,WORK,WORK,WORK,WORK,CARRY,MOVE];
            }
            else
            {
                body= [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE];
            }
        }
         newName = Game.spawns['Spawn1'].createCreep(body, undefined, {role: 'harvester', state: state.Mining, source : sour});
        console.log('Spawning new harvester: ' + newName);
    }
    else if(runners.length < 1) 
    {
        var newName = Game.spawns['Spawn1'].createCreep([CARRY,CARRY,MOVE,MOVE], undefined, {role: 'runner', state: state.Running});
        console.log('Spawning new runner: ' + newName);
    }

    else if(repairers.length < 1)
    {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'repairer', state: state.Mining});
        console.log('Spawning new Repairer: ' + newName);
    }
    else if(runners2.length < 2) 
    {
        var newName = Game.spawns['Spawn1'].createCreep([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'runner2', state: state.Running});
        console.log('Spawning new runner: ' + newName);
    }
    else if(upgraders.length < 4) 
    {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,CARRY,MOVE], undefined, {role: 'upgrader', state : state.Mining});
        console.log('Spawning new upgrader: ' + newName);
    }
    else if(builders.length < 3)
    {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'builder', state: state.Eating});
        console.log('Spawning new builder: ' + newName);
    }

    
    for(var name in Game.creeps) 
    {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') 
        {
            role.Harvester.run(creep);
        }
        else if(creep.memory.role == 'upgrader') 
        {
            role.Upgrader.run(creep);
        }
        else if(creep.memory.role == 'builder') 
        {
            role.Builder.run(creep);
            //creep.memory.state=1;
        }
        else if(creep.memory.role == 'attacker')
        {
            role.Attacker.run(creep);
        }
        else if(creep.memory.role == 'repairer')
        {
            role.Repairer.run(creep);
        }
        else if(creep.memory.role =='runner')
        {
            role.Runner.run(creep);
        }
                else if(creep.memory.role =='runner2')
        {
            role.Runner2.run(creep);
        }
    }
}