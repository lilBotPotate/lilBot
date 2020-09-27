exports.updateMemberCount = () => {
    console.log("updateMemberCount");
    
    const baseName = "All Members:"
    if(!global.gConfig.discord.server_id || global.gConfig.discord.stats_category) return;
    const guild = this.guilds.find(g => g.id == global.gConfig.discord.server_id);
    if(!guild) return console.log("No guild");
    const statsCategory = guild.channels.find(c => c.id == global.gConfig.discord.stats_category);
    if(!statsChannel) return console.log("no category");
    const countChannel = statsCategory.children.find(c => c.name.startsWith(baseName));
    
    if(countChannel) {
        console.log("Renaming channel");
        return countChannel.setName(`${baseName} ${guild.members.size}`);
    }
    console.log("Creating channel");
    guild.createChannel(`${baseName} ${guild.members.size}`, "voice")
         .setParent(global.gConfig.discord.stats_category);
}