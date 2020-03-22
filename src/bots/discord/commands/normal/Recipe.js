const {
    Command,
    Universal,
    Discord
} = require("../../../../imports/Imports");

const {
    jRecipes
} = require("../../../../imports/functions/Stores");

module.exports = new Command.Normal()
      .setName("RECIPE")
      .setInfo("Food, booze, ...")
      .addUse("recipe {name}", "get that recipe")
      .addUse("recipe list", "list all recipes")
      .addUse("recipe add {name} {description}", "add a recipe. Name example: My_new_recipe")
      .addUse("recipe remove {name}", "remove the recipe. Can only remove your recipes.")
      .addSubCommand("LIST", list)
      .addSubCommand("ADD", add)
      .addSubCommand("REMOVE", remove)
      .setCommand(recipe);

async function recipe(msg, args) {
    const recipes = await jRecipes.get("recipes") || [];
    if(recipes.length < 1) return msg.reply("There are no recipes");
    const name = await args.join(" ").toUpperCase();
    const recipe = await recipes.find(r => r.name == name);
    if(!recipe) return msg.reply("That recipe doesn't exists!");
    const eRecipe = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle(`**${recipe.name}**`)
        .setDescription(`Author: ${recipe.author_name}`)
        .addField("**RECIPE:**", recipe.description);
    
    return msg.channel.send(eRecipe);
}

async function list(msg) {
    const recipes = await jRecipes.get("recipes") || [];
    if(recipes.length < 1) return msg.reply("There are no stored recipes");
    const recipes_names = await recipes.map(r => r.name);
    const eRecipes = new Discord.RichEmbed()
                   .setColor("RANDOM")
                   .setTitle("**RECIPES**")
                   .setDescription(`**${await recipes_names.join(", ")}**`);

    return msg.channel.send(eRecipes);
}

async function add(msg, args) {
    if(!args || args.length < 2) return msg.reply("Missing arguments");
    let name = await args.shift();
    name = await name.replace(/_/g, ' ').toUpperCase();
    if(name == "LIST" || name == "ADD" || name == "REMOVE") {
        return msg.reply("Recipe can't have that name!");
    }

    const description = await args.join(" ");
    const recipes = await jRecipes.get("recipes") || [];
    if(await recipes.find(r => r.name == name)) return msg.reply("That recipe already exists!");
    await recipes.push({
        name, description,
        author: msg.author.id,
        author_name: msg.author.tag
    });

    await jRecipes.set("recipes", recipes);
    return msg.channel.send(`Recipe **${name}** was added!`);
}

async function remove(msg, args) {
    if(!args || args.length < 1) return msg.reply("Missing arguments");
    const name = await args.join(" ").toUpperCase();
    const recipes = await jRecipes.get("recipes") || [];
    const index = await recipes.findIndex(r => r.name == name);
    if(index == -1) return msg.reply("That recipe doesn't exist");
    let isAdmin = false;
    if(msg.member.hasPermission("ADMINISTRATOR")) isAdmin = true;
    for(const role of global.gConfig.discord.admin_roles) {
        if(msg.member.roles.has(role)) {
            isAdmin = true;
            break;
        }
    }

    const recipe = recipes[index];
    if(recipe.author !== msg.author.id && !isAdmin) {
        return msg.reply("You can't remove this recipe");
    }
    
    await recipes.splice(index, 1);
    await jRecipes.set("recipes", recipes);
    return msg.channel.send(`Recipe **${recipe.name}** was removed!`);
}

