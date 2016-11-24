var action=
{
//-----------------------------------------------------------------------------------------------------
    harvesting: function(creep,nextState,source)
    {
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[source]) == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(sources[source]);
        }
        if(creep.carry.energy == creep.carryCapacity)
        {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES,{filter: structure => structure.structureType == STRUCTURE_CONTAINER && structure.store['energy'] < structure.storeCapacity});
            //console.log(JSON.stringify(target));
            if(target) 
            {
                if(creep.transfer(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(target);
                    creep.memory.state=nextState;
                }
            }
        }
    },
    mining: function(creep,nextState,source)
	{
	    var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[source]) == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(sources[source]);
        }
        else
        {
            this.eating(creep,nextState,1);
        }
        if(creep.carry.energy == creep.carryCapacity)
        {
            creep.memory.state = nextState;       return;
        }
	},
//-----------------------------------------------------------------------------------------------------	
	building: function(creep,nextState,idleState)
	{
	    var targets = creep.room.find(FIND_CONSTRUCTION_SITES)
	   	if(targets.length) 
	   	{
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(targets[0]);
                }
        }
        else
        {
            creep.memory.state = idleState; return;
        }
	   	if(creep.carry.energy < 1 )
	   	{
	   	    creep.memory.state = nextState; return;
	   	}
	    
	},
//-----------------------------------------------------------------------------------------------------	
    repair: function(creep,target)
    {
       if(creep.repair(target) == ERR_NOT_IN_RANGE) 
        {
            creep.moveTo(target);
        }
    },

    repairing: function(creep,nextState,idleState)
	{
	    
	    
	    
	    var targets = creep.pos.findClosestByPath(FIND_STRUCTURES,{filter: object => object.hits < (object.hitsMax/4) && object.hits <50000});
        if(targets) 
        {
            this.repair(creep,targets);
        }
        else
        {
            targets = creep.pos.findClosestByRange(FIND_STRUCTURES,{filter : object => (object.structureType == STRUCTURE_RAMPART || object.structureType == STRUCTURE_CONTAINER || object.structureType == STRUCTURE_STORAGE) && object.hits < (object.hitsMax/2)});
            if(targets) 
            {
                this.repair(creep,targets);
            }
            else
            {
                targets = creep.room.find(FIND_STRUCTURES,{filter: object => object.hits < object.hitsMax});
                targets.sort((a,b) => a.hits - b.hits);
                if(targets)
                {   
                    this.repair(creep,targets[0]);
                }
                else
                {
                    creep.memory.state = idleState;
                    
                }
            }
        }
	   	if(creep.carry.energy < 1 )
	   	{
	   	    creep.memory.state = nextState; return;
	   	}
	},
//-----------------------------------------------------------------------------------------------------
	upgrading: function(creep,nextState)
	{
	    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) 
	    {
                creep.moveTo(creep.room.controller);
	    }
	   	if(creep.carry.energy < 1 )
	   	{
	   	    creep.memory.state = nextState;return;
	   	}
	},
//-----------------------------------------------------------------------------------------------------
    emptying: function(creep,nextState,idleState)
	{
	    var target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter : structure => ( structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity});

        if(target) 
        {
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(target);
            }
        }
        else
        {
            creep.memory.state = idleState; return;
        }
        
        if(creep.carry.energy < 1 )
	   	{
	   	    creep.memory.state = nextState; return;
	   	}
	},
//-----------------------------------------------------------------------------------------------------
	attacking: function(creep,dest)
	{
	    if(creep.room.name != dest)
	    {
	        creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(dest)));
	    }
	    else
	    {
	        var target = creep.room.find(FIND_STRUCTURES, {filter : structure => structure.structureType == STRUCTURE_SPAWN});
	        if(target!='')
	        {
	           // creep.say("hello");
    	        creep.moveTo(target[0]);
    	       console.log(creep.attack(target[0]));
	        }
	        else
	        {   creep.say("Xterminate");
	            var enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
	            creep.moveTo(enemy);
	            creep.attack(enemy);
	        }
	    }
	    //creep.say('blip');
	    /*
	    var target= 
	    console.log(target);
	    if(creep.attack(target) == ERR_NOT_IN_RANGE)
	    {
	        creep.moveTo(target);
	    }*/
	},
