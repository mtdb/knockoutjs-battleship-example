var Point = function (x,y,color) {
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', 5);
    circle.setAttribute('fill', color);
    return circle;
}

var Square = function (x,y,color) {
    var square = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    square.setAttribute('x1', x);
    square.setAttribute('x2', x+20);
    square.setAttribute('y1', y);
    square.setAttribute('y2', y);
    square.setAttribute('style', 'stroke: '+color+'; stroke-width: 20;');
    return square;
}

function string2coords(s) {
    if (s.match(/^[A-J][0-9]$/))
        return {'y':s[0].charCodeAt()-64, 'x':parseInt(s[1])};
    else if (s.match(/^[A-J](10)$/))
        return {'y':s[0].charCodeAt()-64, 'x':10};
    return false;
}

function aiMove(vm) {
    var form = document.createElement('form');
    form.elements['player'] = vm.aiName();
    coordA = String.fromCharCode(Math.floor(Math.random()*10)+65);
    coordB = Math.floor(Math.random()*10)+1;
    vm.move(coordA+coordB);
    vm.addMove(form);
}

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
        var target = form.elements["player"].value==self.humanName()?"ai":"human";
        var validMove = string2coords(self.move());
        if (validMove) {
            var color = 'black';
            if (target == "ai") {
                if (self.aiShips.indexOf(self.move())>=0) {
                    self.aiShips.remove(self.move());
                    color = 'red';
                }
            }
            else {
                if (self.humanShips.indexOf(self.move())>=0) {
                    self.humanShips.remove(self.move());
                    color = 'red';
                }
            }
            var newPoint = new Point(validMove.x*30+15,validMove.y*30+15,color);
            self.moves.push({ player: target=='ai'?self.humanName:self.aiName(),move:self.move() });
            document.getElementById(target).appendChild(newPoint);
            
            // hack pc turn
            if (target == "ai") aiMove(self);
            self.move("");
        }
    }.bind(self);
};

var vm = new ViewModel("","PC",[],[]);
ko.applyBindings(vm);