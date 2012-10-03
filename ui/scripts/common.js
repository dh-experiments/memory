var TAP_EVENT = 'click';
var choices = [];

function generateCards(data) {
	var cards = [];
	var cardHtmls = [];

	// Generate dummy array
	for(var i=0, e=data.length*2; i<e; i++) {
		cards[i] = data[i%data.length];
	}

	// Shuffle Cards
	fisherYates(cards);

	// Add Cards
	for(var i=0, e=data.length*2; i<e; i++) {
		// Generate card
		var card = jQuery('<li/>', {
		    'class' : 'card',
		    'data-id' : cards[i].id,
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

	// Choices
	$('.card').live(TAP_EVENT, function(){
		var self = $(this);
		var selected = self.attr('data-id');
		self.addClass('selected');
		switch(choices.length) {
			case 0:
				choices.push(selected);
				break;
			case 1:
				choices.push(selected);
				if(choices[0]==choices[1]) {
					alert("match!");
					// Remove cards
					$('.card[data-id='+choices[0]+']').remove();
				} else {  // reset
					alert("fail");
				}
				newTurn()
				break;
			default:
				newTurn()
				break;
		}

	});

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

function newTurn(){
	$('.card[data-id='+choices[0]+']').removeClass('selected');
	$('.card[data-id='+choices[1]+']').removeClass('selected');
	choices = [];
}

var game = function(cardCount, messyCards) {
	var cardsLeft = cardCount || 52;
	var player1 = new player;
	var player2 = new player;

	return {
		cardsLeft : cardsLeft,
		player1 : player1,
		player2 : player2
	}
}

var player = function() {
	// Properties
	var name = "Player";
	var score = 0;

	return {
		name : name,
		score : score
	}
}