//-----------------------------------------------------------------------------------------------------
	claiming: function(creep,dest)
	{
	    if(creep.room.name != dest)
	    {
	        creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(dest)));
	    }
	},
//-----------------------------------------------------------------------------------------------------
    feeding: function(creep,nextState,idleState)
    {
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES,{filter: structure => structure.structureType == STRUCTURE_CONTAINER && structure.store['energy'] < structure.storeCapacity});
        //console.log(JSON.stringify(target));
        if(target) 
        {
            if(creep.transfer(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(target);
            }
        }
        else
        {
            creep.memory.state = idleState; return;
        }
        
        if(creep.carry.energy < 1 )
	   	{
	   	    creep.memory.state = nextState; return;
	   	}
    },
//-----------------------------------------------------------------------------------------------------
    eating: function(creep,nextState,hungerState)
    {
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES,{filter: structure => structure.structureType == STRUCTURE_CONTAINER });
        //console.log(JSON.stringify(target));
        if(target) 
        {
            if(creep.withdraw(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(target);
            }
            else
            {  
                creep.say('hungry');
                creep.memory.state=hungerState;
            }
        }
        else
        { 
           /* var target = creep.room.find(FIND_STRUCTURES,{filter: structure => structure.structureType == STRUCTURE_CONTAINER && structure.store['energy'] > 200 });
            if(creep.withdraw(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(target);
            }
            else
            {*/
                creep.say('hungry');
                creep.memory.state=hungerState;
            //}
        }
        if(creep.carry.energy == creep.carryCapacity)
        {
            creep.memory.state = nextState; return;
        }
    },
//-----------------------------------------------------------------------------------------------------
    leeching: function(creep,nextState)
    {
        var cow = creep.pos.findClosestByRange(FIND_MY_CREEPS,{filter:target =>target.memory.role=='harvester' });
        if(cow)
        {
            if(cow.transfer(creep,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) // withdraw????
            {
                creep.moveTo(cow);
            }
        }
        else
        {
            creep.say("hungry");
        }
        if(creep.carry.energy == creep.carryCapacity)
        {
            creep.memory.state = nextState; return;
        }
    },
//-----------------------------------------------------------------------------------------------------
    sniffing: function(creep,nextState)
    {
        var cow = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if(cow)
        {
            if(creep.pickup(cow) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(cow);
            }
        }
        creep.memory.state = nextState;
    },
    
    running: function(creep,nextState)
    {
        var targetOut = creep.pos.findClosestByPath(FIND_STRUCTURES,{filter: structure => structure.structureType == STRUCTURE_CONTAINER && structure.store['energy'] > (3*structure.storeCapacity/4)});
        var targetIn = creep.room.find(FIND_STRUCTURES,{filter: structure => structure.structureType == STRUCTURE_CONTAINER && structure.store['energy'] < structure.storeCapacity/4})
        //console.log(JSON.stringify(targetOut));
        //console.log(JSON.stringify(targetIn));
        if(targetOut && targetIn.length > 0)
        {
            if(creep.carry.energy< creep.carryCapacity)
            {
                if(creep.withdraw(targetOut,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(targetOut);
                }   
            }
            else
            {
            //console.log(creep.transfer(targetIn[0],RESOURCE_ENERGY));
            var truc= creep.transfer(targetIn[0],RESOURCE_ENERGY);
                if( truc == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(targetIn[0]);
                }
                else if (truc == ERR_NOT_ENOUGH_RESOURCES)
                {
                    creep.memory.state = nextState;
                }
            }
        }
        else
        {
            creep.memory.state= nextState;
        }
    },
    
    running2: function(creep,nextState)
    {
        if(creep.carry.energy< creep.carryCapacity)
        {
            if(creep.withdraw(Game.getObjectById('58345e3e086078bb69b3343f'),RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(Game.getObjectById('58345e3e086078bb69b3343f'));
            }   
        }
        
        else
        {
        //console.log(creep.transfer(targetIn[0],RESOURCE_ENERGY));
        var truc= creep.transfer(Game.getObjectById('5834698d0c9a342e4e7ee09a'),RESOURCE_ENERGY);
            if( truc == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(Game.getObjectById('5834698d0c9a342e4e7ee09a'));
            }
            else
            {
                creep.memory.state = nextState;
            }
        }
    }
};

module.exports = action;