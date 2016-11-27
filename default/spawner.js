var spawner={
    spawn: function(creepByRole)
    {
        if (creepByRole['harvester'].length < 1)
        {
            var body = [WORK, WORK, CARRY, MOVE];
            Game.spawns['Spawn1'].createCreep(body, undefined, { role: 'harvester', source: 1 });

        }
        else if (creepByRole['runner'].length < 1)
        {
            c.createHauler(1);
        }
        else
        {
            for (var role in creepByRole)
            {


                if (creepByRole[role].length < 1)
                {
                    switch (role)
                    {
                        case 'builder':
                            let body = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
                            Game.spawns['Spawn1'].createCreep(body, undefined, { role: 'builder' });
                            break;
                        case 'upgrader': c.createWorker(10, role); break;
                        case 'miniupgrader': c.createWorker(5, role); break;
                        case 'repairer': c.createWorker(1, role); break;
                        case 'hauler': c.createHauler(6, role); break;
                    }
                }
                else if (creepByRole[role].length < 2)
                {
                    switch (role)
                    {
                        case 'runner': c.createHauler(5, role); break;
                        case 'harvester': this.harvester(creepByRole[role], 2); break;
                    }
                }
            }
        }

    },

    harvester(creeps,flag)
    {
        if(flag === 1)
        {
            //room.energyAvailable
            var body = [WORK, WORK, CARRY, MOVE];
            return Game.spawns['Spawn1'].createCreep(body, undefined, { role: 'harvester', source: 1 });

        }
        else if(flag === 2)
        {
            let source = (creeps[0].memory.source === 0) ? 1 : 0;
            var body = (source) ? [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE] : [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE];
            return Game.spawns['Spawn1'].createCreep(body, undefined, { role: 'harvester', source: source });

        }
    }
    
}

module.exports = spawner;