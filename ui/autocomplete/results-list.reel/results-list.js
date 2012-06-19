/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2012 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Montage = require("montage").Montage,
    Component = require("ui/component").Component;

exports.ResultsList = Montage.create(Component, {

    textPropertyPath: {value: null},

    // contentController -> this.repetition.contentController
    contentController: {value: null},

    activeIndexes: {value: null}
});
