//=============================================================================
// Yanfly Engine Plugins - Picture Animations
// YEP_PictureAnimations.js
//=============================================================================

var Imported = Imported || {};
Imported.YEP_PictureAnimations = true;

var Yanfly = Yanfly || {};
Yanfly.PicAni = Yanfly.PicAni || {};

//=============================================================================
 /*:
 * @plugindesc vWIP Play Animations on pictures show on the screen!
 * @author Yanfly Engine Plugins
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * Text
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * Text
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version BETA:
 * - Started Plugin!
 */
//=============================================================================

//=============================================================================
// Game_Screen
//=============================================================================

Game_Screen.prototype.pictureAnimation = function(picId, aniId, mirror, delay) {
  var picture = this.picture(picId);
  if (!picture) return;
  picture._animationId = aniId || 1;
  picture._animationMirror = mirror || false;
  picture._animationDelay = delay || 0;
};

//=============================================================================
// Game_Interpreter
//=============================================================================

Yanfly.PicAni.Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
  Yanfly.PicAni.Game_Interpreter_pluginCommand.call(this, command, args);
  var line = this.fullCommandLine(command, args);
  if (line.match(/(?:PICTURE)[ ](\d+)[ ](?:ANIMATION|ANI)[ ](\d+)/i)) {
    var picId = parseInt(RegExp.$1);
    var aniId = parseInt(RegExp.$2);
    var mirror = (line.match(/MIRROR/i));
    if (line.match(/DELAY:[ ](\d+)/i)) {
      var delay = parseInt(RegExp.$1);
    } else {
      var delay = 0;
    }
    $gameScreen.pictureAnimation(picId, aniId, mirror, delay);
  }
};

Game_Interpreter.prototype.fullCommandLine = function(command, args) {
  args = this.argsToString(args);
  if (args.length > 0) command += ' ' + args;
  return command;
};

Game_Interpreter.prototype.argsToString = function(args) {
  var str = '';
  var length = args.length;
  for (var i = 0; i < length; ++i) {
    str += args[i] + ' ';
  }
  return str.trim();
};

//=============================================================================
// Sprite_Picture
//=============================================================================

Yanfly.PicAni.Sprite_Picture_updateOther = Sprite_Picture.prototype.updateOther;
Sprite_Picture.prototype.updateOther = function() {
  Yanfly.PicAni.Sprite_Picture_updateOther.call(this);
  this.updateAnimation();
};

Sprite_Picture.prototype.updateAnimation = function() {
  this.initAnimations();
  this.setupAnimation();
  this.updateVisibility();
  this.updateAnimationSprites();
};

Sprite_Picture.prototype.initAnimations = function() {
  if (this._isInitializedAnimations) return;
  this._isInitializedAnimations = true;
  this._animationSprites = [];
  this._effectTarget = this;
  this._hiding = false;
};

Sprite_Picture.prototype.setupAnimation = function() {
  var picture = this.picture();
  var aniId = picture._animationId;
  if (!aniId) return;
  var animation = $dataAnimations[aniId];
  var mirror = picture._animationMirror || false;
  var delay = picture._animationDelay || 0;
  this.startAnimation(animation, mirror, delay);
  picture._animationId = 0;
};

Sprite_Picture.prototype.startAnimation = function(animation, mirror, delay) {
  var sprite = new Sprite_Animation();
  sprite.setup(this, animation, mirror, delay);
  this.parent.addChild(sprite);
  this._animationSprites.push(sprite);
};

Sprite_Picture.prototype.updateAnimationSprites = function() {
  if (this._animationSprites.length > 0) {
    var sprites = this._animationSprites.clone();
    this._animationSprites = [];
    for (var i = 0; i < sprites.length; i++) {
      var sprite = sprites[i];
      if (sprite.isPlaying()) {
        this._animationSprites.push(sprite);
      } else {
        sprite.remove();
      }
    }
  }
};

Sprite_Picture.prototype.updateVisibility = function() {
  this.visible = !this._hiding;
};

Sprite_Picture.prototype.hide = function() {
  this._hiding = true;
  this.updateVisibility();
};

Sprite_Picture.prototype.show = function() {
  this._hiding = false;
  this.updateVisibility();
};

//=============================================================================
// End of File
//=============================================================================
