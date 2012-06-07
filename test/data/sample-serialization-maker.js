// this is a script that is intended to be run as a stand alone program to
// generate sample-seriazation.json from sample.json

var binder = require("./object/binderhelper").companyBinder();
var serialize = require("montage/core/serializer").serialize;
var Person = require("data/object/person").Person;
var Company = require("data/object/company").Company;
var Project = require("data/object/project").Project;

exports.load = function () {
    return require.async("./sample.json")
    .then(function (sample) {
        // build all objects

        var peopleById = {};
        sample.people.forEach(function (properties) {
            var person = Person.create();
            person.name = properties.name;
            person.phoneNumbers = properties.phoneNumbers;
            peopleById[properties.id] = person;
        });

        var companiesById = {};
        sample.companies.forEach(function (properties) {
            var company = Company.create();
            company.name = properties.name;
            companiesById[properties.id] = company;
        });

        var projectsById = {};
        sample.projects.forEach(function (properties) {
            var project = Project.create();
            project.name = properties.name;
            project.startDate = null;
            project.endDate = null;
            projectsById[properties.id] = project;
        });

        // build associations

        sample.people.forEach(function (properties) {
            // supervisor to direct reports association
            if (properties.supervisor !== void 0) {
                var employee = peopleById[properties.id];
                var supervisor = peopleById[properties.supervisor];
                employee.supervisor = supervisor;
                //supervisor.directReports.add(employee) should be implied
            }
            // employee to company association
            if (properties.company !== void 0) {
                var employee = peopleById[properties.id];
                var company = companiesById[properties.company];
                employee.company = company;
                //company.employees.add(employee) should be implied
            }
            // contributor to project association
            if (properties.projects !== void 0) {
                properties.projects.forEach(function (projectId) {
                    var project = projectsById[projectId];
                    var contributor = peopleById[properties.id];
                    //project.contributors.push(contributor)
                    //contributor.projects.push(project);
                    //project.contributors.add(contributor)
                    //contributor.projects.add(project) should be implied
                });
            }
        });
        sample.projects.forEach(function (properties) {
            // projects to company association
            if (properties.company !== void 0) {
                var project = projectsById[properties.id];
                var company = companiesById[properties.company];
                project.company = company;
                //company.projects.add(project) should be implied
            }
        });

        // collect all objects

        return concat([
            peopleById,
            companiesById,
            projectsById
        ].map(values));

    })
};

function values(object) {
    return Object.keys(object).map(function (key) {
        return object[key];
    });
}

function concat(arrays) {
    return Array.prototype.concat.apply([], arrays);
}

// display serialization
var objects = exports.load()
.then(function (objects) {
    var serialization = JSON.stringify(
        JSON.parse(
            serialize(objects, require)
        ),
        null,
        4
    );
    console.log(serialization.slice(0, 1000));
    var dataUrl = window.location = 'data:text/plain;base64,'+btoa(serialization);
})
.end();

