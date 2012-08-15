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
    @module "ui/showroom.reel"
    @requires montage
    @requires montage/ui/component
*/
var Montage = require("montage").Montage,
    Component = require("montage/ui/component").Component;

/**
    Description TODO
    @class module:"ui/showroom.reel".Main
    @extends module:ui/component.Component
*/
exports.Showroom = Montage.create(Component, /** @lends module:"ui/showroom.reel".Showroom# */ {

    configuratorSubstitution: {
        value: null
    },

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

            this._vehicle = value;

            if (this._isComponentExpanded) {
                this._loadVehicleViews();
            }

            this.needsDraw = true;
        }
    },

    _loadVehicleViews: {
        value: function() {
            var self = this;
            require.async(this.vehicle.moduleName + "/configurator.reel")
            .then(function (exports) {
                var configurator = exports.Configurator.create();
                configurator.vehicle = self._vehicle;
                self.configuratorSubstitution.switchComponents[self.vehicle.name] = configurator;
                self.configuratorSubstitution.switchValue = self.vehicle.name;
            })
            .end();
        }
    },

    templateDidLoad: {
        value: function() {
            if (this._vehicle) {
                this._loadVehicleViews();
            }
        }
    },

    prepareForDraw: {
        value: function() {
            this.addEventListener('pick', this, false);
        }
    },

    handlePick: {
        value: function(evt) {
            var configurator = this.configuratorSubstitution.content;
            if (configurator && typeof configurator.pickFromModel === "function") {
                configurator.pickFromModel(evt.detail);
            }
        }
    }


});
