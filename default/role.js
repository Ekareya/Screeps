var a = require('action');
var role =
{    //Refactored_Zone----------------------------------------------------------------------------------------


    //-----------------------------------------------------------------------------------------------------

    //Refactor_Zone------------------------------------------------------------------------------------------

    runner:
    {
        max: 1,
        run: function (creep)
        {
            //RC.creepLog(creep);
            switch (creep.memory.state)
            {
                case s.Running:
                    a.takeIn(creep, s.Emptying, s.Leeching, FIND_STRUCTURES, { filter: struct => struct.structureType == STRUCTURE_CONTAINER }, 'withdraw'); break;
                case s.Emptying:
                    a.feedSpawn(creep, s.Running, s.Feeding); break;
                case s.Leeching:
                    a.leeching(creep, s.Emptying); break;
                case s.Feeding:
                    a.feeding(creep, s.Running, s.Hauling, { filter: struct => struct.structureType == STRUCTURE_TOWER && struct.energy < struct.energyCapacity }); break;
                case s.Hauling:
                    a.hauling(creep, s.Running); break;
                default:
                    creep.memory.state = (creep.spawning) ? '' : s.Running; break;
            }
        }
    },

    sweeper:
    {
        run: function (creep)
        {
            switch (creep.memory.state)
            {
                case s.Running:
                    a.takeIn(creep, s.Emptying, s.Emptying, FIND_DROPPED_ENERGY, {}, 'pickup'); break;
                case s.Emptying:
                    creep.memory.role = 'runner';//a.feedStorage(creep, s.Running); break;
                default:
                    creep.memory.state = (creep.spawning) ? '' : s.Running; break;
            }
        }
    },

    upgrader:
    {

        run: function (creep)
        {
            switch (creep.memory.state)
            {
                case s.Eating:
                    a.takeIn(creep, s.Upgrading, s.Upgrading, FIND_STRUCTURES, { filter: struct => struct.structureType == STRUCTURE_CONTAINER }, 'withdraw'); break;
                case s.Upgrading:
                    a.upgrading(creep, s.Eating); break;
                default:
                    creep.memory.state = (creep.spawning) ? '' : s.Eating; break;
            }
        }
    },
    miniupgrader:
{

    run: function (creep)
    {
        switch (creep.memory.state)
        {
            case s.Eating:
                a.takeIn(creep, s.Upgrading, s.Upgrading, FIND_STRUCTURES, { filter: struct => struct.structureType == STRUCTURE_CONTAINER }, 'withdraw'); break;
            case s.Upgrading:
                a.upgrading(creep, s.Eating); break;
            default:
                creep.memory.state = (creep.spawning) ? '' : s.Eating; break;
        }
    }
},
    harvester:
    {
        run: function (creep)
        {
            switch (creep.memory.state)
            {
                case s.Mining:
                    a.harvesting(creep, s.Emptying, creep.memory.source); break;
                case s.Emptying:
                    a.feeding(creep, s.Mining, s.Mining, { filter: struct => struct.structureType == STRUCTURE_TOWER && struct.energy < struct.energyCapacity }); break;
                default:
                    creep.memory.state = (creep.spawning) ? '' : s.Mining; break;
            }
        }
    },

    repairer:
    {
        run: function (creep)
        {
            switch (creep.memory.state)
            {
                case s.Eating:
                    a.takeIn(creep, s.Repairing, s.Repairing, FIND_STRUCTURES, { filter: struct => struct.structureType == STRUCTURE_CONTAINER && struct.store.energy > 0 }, 'withdraw'); break;
                case s.Mining:
                    a.mining(creep, s.Building, 0); break;
                case s.Repairing:
                    a.repairing(creep, s.Eating, s.Upgrading); break;
                case s.Upgrading:
                    a.upgrading(creep, s.Eating); break;
                default:
                    creep.memory.state = (creep.spawning) ? '' : s.Eating; break;
            }
        }
    },
    attacker:
    {
        run: function (creep)
        {
            switch (creep.memory.state)
            {
                case s.Attacking: a.attacking(creep); break;
                    //case s.Attacking: a.berzerk(creep); break;
                    //case s.Attacking: a.raze(creep, STRUCTURE_EXTENSION); break;
                    //case s.Attacking: a.raze(creep, STRUCTURE_WALL); break;
                case s.Moving: a.moving(creep, 29, 10); break;
                default:
                    creep.memory.state = (creep.spawning) ? '' : s.Moving;
                    creep.memory.dest = "E67S13";
                    creep.memory.target = "583903baae40d2df107d5d20";
                    break;

            }
        }
    },

    hauler:
    {
        run: function (creep)
        {
            a.hauling(creep, 0);
        }
    },
    claimer:
    {
        run: function (creep)
        {
            a.claiming(creep, 'E67S13');
        }
    },
    builder:
    {
        run: function (creep)
        {
            switch (creep.memory.state)
            {
                case s.Eating:
                    a.takeIn(creep, s.Building, s.Building, FIND_STRUCTURES, { filter: struct => struct.structureType == STRUCTURE_CONTAINER }, 'withdraw'); break;
                case s.Building:
                    a.building(creep, s.Eating); break;
                default:
                    creep.memory.state = (creep.spawning) ? '' : s.Eating; break;

            }
        }
    }
    //-----------------------------------------------------------------------------------------------------



}
module.exports = role;