var CARDS = [];
var data = ['A', 'B', 'C', 'D'];
var container = $('#Cards');
var choices = [];
var tapEvent = 'click';

window.onload = function() {

	// Generate dummy array
	for(var i=0, e=data.length*2; i<e; i++) {
		CARDS[i] = data[i%data.length];
		container.append("<li class='card' data-id='"+CARDS[i]+"'>"+CARDS[i]+"</li>");
	}

	console.log(CARDS);

	$('.card').live(tapEvent, function(){
		var self = $(this);
		var selected = self.attr('data-id');
		self.addClass('selected');
		console.log(selected);
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

function newTurn(){
	$('.card[data-id='+choices[0]+']').removeClass('selected');
	$('.card[data-id='+choices[1]+']').removeClass('selected');
	choices = [];
}