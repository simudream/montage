var Montage = require("montage").Montage,
    Component = require("montage/ui/component").Component;

var Todo = exports.Todo = Montage.create(Component, {
    hasTemplate: {
        value: false
    },

    todos: {
        value: null
    },

    todoList: {
        value: null,
        serializable: true
    },

    todoCount: {
        value: 0,
        serializable: true
    },

    todoCountDone: {
        value: 0,
        serializable: true
    },

    templateDidLoad: {
        value: function() {
            var self = this,
                todos;

            this.todos = [];
            this.newTodo = document.getElementById("new-todo");

            this.newTodo.addEventListener("keypress", function(event) {
                if (event.keyCode == 13 && this.value) {
                    self.todos.push({text: this.value, done: false});
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
            var todos = this.todos,
                length = todos.length;

            this.todoCount = todos.filter(function(data) { return !data.done; }).length;

            if (this.clearInput) {
                this.clearInput = false;
                this.newTodo.value = "";
            }
        }
    },

    removeItem: {
        value: function(data) {
            var ix = this.todos.indexOf(data);
            this.todos.splice(ix, 1);
        }
    },

    handleClearAction: {
        value: function() {
            this.todos = this.todos.filter(function(todo) { return !todo.done; });
            this.needsDraw = true;
        }
    }
});

var TodoItem = exports.TodoItem = Montage.create(Component, {
    hasTemplate: {
        value: false
    },

    prepareForDraw: {
        value: function() {
            var self = this,
                element = this.element,
                checkbox = element.querySelector("input[type='checkbox']");

            this.checkbox = checkbox;
            this.text = element.querySelector(".todo-text");

            checkbox.addEventListener("change", function() {
                self.data.done = this.checked;
                self.needsDraw = true;
            });
        }
    },

    draw: {
        value: function() {
            var data = this.data;

            if (data) {
                this.text.textContent = data.text;
                if (data.done) {
                    this.element.classList.add("is-done");
                    this.checkbox.checked = true;
                } else {
                    this.element.classList.remove("is-done");
                    this.checkbox.checked = false;
                }
            }
        }
    },

    data: {
        get: function() { return this._data; },
        set: function(value) {
            this._data = value;
            this.needsDraw = true;
        }
    }
});