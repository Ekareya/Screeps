var console=
{
    info(id)
    {
        jlog(Game.getObjectById(id));
    },
    set(creep,mem,value)
    {
        Memory.creeps[creep][mem] = value;
        jlog(creep+".memory: "+mem+" set to: " + Memory.creeps[creep][mem]);
    },
    goTo: function(creep,x,y)
    {
        Game.creeps[creep].memory.x = x;
        Game.creeps[creep].memory.y = y;
    },
    targetAll: function (target)
    {
        for (let creep in Game.creeps)
        {
            if (Game.creeps[creep].memory.role === 5)
            {
                creepSet(creep,"target", target);
            }
        }
    },
    createHauler: function(module,name)
    {
        var body = new Array(module*2);
        for (let i = 0; i < module ; i++)
        {
            body[i] = CARRY;
            body[module * 2 - i -1] = MOVE;
        }
        return Game.spawns['Spawn1'].createCreep(body, undefined, { role: name });
    },

    createWorker:function(workPart,name)
    {
        var body = new Array(workPart +2);
        for (let i = 0; i < workPart ; i++)
        {
            body[i] = WORK;
        }
        body[workPart] = CARRY;
        body[workPart + 1] = MOVE;
        return Game.spawns['Spawn1'].createCreep(body, undefined, { role: name,source:1 });
    },
    createAttacker: function ()
    {
        return Game.spawns['Spawn1'].createCreep([MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE], undefined, { role: 'attacker' });

    },
    createScout: function(dest)
    {
        Game.spawns['Spawn1'].createCreep([TOUGH, TOUGH,TOUGH, MOVE, MOVE, MOVE], "Scout", { role: 9, destination: dest, state: 11 });
    }
}
module.exports = console;