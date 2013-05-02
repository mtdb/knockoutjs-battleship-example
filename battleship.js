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

function populateBoard() {
    return ["C1","C2","C3"];
}

function drawShips(target,ships) {
    ko.utils.arrayForEach(ships, function(ship) {
        var coords = string2coords(ship);
        var newShip = new Square(coords.x*30+5,coords.y*30+15,"#999");
        document.getElementById(target).appendChild(newShip);
    });
}

var ViewModel = function(status, humanName, aiName, humanShips, aiShips) {
    var self = this;

    quadrant = ['A1','A2','A3','A4','A5','A6','A7','A8','A9','A10',
                'B1','B2','B3','B4','B5','B6','B7','B8','B9','B10',
                'C1','C2','C3','C4','C5','C6','C7','C8','C9','C10',
                'D1','D2','D3','D4','D5','D6','D7','D8','D9','D10',
                'E1','E2','E3','E4','E5','E6','E7','E8','E9','E10',
                'F1','F2','F3','F4','F5','F6','F7','F8','F9','F10',
                'G1','G2','G3','G4','G5','G6','G7','G8','G9','G10',
                'J1','J2','J3','J4','J5','J6','J7','J8','J9','J10'];

    self.status = ko.observable(status); // waiting running

    self.humanName = ko.observable(humanName);
    self.aiName = ko.observable(aiName);

    self.humanShips = ko.observableArray();
    self.aiShips = ko.observableArray(aiShips);

    self.move = ko.observable("");
    self.moves = ko.observableArray();

    self.totalMoves = ko.computed(function() {
        return self.moves().length;
    });

    self.lastGames = ko.observableArray();

    self.startGame = function() {
        self.status("running");
        self.aiShips(populateBoard());
        drawShips("human",self.humanShips());
        // drawShips("ai",self.aiShips());
    }

    self.endGame = function() {
        self.status("waiting");
        self.moves([]);
        var svg = document.getElementById("human");
        while (svg.lastChild) {
            svg.removeChild(svg.lastChild);
        }
        svg = document.getElementById("ai");
        while (svg.lastChild) {
            svg.removeChild(svg.lastChild);
        }
    }

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
            
            // Verify Winner
            if ((vm.humanShips().length == 0 || vm.aiShips().length == 0) && target == "human") {
                self.lastGames.push({
                    'player':vm.aiShips().length==0?self.humanName():self.aiName(),
                    'moves':Math.floor(self.moves().length/2),
                    'date':new Date()});
                
                self.endGame();
            }
            self.move("");
        }
    }.bind(self);
};

var vm = new ViewModel("waiting", "", "PC", [], []);
ko.applyBindings(vm);