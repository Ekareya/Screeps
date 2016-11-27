var RC =
    {
        creepLog: function(creep)
        {
            console.log("\t(" + _.pad(creep.name, 10) + ")  " + _.pad(creep.memory['role'], 10) + "  " + _.pad(Object.keys(s)[creep.memory.state], 10) + "  " + _.pad(creep.pos.x, 2) + "," + _.pad(creep.pos.y, 2) + "  " + this.padStart(_.sum(creep.carry), 3) + " / " + this.padStart(creep.carryCapacity, 3) + "   " + creep.fatigue + "   " + this.padStart(creep.hits, 4) + " /" + this.padStart(creep.hitsMax, 4) + "  " + this.padStart(creep.ticksToLive, 4) + "t " +creep.memory.target);
        },

        padStart: function (string,n)
        {

            string = (string<10)?" "+string:string + "";

            for (let i = 0; i < n - string.length; i++)
            { string = " " + string; }
            
            return string;
        },

        emitLog: function(roomName)
        {
            let room = Game.rooms[roomName];
            if (!room.controller.owner)
            {
                console.log("Name: " + roomName);
            
            }
            else
            {
                console.log("Name: " + roomName + " " + room.controller.owner.username);

                console.log();
                if (room.controller.owner.username === "Ekareya")
                {

                    console.log("Energy: " + room.energyAvailable + "/" + room.energyCapacityAvailable + " (" + room.find(FIND_MY_STRUCTURES, { filter: struc => struc.structureType === "extension" }).length + " extensions + " + room.find(FIND_MY_STRUCTURES, { filter: struc => struc.structureType === "spawn" }).length + " spawn)");
                    console.log("Storage: " + _.sum(room.storage.store) + " / 1000k");
                    let sources = room.find(FIND_STRUCTURES, { filter: struct => struct.structureType == "container" });
                    console.log("Container:");
                    for (let sourceName in sources)
                    {
                        let source = sources[sourceName];
                        console.log("\t" + sourceName + ") " + _.pad(source.pos.x, 2) + "," + _.pad(source.pos.y, 2) + " " + _.sum(source.store) + "/" + source.storeCapacity);

                    }
                }
                console.log("RC " + room.controller.level + ": " + Math.trunc(room.controller.progress / 1000) + "k / " + room.controller.progressTotal / 1000 + "k " + room.controller.ticksToDowngrade + " ticks ");
                console.log("\tsafeMode: " + room.controller.safeModeAvailable + " " + room.controller.safeMode + " " + room.controller.safeModeCooldown + " " + room.controller.upgradeBlocked);
                console.log("\treservation: " + JSON.stringify(room.controller.reservation));
            }
            
            console.log("Sources:")
            sources = room.find(FIND_SOURCES);
            for (let sourceName in sources)
            {
                let source = sources[sourceName];
                console.log("\t" + sourceName + ") " + _.pad(source.pos.x, 2) + "," + _.pad(source.pos.y, 2) + " " + source.energy + "/" + source.energyCapacity + " regen in " + source.ticksToRegeneration + "s");
            }

            console.log("Dropped Energy:");
            sources = room.find(FIND_DROPPED_ENERGY);
            for (let sourceName in sources)
            {
                let source = sources[sourceName];
                console.log("\t" + sourceName + ") " + _.pad(source.pos.x, 2) + "," + _.pad(source.pos.y, 2) + " " + source.energy);
            }

            if (room.controller.owner)
            {
                console.log("Tower:");
                sources = room.find(FIND_MY_STRUCTURES, { filter: struc => struc.structureType === "tower" });
                for (let sourceName in sources)
                {
                    let source = sources[sourceName];
                    console.log("\t" + sourceName + ") " + _.pad(source.pos.x, 2) + "," + _.pad(source.pos.y, 2) + " " + source.energy + " " + source.hits + "/" + source.hitsMax);
                }
                console.log("Spawn:");
                sources = room.find(FIND_STRUCTURES, { filter: structure => structure.structureType == STRUCTURE_SPAWN });
                for (let sourceName in sources)
                {
                    let source = sources[sourceName];
                    console.log("\t" + sourceName + ") " + _.pad(source.pos.x, 2) + "," + _.pad(source.pos.y, 2) + " " + source.hits + "/" + source.hitsMax + " spawning: " + JSON.stringify(source.spawning));
                }
            }
            console.log("Creeps: (   NAME   )     ROLE       STATE      POS    CAPACITY   F       PV      LIFE");

            sources = room.find(FIND_MY_CREEPS);
            for (let sourceName in sources)
            {
                let source = sources[sourceName];
                this.creepLog(source);
            }
            console.log("Structure:");
            let number = _.countBy(room.find(FIND_STRUCTURES), 'structureType');
            console.log(JSON.stringify(number));



            /*for (let sourceName in sources)
            {
                let source = sources[sourceName];
                console.log("\t" + source.structureType);//JSON.stringify());
            }*/

            //console.log()
            console.log("____________________________________________________________________________________________");
                
            
        }
    }
module.exports = RC;