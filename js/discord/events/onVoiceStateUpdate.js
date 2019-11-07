module.exports = function(oldMember, newMember, client) {
    var newVoice = newMember.voiceChannel;
    var oldVoice = oldMember.voiceChannel;
    if(newVoice == oldVoice) return;

    let member;
    let joined;

    // Joined
    if(newVoice != undefined) { 
        member = newMember;
        joined = true;

    // Left
    } else if(oldVoice != undefined) {
        member = oldMember;
        joined = false;
    }

    `[Discord][VC]: ${member.user.tag} ${joined ? "Joined" : "Left"} ${member.voiceChannel.name}`.sendLog();
};