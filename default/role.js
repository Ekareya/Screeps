var s = require('state');
var a = require('action');

var role =
{
    Builder :
    {
    
        /** @param {Creep} creep **/
        run: function(creep) 
        {
            //console.log(creep.name+":"+s.toString[creep.memory.state] + " " + creep.memory.state);
            switch(creep.memory.state)
            {
                case s.Eating: 
                        a.eating(creep,s.Building,s.Mining); break;
                case s.Mining:
                        a.mining(creep,s.Building,0); break;
                case s.Building:
                        a.building(creep,s.Eating,s.Repairing);break;
                case s.Repairing:
                        a.repairing(creep,s.Eating,s.Upgrading);break;
                case s.Upgrading:
                        a.upgrading(creep,s.Eating);break;
                default:
                        creep.memory.state = 1;creep.say('bug');a.mining(creep,s.Building,0);break;
            }
    	}
    },
    
    
    
    Harvester : 
    {
        run: function(creep)
        {
            switch(creep.memory.state)
            {
                case s.Mining:
                        a.harvesting(creep,s.Emptying,creep.memory.source); break;
                case s.Emptying:
                        a.feeding(creep,s.Mining,s.Upgrading); break;
                case s.Upgrading:
                        a.upgrading(creep,s.Mining);break;
                default:
                        creep.memory.state = 1;creep.say('bug');a.mining(creep,s.Emptying,0);break;
            }
        }
    },
    
    Upgrader :
    {
        run: function(creep) 
        {
            switch(creep.memory.state)
            {
                case s.Mining: 
                        a.eating(creep,s.Upgrading,s.Mining); break;
                case s.Upgrading:
                        a.upgrading(creep,s.Mining);break;
                default:
                        creep.memory.state = 1;creep.say('bug');a.mining(creep,s.Upgrading,0);break;
            }
    	}
    },
    
    Attacker :
    {
        run: function(creep)
        {
            a.attacking(creep,'E67S13');
        }
    },
    
    Claimer :
    {
        run : function(creep)
        {
            a.claiming(creep,'E69S14');
        }
    },
    
    Repairer:
    {
        run : function(creep)
        {
            switch(creep.memory.state)
            {
               case s.Eating: 
                        a.eating(creep,s.Building,s.Mining); break;
                case s.Mining:
                        a.mining(creep,s.Building,0); break;
                case s.Repairing:
                        a.repairing(creep,s.Eating,s.Upgrading);break;
                case s.Upgrading:
                        a.upgrading(creep,s.Eating);break;
                default:
                        creep.memory.state = 1;creep.say('bug');a.mining(creep,s.Repairing,0);break;
            }
        }
    },
    Runner:
    {
        run : function(creep)
        {
            //console.log(creep.name+":"+s.toString[creep.memory.state] + " " + creep.memory.state);
            switch(creep.memory.state)
            {
                case s.Running:
                        a.leeching(creep,s.Emptying); break;
                case s.Emptying:
                        a.emptying(creep,s.Running,s.Eating); break;
                case s.Eating:
                        a.running2(creep,s.Emptying);break;
                case s.Sniffing:
                        a.sniffing(creep,s.Running);break;
                default:
                        creep.memory.state = 1;creep.say('bug');a.mining(creep,s.Emptying,0);break;
            }
        }
    },
    Runner2:
    {
        run : function(creep)
        {
            a.running2(creep,s.Emptying);
        }
    }
}
module.exports = role;








































