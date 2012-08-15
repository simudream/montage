/* <copyright>
Copyright (c) 2012, Motorola Mobility LLC.
All Rights Reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of Motorola Mobility LLC nor the names of its
  contributors may be used to endorse or promote products derived from this
  software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
</copyright> */
/**
    @module "montage/ui/stage.reel"
    @requires montage
    @requires montage/ui/component
*/
var Montage = require("montage").Montage,
    Component = require("montage/ui/component").Component;
var Utilities = require("c2j/runtime/utilities").Utilities;
var Node = require("c2j/runtime/node").Node;
var Camera = require("c2j/runtime/camera").Camera;
var View = require("c2j/runtime/view").View;
var GLSLProgram = require("c2j/runtime/glsl-program").GLSLProgram;
var RuntimeTFLoader = require("c2j/runtime/runtime-tf-loader").RuntimeTFLoader;
var glMatrix = require("c2j/runtime/dependencies/gl-matrix").glMatrix;

/**
    Description TODO
    @class module:"montage/ui/stage.reel".Stage
    @extends module:montage/ui/component.Component
*/
exports.Stage = Montage.create(Component, /** @lends module:"montage/ui/stage.reel".Stage# */ {

    _vehicle: {
        value: null
    },

    vehicle: {
        get: function() {
            return this._vehicle;
        },
        set: function(value) {
            if (value === this._vehicle) {
                return;
            }

            if (this._vehicle) {
                this._vehicle.modelRepresentation = null;
            }

            this._vehicle = value;

            if (this.templateObjects && this._vehicle) {
                this._vehicle.modelRepresentation = this.collada;
            }
        }
    },

    collada: {
        get: function() {
            return this.templateObjects.collada;
        }
    },

    /**

     @param
         @returns
     */
    templateDidLoad:{
        value:function () {

            if (this.vehicle) {
                this.vehicle.modelRepresentation = this.collada;
            }

            if (this.model) {
                this.run(this.model);
            }
        }
    },

    model: {value: null},

    model: {
        get: function() {
            return this._model;
        },
        set: function(value) {
            if (value === this._model) {
                return;
            }

            this._model = value;

            if (this._isComponentExpanded) {
                this.run(this.model);
            }
        }
    },

    location: {value: null},

    _fillViewport: {
        value: true
    },

    fillViewport: {
        get: function() {
            return this._fillViewport;
        },
        set: function(value) {
            if (value === this._fillViewport) {
                return;
            }

            this._fillViewport = value;

            if (this._isComponentExpanded) {
                if (this._fillViewport) {
                    window.addEventListener("resize", this, true);
                } else {
                    window.removeEventListener("resize", this, true);
                }
            }
        }
    },

    height: {value: null},
    width: {value: null},

    prepareForDraw: {
        value: function() {
            if (this.fillViewport) {
                window.addEventListener("resize", this, true);
            }
        }
    },

    captureResize: {
        value: function(evt) {
            this.needsDraw = true;
        }
    },

    willDraw: {
        value: function() {
            this.collada.width = this.width = window.innerWidth - 270;
            this.collada.height = this.height = window.innerHeight;
        }
    },

    run: {
        value: function(scenePath) {

            var readerDelegate = {};
            readerDelegate.loadCompleted = function (scene) {
                this.collada.scene = scene;
                this.collada.needsDraw = true;
            }.bind(this);
            var self = this;
            var angle = 0;
            var viewDelegate = {};
            viewDelegate.willDraw = function(view) {
            };

            viewDelegate.didDraw = function(view) {
            };

            this.collada.delegate = viewDelegate;

            var loader = Object.create(RuntimeTFLoader);
            loader.initWithPath(scenePath);
            loader.delegate = readerDelegate;
            loader.load(null /* userInfo */, null /* options */);
            this.collada.needsDraw = true;
        }
    }

});
