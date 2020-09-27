module.exports = function(oldMember, newMember) {
    const nickname = (newMember.nickname || "").toLowerCase();
    try {
        switch (nickname) {
            case "lilpotate": return newMember.setNickname("Imposter");
            default: return;
        }
    } catch (error) {}
};