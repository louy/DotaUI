// Generated by TypeScript
/// <reference path="itemslot.ts" />
//No API :(
function econHover(origin) {
    $.DispatchEvent("DOTAShowTextTooltipStyled", $(origin), "Blame Valve", "EconTooltip");
    //$.Msg("Test hover start");
}
function econHoverEnd(origin) {
    $.DispatchEvent("DOTAHideTextTooltip");
    //$.Msg("Test hover end");
}
//Fuck life, these commands only exist client side, and we don't have that.
function statusClicked() {
    //Game.ServerCmd("dota_select_courier");
    GameUI.SelectUnit(currentCourier, false);
}
function boostClicked() {
    Game.ServerCmd("dota_courier_burst");
}
function deliverClicked() {
    Game.ServerCmd("dota_courier_deliver");
}
var ItemDB = {
    587: "default",
    10150: "dire",
    10324: "portal",
    10346: "mana_pool"
};
var currentUnit = Players.GetLocalPlayerPortraitUnit();
var currentCourier = -1;
var courierDeathTime = 0;
function onSteamInventoryChanged(event) {
    var skinName = GameUI.CustomUIConfig().itemdef[event.itemdef];
    $.Msg(skinName);
    if (skinName !== undefined) {
        $("#spacer").SetImage("raw://resource/flash3/images/hud_skins/" + skinName + "/inventory/spacer.png");
        //WTF DO WE DO NOW WITH DIFFERENT RESOLUTIONS!!
        $("#rocks").SetImage("raw://resource/flash3/images/hud_skins/" + skinName + "/inventory/rocks_16_9.png");
        $("#background").SetImage("raw://resource/flash3/images/hud_skins/" + skinName + "/inventory/background_wide.png");
    }
    $.Msg(event);
}
function onUnitChanged(event) {
    onInventoryChanged(event);
    if (Players.GetLocalPlayerPortraitUnit() == currentCourier) {
        $("#courier").AddClass("Selected");
        $.Msg("Selected");
    }
    else {
        $("#courier").RemoveClass("Selected");
        $.Msg("Not Selected");
    }
    if (Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()) != Players.GetLocalPlayerPortraitUnit()) {
        $("#stats").SetHasClass("Hidden", true);
    }
    else {
        $("#stats").SetHasClass("Hidden", false);
    }
    currentUnit = Players.GetQueryUnit(Players.GetLocalPlayer());
}
function onInventoryItemChanged(event) {
    $.Msg(event);
    if (Abilities.GetAbilityName(event.entityIndex) == "item_flying_courier") {
        $.Msg("Flying Courier hype!");
        flyingCourierCheck();
    }
    onInventoryChanged(null);
}
function onInventoryChanged(event) {
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        item.update();
    }
}
function onGoldChanged(event) {
    $("#goldCount").text = Players.GetGold(Players.GetLocalPlayer()).toString(); //TODO: handle selecting allied units.
}
function onShopChanged(event) {
    if (event.shopmask > 0) {
        $("#shop").AddClass("ShopActive");
    }
    else {
        $("#shop").RemoveClass("ShopActive");
    }
    $.Msg(event);
}
//Listen for hacky inventory updates
GameEvents.Subscribe("inventory_updated", onSteamInventoryChanged);
//Listen to inventory updates
//"dota_inventory_changed"
GameEvents.Subscribe("dota_inventory_changed", onInventoryChanged);
GameEvents.Subscribe("dota_inventory_item_changed", onInventoryItemChanged);
GameEvents.Subscribe("dota_player_update_selected_unit", onUnitChanged);
GameEvents.Subscribe("dota_player_update_query_unit", onUnitChanged);
function onEntityKilled(event) {
    $("#lhd-value").SetDialogVariableInt("lasthits", Players.GetLastHits(Players.GetLocalPlayer()));
    $("#lhd-value").SetDialogVariableInt("denies", Players.GetDenies(Players.GetLocalPlayer()));
}
GameEvents.Subscribe("entity_killed", onEntityKilled);
function onHeroDeath(event) {
    $("#kda-value").SetDialogVariableInt("kills", Players.GetKills(Players.GetLocalPlayer()));
    $("#kda-value").SetDialogVariableInt("deaths", Players.GetDeaths(Players.GetLocalPlayer()));
    $("#kda-value").SetDialogVariableInt("assists", Players.GetAssists(Players.GetLocalPlayer()));
}
GameEvents.Subscribe("dota_player_kill", onHeroDeath);
//Listen to gold updates
//"dota_money_changed"
GameEvents.Subscribe("dota_money_changed", onGoldChanged);
function onCourierDeathTimeUpdate() {
    var time = courierDeathTime--;
    $("#deadCourierTimer").text = Math.floor(time / 60) + ":" + ("00" + (time % 60)).slice(-2);
    if (courierDeathTime < 1)
        return;
    $.Schedule(1, onCourierDeathTimeUpdate);
}
function onCourierDeath(event) {
    $.Msg("Courier died!");
    $("#courier").AddClass("Dead");
    if ($("#courier").BHasClass("Flying")) {
        courierDeathTime = 60 * 3; //3 minutes.
    }
    else {
        courierDeathTime = 60 * 2; //2 minutes.
    }
    $.Schedule(1, onCourierDeathTimeUpdate);
    $.Msg("END HYPE2");
}
GameEvents.Subscribe("dota_courier_lost", onCourierDeath);
function onCourierRespawn(event) {
    $.Msg("Courier Spawned!");
    $("#courier").RemoveClass("Dead");
}
GameEvents.Subscribe("dota_courier_respawned", onCourierRespawn);
function onCourierSpawn(event) {
    if (Entities.GetClassname(event.entindex) == "npc_dota_courier") {
        $.Msg("Courier detected!");
        if (Entities.GetTeamNumber(event.entindex) == Players.GetTeam(Players.GetLocalPlayer())) {
            $("#courier").AddClass("Courier");
            currentCourier = event.entindex;
            flyingCourierCheck();
        }
    }
}
GameEvents.Subscribe("npc_spawned", onCourierSpawn);
function flyingCourierCheck() {
    if (currentCourier == -1) {
        $.Msg("ERROR: No Courier before Flying.");
        return;
    }
    if (Entities.HasFlyMovementCapability(currentCourier)) {
        $.Msg("Flying Courier confirmed");
        $("#courier").AddClass("Flying");
        return;
    }
    $.Schedule(0.05, flyingCourierCheck);
}
//Listen to shop changes (shop button glow) (should this be done globally in hud.js applied to ZooHud?)
//"dota_player_shop_changed"
GameEvents.Subscribe("dota_player_shop_changed", onShopChanged);
//Listen to glyph updates
//"dota_glyph_used"
onEntityKilled(null);
onHeroDeath(null);
var items = [];
for (var i = 0; i < 12; i++) {
    //ROW 0 unless otherwise specified
    var parent_1 = $("#row0");
    if (i > 5) {
        //STASH
        continue; //TODO: make
    }
    else if (i > 2) {
        //ROW 1
        parent_1 = $("#row1");
    }
    items[i] = new ItemPanel(parent_1, i);
}
$("#deadCourierTimer").text = "N/A";
