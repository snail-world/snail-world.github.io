//=============================================================================
// Yanfly Engine Plugins - FPS Synch Option
// YEP_FpsSynchOption.js
//=============================================================================

var Imported = Imported || {};
Imported.YEP_SynchFpsOption = true;

var Yanfly = Yanfly || {};
Yanfly.FpsSynch = Yanfly.FpsSynch || {};
Yanfly.FpsSynch.version = 1.02;

//=============================================================================
 /*:
 * @plugindesc v1.02 Adds a new command to Options menu for synching
 * the FPS of moniters with higher FPS rates.
 * @author Yanfly Engine Plugins
 *
 * @param Command Name
 * @desc Command name used inside of the Options menu.
 * @default Synch Monitor FPS
 *
 * @param Default Setting
 * @type boolean
 * @on ON
 * @off OFF
 * @desc The default setting of the Synch Monitor FPS.
 * OFF - false (Recommended)  ON - true
 * @default false
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin is to be used with RPG Maker MV version 1.1.0 and upward.
 *
 * RPG Maker MV is constructed in a way where each update to its engine is done
 * once per frame update. While this is normally fine, as many players view the
 * game through 60 fps, some players experience the game differently as their
 * hardware may run at higher than 60 fps.
 *
 * When RPG Maker MV version 1.1.0 is implemented, it implemented Galenmereth's
 * fluid timestep, which forces the game to always play as if it is 60 fps. In
 * practice, this is great for everybody because players that experience more
 * 60 fps will be able to play the game as if it was 60 fps.
 *
 * However, there comes a problem when a player's hardware isn't strong enough
 * to support RPG Maker MV natively at 60 fps (such as the case with older
 * computers, or weaker mobile devices) or if the player is using video 
 * recording software that goes below 60 fps. The game will appear laggy and
 * jumping without good response rates from input commands or possibly even
 * make the player miss out on certain visual frame updates.
 *
 * This plugin places a setting in the Options menu to enable or disable the
 * fluid timestep addition and utilize the former RPG Maker MV engine updating
 * function. This way, players will have the option of using fluid timesteps or
 * opting to not use it instead of forcing it on everybody who may not be able
 * to handle it.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.02:
 * - Updated for RPG Maker MV version 1.5.0.
 *
 * Version 1.01:
 * - The plugin is now prevented if the project's core files are under version
 * RPG Maker MV 1.1.0.
 *
 * Version 1.00:
 * - Finished Plugin!
 */
//=============================================================================

if (Utils.RPGMAKER_VERSION && Utils.RPGMAKER_VERSION >= '1.1.0') {

//=============================================================================
// Parameter Variables
//=============================================================================

Yanfly.Parameters = PluginManager.parameters('YEP_FpsSynchOption');
Yanfly.Param = Yanfly.Param || {};

Yanfly.Param.FpsSynchCmd = String(Yanfly.Parameters['Command Name']);
Yanfly.Param.FpsSDefault = eval(String(Yanfly.Parameters['Default Setting']));

//=============================================================================
// MainCode
//=============================================================================

ConfigManager.synchFps = Yanfly.Param.FpsSDefault;

Yanfly.FpsSynch.ConfigManager_makeData = ConfigManager.makeData;
ConfigManager.makeData = function() {
    var config = Yanfly.FpsSynch.ConfigManager_makeData.call(this);
    config.synchFps = this.synchFps;
    return config;
};

Yanfly.FpsSynch.ConfigManager_applyData = ConfigManager.applyData;
ConfigManager.applyData = function(config) {
    Yanfly.FpsSynch.ConfigManager_applyData.call(this, config);
    this.synchFps = this.readConfigFpsSynch(config, 'synchFps');
};

ConfigManager.readConfigFpsSynch = function(config, name) {
    var value = config[name];
    if (value !== undefined) {
        return value;
    } else {
        return Yanfly.Param.FpsSDefault;
    }
};

//=============================================================================
// SceneManager
//=============================================================================

SceneManager.updateMainFluidTimestep = SceneManager.updateMain;

SceneManager.updateMain = function() {
    if (ConfigManager.synchFps) {
      this.updateMainFluidTimestep();
    } else {
      this.updateMainNoFpsSynch();
    }
};

SceneManager.updateMainNoFpsSynch = function() {
    this.updateInputData();
    this.changeScene();
    this.updateScene();
    this.renderScene();
    this.requestUpdate();
};

//=============================================================================
// Window_Options
//=============================================================================

Yanfly.FpsSynch.Window_Options_addGeneralOptions =
    Window_Options.prototype.addGeneralOptions;
Window_Options.prototype.addGeneralOptions = function() {
    Yanfly.FpsSynch.Window_Options_addGeneralOptions.call(this);
    this.addCommand(Yanfly.Param.FpsSynchCmd, 'synchFps');
};

//=============================================================================
// Version Compatibility Update
//=============================================================================
} else {

var text = '';
text += 'You are getting this error because you are trying to run FPS Synch ';
text += 'Options while your project files are lower than version 1.1.0. \n\n';
text += 'Please visit this thread for instructions on how to update your ';
text += 'project files to 1.1.0 or higher: \n\n';
text += 'http://forums.rpgmakerweb.com/index.php?/topic/';
text += '71400-rpg-maker-mv-v134-update/';
console.log(text);
require('nw.gui').Window.get().showDevTools();

} // (Utils.RPGMAKER_VERSION && Utils.RPGMAKER_VERSION >= '1.1.0')

//=============================================================================
// End of File
//=============================================================================
