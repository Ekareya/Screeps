var action =
{
    //TOOL-------------------------------------------------------------------------------------------------
    stateLog: function (state)
    {
        switch (state)
        {
            case 0: jlog("OK"); break;
            case -1: jlog("ERR_NOT_OWNER"); break;
            case -2: jlog("ERR_NO_PATH"); break;
            case -3: jlog("ERR_NAME_EXISTS"); break;
            case -4: jlog("ERR_BUSY"); break;
            case -5: jlog("ERR_NOT_FOUND"); break;
            case -6: jlog("ERR_NOT_ENOUGH_RESOURCES/ENERGY/EXTENSIONS"); break;
            case -7: jlog("ERR_INVALID_TARGET"); break;
            case -8: jlog("ERR_FULL"); break;
            case -9: jlog("ERR_NOT_IN_RANGE"); break;
            case -10: jlog("ERR_INVALID_ARGS"); break;
            case -11: jlog("ERR_TIRED"); break;
            case -12: jlog("ERR_NO_BODYPART"); break;
            case -14: jlog("ERR_RCL_NOT_ENOUGH"); break;
            case -15: jlog("ERR_GCL_NOT_ENOUGH"); break;
            default: jlog('ERR_WTF'); break;
        }
    },

    findClosestTarget: function (creep, mem, what, filter)
    {
        let target = Game.getObjectById(creep.memory[mem]);
        if (!target)
        {
            target = creep.pos.findClosestByPath(what, filter);// opti here
            if (target)
            {
                creep.memory[mem] = target.id;
            }
        }
        return target;
    },
    //-----------------------------------------------------------------------------------------------------

    //Refactored_Zone--------------------------------------------------------------------------------------
    takeIn: function (creep, nextState, hungryState, findType, filter, f)
    {

        if (creep.carry.energy == creep.carryCapacity)
        {
            creep.memory.target = null;
            creep.memory.state = nextState;
            r[creep.memory.role].run(creep); // careful with that.
            return;
        }

        var target = this.findClosestTarget(creep, 'target', findType, filter);

        // target = null si pas de cible. 
        //jlog(target);
        if (target)
        {
            let state = creep[f](target, RESOURCE_ENERGY);
            //this.stateLog(state);
            if (state === ERR_NOT_IN_RANGE)
            {
                creep.moveTo(target);
            }
            else if (state === OK)//happen when container is empty or not
            {
                //console.log(creep.name + " got trouble withdrawing Err: OK")
            }
            else if (state === ERR_FULL)//should happen when resource still left in container
            {
                console.log(creep.name + " got trouble withdrawing Err: ERR_FULL")
                return;
            }
            else if (state === ERR_NOT_ENOUGH_ENERGY)
            {
                creep.say('hungry');
                creep.memory.target = null;
                if (hungryState)
                {
                    creep.memory.state = hungryState;
                    //r[creep.memory.role].run(creep);
                }
            }
            else
            {
                creep.memory.target = null;
                console.log(creep.name + " got trouble withdrawing Err:" + state);
            }
        }


    },

    //Runner--------------------------------------------------------
    feedSpawn: function (creep, nextState, idleState)
    {
        //getTarget
        var target = this.findClosestTarget(creep, 'target', FIND_STRUCTURES, { filter: struct => (struct.structureType == STRUCTURE_SPAWN || struct.structureType == STRUCTURE_EXTENSION) && struct.energy < struct.energyCapacity });

        //target = null si spawn + extension sont pleins
        if (target)
        {
            let state = creep.transfer(target, RESOURCE_ENERGY);
            if (state === ERR_NOT_IN_RANGE)
            {
                creep.moveTo(target);
            }
            else if (state === OK || ERR_NOT_ENOUGH_RESOURCES)
            {
                let tempId = creep.memory.target;
                creep.memory.target = null;
                if (creep.carry.energy - target.energyCapacity + target.energy <= 0)// l'energie n'est pas transf�r� avant la fin du tick. fait un voyage a vide si remplissage du spawn et nrjcap >50
                {
                    creep.memory.state = nextState;
                    return;
                }
                else  // se deplacer ver la nouvelle cible
                {
                    target = this.findClosestTarget(creep, 'target', FIND_STRUCTURES, { filter: struct => (struct.structureType == STRUCTURE_SPAWN || struct.structureType == STRUCTURE_EXTENSION) && struct.energy < struct.energyCapacity && struct.id != tempId });
                    creep.moveTo(target);

                }
            }
            else if (state === ERR_FULL)// happen when multi feeding, just try a new target
            {
                target = this.findClosestTarget(creep, 'target', FIND_STRUCTURES, { filter: struct => (struct.structureType == STRUCTURE_SPAWN || struct.structureType == STRUCTURE_EXTENSION) && struct.energy < struct.energyCapacity && struct.id != tempId });
                creep.moveTo(target);
            }

            else if (state === ERR_INVALID_TARGET)//shouldn't happen 
            {
                console.log(creep.name + " got trouble transfering Err: ERR_INVALID_TARGET")
                jlog(target);
                creep.memory.target = null;
            }
            else
            {
                creep.memory.target = null;
                console.log(creep.name + " got trouble transfering Err:" + state);
            }
        }
        else // spawn + container are full
        {
            creep.memory.target = null;
            creep.memory.state = idleState;
            r[creep.memory.role].run(creep); // careful with that.
            return;
        }


    },

    leeching: function (creep, nextState)
    {
        if (creep.carry.energy == creep.carryCapacity)
        {
            creep.memory.target = null
            creep.memory.state = nextState;
            //r[creep.memory.role].run(creep); // careful with that.
            return;
        }
        var target = this.findClosestTarget(creep, 'target', FIND_MY_CREEPS, { filter: target =>target.memory.role == 'harvester' });
        if (target)
        {
            let state = target.transfer(creep, RESOURCE_ENERGY);
            if (state === ERR_NOT_IN_RANGE)
            {
                creep.moveTo(target);
            }
            else if (state === OK)
            {

            }
            else
            {
                jlog(target.name);
                creep.memory.target = null;
                console.log(creep.name + " got trouble leeching Err:" + state);
                this.stateLog(state);
            }
        }
        else
        {
            creep.say("hungry");
        }
    },
    //-----------------------------------------------------------------------------------------------------

    //Refactor_Zone----------------------------------------------------------------------------------------

    building: function (creep, nextState)
    {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES)
        if (targets.length)
        {
            if (creep.build(targets[0]) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(targets[0]);
            }
        }
        else
        {
            creep.memory.state = nextState; return;
        }
        if (creep.carry.energy < 1)
        {
            creep.memory.state = nextState; return;
        }

    },
    hauling(creep, nextState)
    {
        let target = Game.getObjectById(creep.memory.target);
        if (!target)
        {
            if (creep.carry.energy == creep.carryCapacity)
            {
                target = Game.getObjectById("5834698d0c9a342e4e7ee09a");// container spawn
                if (target.store.energy > 3 * target.storeCapacity / 4)
                {
                    target = Game.getObjectById("5835e1ff490a934541e965b9");// storage
                }
            }
            else
            {
                target = Game.getObjectById("5834cbca742a47d75e99da45");//container sud 
                if (target.store.energy < target.storeCapacity / 10)
                {
                    target = Game.getObjectById("58345e3e086078bb69b3343f");//containerd nord
                }
                if (target.store.energy < target.storeCapacity / 10)
                {
                    target = Game.getObjectById("5835e1ff490a934541e965b9");// storage
                }
            }
        }
        if (target)
        {
            creep.memory.target = target.id;
        }
        var state;
        if (creep.carry.energy == creep.carryCapacity)
        {
            state = creep.transfer(target, RESOURCE_ENERGY);
        }
        else
        {
            state = creep.withdraw(target, RESOURCE_ENERGY);
        }
        if (state === ERR_NOT_IN_RANGE)
        {
            creep.moveTo(target);
        }
        else if (state === OK)
        {
            if (creep.memory.target === "5834cbca742a47d75e99da45" || creep.memory.target === "58345e3e086078bb69b3343f" || creep.memory.target === "5835e1ff490a934541e965b9")
            { creep.memory.state = nextState; }

            creep.memory.target = null;
        }
        else if (state === ERR_FULL)
        {
            creep.memory.target = "5835e1ff490a934541e965b9";
        }
        else
        {
            jlog(target.name);
            creep.memory.target = null;
            console.log(creep.name + " got trouble hauling Err:" + state);
            this.stateLog(state);
        }

    },


    upgrading: function (creep, nextState)
    {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(creep.room.controller);
        }
        if (creep.carry.energy < 1)
        {
            creep.memory.state = nextState;
            return r[creep.memory.role].run(creep);


        }
    },

    feeding(creep, nextState, idleState, filter)
    {
        var target = this.findClosestTarget(creep, 'target', FIND_STRUCTURES, filter);
        if (target)
        {
            let state = creep.transfer(target, RESOURCE_ENERGY);

            if (state === ERR_NOT_IN_RANGE)
            {
                creep.moveTo(target);
            }
            else if (state === ERR_NOT_ENOUGH_ENERGY)
            {
                creep.memory.target = null
                creep.memory.state = nextState;
                r[creep.memory.role].run(creep);
            }
            else
            {

                console.log(creep.name + " got trouble transfering  Err:" + state);
                this.stateLog(state);
                jlog(target);
                creep.memory.target = null;
            }
        }
        else
        {
            creep.memory.target = null;
            creep.memory.state = idleState;
            //r[creep.memory.role].run(creep); // careful with that.
            return;
        }
    },
    //-----------------------------------------------------------------------------------------------------
    harvesting: function (creep, nextState, source)
    {
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[source]) == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(sources[source]);
        }
        if (creep.carry.energy == creep.carryCapacity)
        {

            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: structure => (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store['energy'] < structure.storeCapacity });
            if (target)
            {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target);
                    creep.memory.state = nextState;
                }
            }
        }
    },
    //-----------------------------------------------------------------------------------------------------	
    repair: function (creep, target)
    {
        if (creep.repair(target) == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(target);
        }
    },

    repairing: function (creep, nextState, idleState)
    {



        var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: object => object.hits < (object.hitsMax / 4) && object.hits < 300000 });
        if (targets)
        {
            this.repair(creep, targets);
        }
        else
        {
            targets = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: object => (object.structureType == STRUCTURE_RAMPART || object.structureType == STRUCTURE_CONTAINER || object.structureType == STRUCTURE_STORAGE) && object.hits < (object.hitsMax / 2) });
            if (targets)
            {
                this.repair(creep, targets);
            }
            else
            {
                targets = creep.room.find(FIND_STRUCTURES, { filter: object => object.hits < object.hitsMax });
                targets.sort((a, b) => a.hits - b.hits);
                if (targets)
                {
                    this.repair(creep, targets[0]);
                }
                else
                {
                    creep.memory.state = idleState;

                }
            }
        }
        if (creep.carry.energy < 1)
        {
            creep.memory.state = nextState; return;
        }
    },
    //-----------------------------------------------------------------------------------------------------
    /** @require m.target m.dest**/
    attacking: function (creep)
    {
        let dest = creep.memory.dest;
        if (creep.room.name != dest)
        {
            creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(dest)));
        }
        else
        {
            var target = '';
            //console.log(creep.memory.target);
            if (creep.memory.target !== '')
            {
                target = Game.getObjectById(creep.memory.target);
            }
            else
            {
                target = creep.room.find(FIND_STRUCTURES, { filter: structure => structure.structureType == STRUCTURE_SPAWN })[0];
            }
            if (target != '')
            {
                // creep.say("hello");
                creep.moveTo(target);
                creep.attack(target);
            }
            else
            {
                if (creep.memory.zerk)
                {
                    this.berzerk(creep);
                }
                else
                {
                    let spawns = creep.room.find(FIND_STRUCTURES, { filter: structure => structure.structureType == STRUCTURE_SPAWN });
                    if (spawns.length > 0)
                    {
                        creep.memory.target = '';
                    }
                    else
                    {
                        creep.memory.zerk = true;
                    }
                }
            }
        }
    },
    berzerk: function (creep)
    {
        if (creep.room.name != creep.memory.dest)
        {
            creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(creep.memory.dest)));
        }
        else
        {
            creep.say("Xterminate");
            let enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            creep.moveTo(enemy);
            creep.attack(enemy);
        }
    },
  
    raze: function (creep, struct)
    {
        if (creep.room.name != creep.memory.dest)
        {
            creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(creep.memory.dest)));
        }
        else
        {
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: structure => structure.structureType == struct });
            creep.moveTo(target);
            creep.attack(target);
        }
    },
    //-----------------------------------------------------------------------------------------------------
    claiming: function (creep, dest)
    {
        if (creep.room.name != dest)
        {
            creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(dest)));
        }
        else
        {
            creep.claimController(creep.room.controller);
            creep.moveTo(creep.room.controller)
        }
    }
};

module.exports = action;