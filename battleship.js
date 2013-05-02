var ViewModel = function(humanName, aiName, humanShips, aiShips) {
    var self = this;

    self.humanName = ko.observable(humanName);
    self.aiName = ko.observable(aiName);

    self.humanShips = ko.observableArray();
    self.aiShips = ko.observableArray();

    self.move = ko.observable("");
    self.moves = ko.observableArray();

    self.lastGames = ko.observableArray();

    self.addMove = function(form) {
        self.moves.push({ player: self.humanName(), move:self.move() });
    }.bind(self);
};

var vm = new ViewModel("","PC",[],[]);
ko.applyBindings(vm);