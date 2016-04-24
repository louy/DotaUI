(function() {
    var units = {};
    var currentUnit = -1;
    var abilities = {};

    /* Set actionpanel for a specified unit. */
    function SetActionPanel(unit) {
        var abilityContainer = $("#AbilitiesContainer");

        // Get rid of the old abilities first.
        for (var ab in abilities) {
            abilities[ab].style.visibility = "collapse";
        }

        // Remove old ability layout
        abilityContainer.RemoveClass("AbilityLayout" + countAbilityLayout(currentUnit));

        //Set the new current unit
        currentUnit = unit;
        
        // Retrieve panels we made previously to avoid deletion or excessive panels.
        if (units[unit] !== undefined) {
            abilities = units[unit];
        }
        else {
            units[unit] = {};
            abilities = units[unit];
        }

        updateVisibleAbilities();

        abilityContainer.AddClass("AbilityLayout" + countAbilityLayout(unit));
    }

    /* Selection changed to a unit the player controls. */
    function onUpdateSelectedUnit(event) {
        var unit = Players.GetLocalPlayerPortraitUnit();
        SetActionPanel(unit);
    }

    /* Selection changed to a unit the player does not control. */
    function onUpdateQueryUnit(event) {
        var unit = Players.GetQueryUnit(Players.GetLocalPlayer());
        
        // Filter out invalid units (happens when switching back to the hero from a query unit.)
        // This also fires an update_selected_unit event so should be handled fine.
        if (unit != -1) {
            SetActionPanel(unit);
        }
    }

    function onStatsChanged(event) {
        //Ability points changed

        //Update stats?
        $.Msg(event);
    }

    function onAbilityChanged(event) {
        updateVisibleAbilities();
    }

    function updateVisibleAbilities() {
        var abilityContainer = $("#AbilitiesContainer");

        //Hide all abilities
        for (var ab in abilities) {
            abilities[ab].style.visibility = "collapse";
        }

        //Show only the visible abilities
        var slot = 0;
        var abilityCount = Entities.GetAbilityCount(currentUnit) - 1;
        while (slot < abilityCount) {
            // Get ability.
            var ability = Entities.GetAbility(currentUnit, slot);

            // Stop once an invalid ability is found (or just continue and ignore?)
            if (ability === -1) {
                break;
            }

            if (!Abilities.IsAttributeBonus(ability) && !Abilities.IsHidden(ability)) {
                if (ability[ability] !== undefined) {
                    abilities[ability].style.visibility = "visible";
                    
                    //Reinit the ability to check for changes
                    abilities[ability].reinit();
                } 
                else {
                    // Create new panel and load the layout.
                    var abilityPanel = $.CreatePanel( "Panel", abilityContainer, "" );
                    abilityPanel.LoadLayoutAsync( "file://{resources}/layout/custom_game/actionbar_ability.xml", false, false );
                    
                    // Initialise the ability panel.
                    abilityPanel.init(ability, currentUnit);

                    // Keep ability for later
                    abilities[ability] = abilityPanel;
                }
            }

            slot++;
        }
    }

    function countAbilityLayout(unit) {
        var count = 0;
        for (var slot = 0; slot < Entities.GetAbilityCount(currentUnit); slot++) {
            var ability = Entities.GetAbility(unit, slot);

            if (ability == -1) {
                break;
            }

             if (!Abilities.IsAttributeBonus(ability) && !Abilities.IsHidden(ability)) {
                count++;
             }
        }
        return count;
    }

    /* Update loop */
    function onUpdate() {
        // Update all abilities.
        for (var ab in abilities) {
            abilities[ab].update();
        }

        $.Schedule(0.005, onUpdate);
    }

    // Bind query unit update event
    GameEvents.Subscribe("dota_player_update_selected_unit", onUpdateSelectedUnit);
    GameEvents.Subscribe("dota_player_update_query_unit", onUpdateQueryUnit);

    GameEvents.Subscribe("dota_portrait_unit_stats_changed", onStatsChanged);
    GameEvents.Subscribe("dota_ability_changed", onAbilityChanged);

    //Set default unit
    var unit = Players.GetQueryUnit(Players.GetLocalPlayer());
    if (unit === -1 ) {
        unit = Players.GetLocalPlayerPortraitUnit();
    }
    SetActionPanel(unit);

    //Listen to dota_action_success to determine cast state
    onUpdate();

    //Listen for level up event - dota_ability_changed

    //Listen for casts (cooldown starts)
})();