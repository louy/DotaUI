var ItemState;
(function (ItemState) {
    ItemState[ItemState["Default"] = 0] = "Default";
    ItemState[ItemState["Active"] = 1] = "Active";
    ItemState[ItemState["AbilityPhase"] = 2] = "AbilityPhase";
    ItemState[ItemState["Cooldown"] = 3] = "Cooldown";
    ItemState[ItemState["Muted"] = 4] = "Muted";
})(ItemState || (ItemState = {}));
var ItemPanel = (function () {
    function ItemPanel(parent, slot) {
        this.slot = slot;
        this.panel = $.CreatePanel("Panel", parent, "");
        this.panel.BLoadLayoutSnippet("itemSlot");
        this.update();
    }
    ItemPanel.prototype.test = function () {
        this.panel.FindChildTraverse("bg").itemname = this.testing ? "" : this.itemName;
        $.Msg("Updating");
        this.testing = !this.testing;
        $.Schedule(10, this.test.bind(this));
    };
    ItemPanel.prototype.update = function () {
        this.unit = Players.GetQueryUnit(Players.GetLocalPlayer());
        if (this.unit === -1) {
            this.unit = Players.GetLocalPlayerPortraitUnit();
        }
        this.item = Entities.GetItemInSlot(this.unit, this.slot);
        this.itemName = Abilities.GetAbilityName(this.item);
        var itemImage = this.panel.FindChildTraverse("bg");
        itemImage.SetImage("s2r://panorama/images/items/" + ((this.item == -1) ? "emptyitembg" : Items.GetAbilityTextureSF(this.item)) + ".png");
    };
    return ItemPanel;
}());
