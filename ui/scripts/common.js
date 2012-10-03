var game = function(data, numCards) {

	/*--------- Properties ---------*/

	var pairsLeft = numCards;
	var cards = [];
	var choices = [];  // 2 choices per turn
	var TAP_EVENT = 'click';
	var GUI = new gameUI();
	var ptsPerMatch = 10;

	// Players
	var players = [];
	var whosTurn = 0;

	// Turns
	var paused = false;

	/*--------- Initialize ---------*/

	// Create array of random people
	var people = [];
	var rands = randArr(data.length, numCards);
	for(var i=0, e=rands.length; i<e; i++) {
		people.push(data[rands[i]]);
	}

	// Duplicate the cards
	for(var i=0, e=people.length*2; i<e; i++) {
		cards[i] = people[i%people.length];
	}

	// Shuffle Cards
	fisherYates(cards);

	// Initialize Interface
	GUI.initialize(cards);

	// Choices
	$('.card').live(TAP_EVENT, function(){
		if(!paused) {
			var self = $(this);
			var selected = self.attr('data-id');
			self.addClass('selected');
			switch(choices.length) {
				case 0:
					choices.push(selected);
					break;
				case 1:
					// Prevent clicks until next turn
					paused = true;
					
					// Make sure didn't double click
					if(choices[0] != selected) {
						choices.push(selected);
						// There's a match
						if(cards[choices[0]]==cards[choices[1]]) {
							// Get Points
							players[whosTurn].score += ptsPerMatch;

							// Decrement amount left
							pairsLeft--;

							// Check game finished.  If so, find winner
							if(pairsLeft<=0) {
								var winner = getWinner();
								alert(players[winner.playerId].name+" won with "+winner.score+"points!");
							}

							// Remove cards
							GUI.removeCards(choices);

							newTurn(true);
						} else {  // reset
							newTurn();				
						}
					}
					break;
				default:
					newTurn();
					break;
			}
		}
	});

	function getWinner(){
		var highest = { score : 0, playerId : 0 };
		for(var i=0, e=players.length; i<e; i++) {
			if(players[i].score > highest.score) {
				highest.score = players[i].score;
				highest.playerId = i;
			}
		}

		return highest;
	}

	function newTurn(samePlayer){
		choices = [];
		var increment = 1;
		if(samePlayer) {
			increment = 0;
		}
		whosTurn = (whosTurn+increment)%players.length;
		window.setTimeout(function(){
			GUI.newTurn();
			GUI.updateWhosTurn(players[whosTurn].name);
			paused = false;
		}, 1000);
	}

	/*--------- Public ---------*/

	return {
		getWinner : getWinner,
		pairsLeft : function() {
			return pairsLeft
		},
		players : players,
		join : function(name){
			var p = new player(name);
			players.push(p);
		},
		restart : function(){
			// Destroy old session, retain players, and restart
		}
	}
}

var gameUI = function() {

	/*--------- Properties ---------*/

	var cardHtmls = [];
	var defaultDelay = 1000;

	/*--------- Public ---------*/

	return {
		initialize : function(cards) {
			// Add Cards
			for(var i=0, e=cards.length; i<e; i++) {
				// Generate card
				var card = jQuery('<li/>', {
				    'class' : 'card',
				    'data-id' : i,
				    'html' : "<span>"+cards[i].name+"</span><div class='overlay'></div>"
				});
				// Generate avatar
				var avatar = jQuery('<img/>', {
				    'src' : "https://graph.facebook.com/"+cards[i].id+"/picture?width=160&height=160",
				    'width' : "100%",
				}).prependTo(card);

				card.appendTo('#Cards');

				// Push to existing cards
				cardHtmls.push(card);
			}

			// Lock in place
			for(var i=cardHtmls.length-1; i>=0; i--) {
				var self = cardHtmls[i];
				self.css({
					'position':'absolute',
					'top' : self.offset().top,
					'left' : self.offset().left,
					'margin' : 0
				});
			}
		},
		updateWhosTurn : function(name) {
			$('#Turn .name').text(name);
		},
		removeCards : function(choices) {
			window.setTimeout(function(){
				for(var i=0, e=choices.length; i<e; i++) {
					$('.card[data-id='+choices[i]+']').remove();
				}
			}, defaultDelay);
		},
		newTurn : function() {
			$('.card').removeClass('selected');
		}
	}
}

var player = function(name) {
	
	/*--------- Properties ---------*/

	var name = name || "Player";
	var score = 0;

	/*--------- Public ---------*/

	return {
		name : name,
		score : score
	}
}

////////////////////////////////////////////////////////////////////////////////////
//  GENERIC FUNCTIONS
////////////////////////////////////////////////////////////////////////////////////

function randArr(upperBound, total) {
	var rands = [];
		
	for(var i=0, e=total; i<e; i++) {
		var num = Math.floor(Math.random()*(upperBound+1));
		if(!inArr(num, rands)) {
			rands.push(num);
		} else {
			i--;
		}
	}

	return rands;
}

function inArr(item, arr) {
	for(var i=0, e=arr.length; i<e; i++) {
		if(arr[i]==item) {
			return true;
		}
	}
	return false;
}

function fisherYates ( myArray ) {
	var i = myArray.length;
	if ( i == 0 ) return false;
	while ( --i ) {
		var j = Math.floor( Math.random() * ( i + 1 ) );
		var tempi = myArray[i];
		var tempj = myArray[j];
		myArray[i] = tempj;
		myArray[j] = tempi;
	}
}