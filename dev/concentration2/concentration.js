    var imageUrls = ['images/image001.png','images/image002.png','images/image003.png','images/image004.png',
                    'images/image005.png','images/image006.png','images/image007.png','images/image008.png',
                    'images/image009.png','images/image010.png','images/image011.png','images/image012.png',
                    'images/image013.png','images/image014.png','images/image015.png','images/image016.png'];
    var imageObjs = [];
	var stream = [4, 6, 8];



	// Builds a stream of values.
	//
	// deck array - an array of values to pick from.
	// maxBuffer - the max number of places that separate pairs.
	// maxStream - the number of values to be in the returned stream (must be a multiple of 2!)
	//
	// return array - the stream of values with length maxStream.
	function makeStream(deck, maxBuffer, maxStream)
	{
		// The array to be returned with stream.
		var values = [];

		var size = deck.length;

		// Values that are on the board that still await matches.
		var buffer = [];

		for(var i = 0; i < maxStream; i++)
		{
			var useBuffer = Math.round(Math.random(67));

			// If we have enough numbers, empty buffer and we're finished.
			if(buffer.length+values.length == maxStream)
			{
				//alert(buffer.length+'-'+values.length);
				while(buffer.length > 0)
				{
					var nextNumber = buffer.splice(Math.floor(Math.random(98)*buffer.length), 1);
					values.push(nextNumber);
				}

				return values;
			}

			if(buffer.length > maxBuffer || (useBuffer == 1 && buffer.length > 0))
			{
				// If we max the buffer or we randomly choose to, take a buffer value.
				var nextNumber = buffer.splice(Math.floor(Math.random(32)*buffer.length), 1);
				values.push(nextNumber);
			}
			else
			{
				// Pick a random value from the deck.  Add it to the buffer for its match.
				var nextNumber = deck[Math.floor(Math.random(76)*deck.length)];
				values.push(nextNumber);
				buffer.push(nextNumber);
			}
		}

		return values;
	}

	// Returns the next item in the stream.
	function getNextItem()
	{
		return stream.shift();
	}
    
    function getNextImage()
    {
        var imgIndex = getNextItem();
        return imageUrls[imgIndex];
    }

	stream = makeStream([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10, 200);
    for (i=0; i < imageUrls.length; i++)
    {
        imageObjs[i] = new Image();
        imageObjs[i].src = imageUrls[i];
    }
    var bgImage = new Image();
    bgImage.src = "back40.png";

    var cards = [];
    for (i=0; i < 4; i++)
    {
        var coverImage = new Image();
        coverImage.src = 'back40.png';
        coverImage.setAttribute('class', 'card');
        var coverDiv = document.createElement('div');
        coverDiv.setAttribute('class', 'front');
        coverDiv.appendChild(coverImage);

        var valImage = new Image();
        valImage.src = imageUrls[i % 2];
        valImage.setAttribute('class', 'card');
        var valDiv = document.createElement('div');
        valDiv.setAttribute('class', 'back');
        valDiv.appendChild(valImage);
        
        var newdiv = document.createElement('div');
        newdiv.setAttribute('id', 'card' + i);
        newdiv.setAttribute('class', 'unflip panel');
        newdiv.setAttribute('data-value', imageUrls[i % 2]);
        newdiv.appendChild(coverDiv);
        newdiv.appendChild(valDiv);
        cards[i] = newdiv;
        document.body.appendChild(cards[i]);
    }
    
    
    // randomly assign content for each card:
    //for (i=1; i <=5; i++)
    //{
    //    for (j=1; j<=4; j++)
    //    {
    //        var divName = 'slot'+i+j;
    //        var nextDiv = document.getElementById(divName);
    //        nextDiv.setAttribute("data-img", getNextImage());
    //    }
    //}
    //     <td width='80'><div id="slot11" class="unflip" data-value="back.png"><img id='img11' class='card' src='back.png' /></div></td>

	// Checks the DOM for two matching flipped cards.
	//
	// matchedCallback function to be called with two DOM elements if two cards are showing and match.
	// nonmatchedCallback function to be called with two DOM elements if two cards are showing and do not match.
	//
	// returns true if two cards are flipped, false otherwise (no callbacks are called).  If two cards are flipped and they:
	// - match, matchedCallback will be called with both DOM elements as arguments.
	// - mismatch, nonmatchedCallback will be called with both DOM elements as arguments.
	function checkMatches(matchedCallback, nonmatchedCallback)
	{
		var flipped = $('.flip');
		var flipCount = flipped.size();
		
		if(flipCount == 2)
		{
			var e1 = flipped.first();
			var e2 = flipped.last();

			if(e1.attr('data-value') == e2.attr('data-value'))
			{
				matchedCallback(e1, e2);
			}
			else
			{
				nonmatchedCallback(e1, e2);
			}

			return true;
		}

		return false;
	}

	// Matching callback for checkMatches that destroys two cards that match.
	// e1 DOM element representing the card div.
	// e2 DOM element representing the card div.
	function destroyCards(e1, e2)
	{
        e1.addClass('fade');
        e2.addClass('fade');
		setTimeout('$(".fade").remove()', 1050);
    }


	// Nonmatching callback for checkMatches that hides the two cards that do not match.
	// e1 DOM element representing the card div.
	// e2 DOM element representing the card div.
	function hideCards(e1, e2)
	{
		e1.removeClass('flip');
		e2.removeClass('flip');
		e1.addClass('unflip');
		e2.addClass('unflip');
	}


	function oninitial() {
		$('.unflip').click(
			function(){
                if ($(this).hasClass('unflip'))
                {                    
                    $(this).removeClass('unflip');
                    $(this).addClass('flip');
                    setTimeout("checkMatches(destroyCards, hideCards)", 2500);
                }
            }
        );
	}

