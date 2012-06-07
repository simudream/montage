var Montage = require("montage").Montage,
    Component = require("montage/ui/component").Component;

var Todo = exports.Todo = Montage.create(Component, {
    hasTemplate: {
        value: false
    },

    todos: {
        value: [],
        distinct: true
    },

    remaining: {
        get: function() {
            return this.todos.filter(function(data) { return !data.done; }).length;
        }
    },

    templateDidLoad: {
        value: function() {
            var self = this;

            this.newTodo = document.getElementById("new-todo");

            this.newTodo.addEventListener("keypress", function(event) {
                if (event.keyCode == 13 && this.value) {
                    self.todos.push({text: this.value, done: false});
                    this.dispatchPropertyChange("remaining", function() {});
                    self.clearInput = true;
                    self.needsDraw = true;
                }
            });

            this.todos.addPropertyChangeListener("done", function() {
                self.needsDraw = true;
            });

            this.needsDraw = true;
        }
    },

    draw: {
        value: function() {
            if (this.clearInput) {
                this.clearInput = false;
                this.newTodo.value = "";
            }
        }
    },

    handleDoneAction: {
        value: function(e) {
            e._target.parentComponent.needsDraw = true;
        }
    },

    handleArchiveAction: {
        value: function() {
            this.todos = this.todos.filter(function(todo) { return !todo.done; });
            this.dispatchPropertyChange("remaining", function() {});
            this.needsDraw = true;
        }
    }
});

var TodoItem = exports.TodoItem = Montage.create(Component, {
    hasTemplate: {
        value: false
    },

    draw: {
        value: function() {
            var data = this.data;

            if (data) {
                if (data.done) {
                    this.element.classList.add("is-done");
                    //this.doneCheck.checked = true;
                } else {
                    this.element.classList.remove("is-done");
                    //this.doneCheck.checked = false;
                }
            }
        }
    },

    _data: {
        value: null
    },

    data: {
        get: function() {
            return this._data;
        },
        set: function(value) {
            this._data = value;
            this.needsDraw = true;
        }
    }
});