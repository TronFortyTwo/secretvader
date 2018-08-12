// ---------------------------------------------------------------------
// Abstract the piles
function pile_create()
{
	localStorage.setItem("draw_pile", String("llllllfffffffffff").shuffle());
	localStorage.setItem("discard_pile", "");
	
	console.log("pile: " + localStorage.getItem("draw_pile"));
}
function pile_draw()
{
	let draw_pile = localStorage.getItem("draw_pile");
	let discard_pile = localStorage.getItem("discard_pile");
	
	let card = draw_pile[draw_pile.length-1];
	draw_pile = draw_pile.slice(0,-1);
	
	// save the new pile
	pile_save(draw_pile, discard_pile);
	
	// reshuffle
	pile_shuffle();
	
	return card;
};
function pile_draw3()
{
	let draw_pile = localStorage.getItem("draw_pile");
	
	let cards = [];
	cards.push(draw_pile[draw_pile.length-1]);
	draw_pile = draw_pile.slice(0,-1);
	cards.push(draw_pile[draw_pile.length-1]);
	draw_pile = draw_pile.slice(0,-1);
	cards.push(draw_pile[draw_pile.length-1]);
	draw_pile = draw_pile.slice(0,-1);
	
	localStorage.setItem("draw_pile", draw_pile);
	
	return cards;
};
function pile_show3()
{
	let draw_pile = localStorage.getItem("draw_pile");
	let cards = [];
	cards.push(draw_pile[draw_pile.length-1]);
	cards.push(draw_pile[draw_pile.length-2]);
	cards.push(draw_pile[draw_pile.length-3]);
	return cards;
}
function pile_shuffle()
{
	let draw_pile = localStorage.getItem("draw_pile");
	
	if( draw_pile.length >= 3 ){ return; }

	let discard_pile = localStorage.getItem("discard_pile");
	
	draw_pile += discard_pile;
	discard_pile = "";
	draw_pile = draw_pile.shuffle();
	
	pile_save(draw_pile, discard_pile);
};
function pile_save(p, dp)
{
	localStorage.setItem("draw_pile", p);
	localStorage.setItem("discard_pile", dp);
};
function pile_info()
{
	let draw_pile = localStorage.getItem("draw_pile");
	let discard_pile = localStorage.getItem("discard_pile");
	
	return "Draw deck: " + draw_pile.length + " | discarded: " + discard_pile.length;
}
function pile_discard(c)
{
	let d = localStorage.getItem("discard_pile");
	d += c;
	localStorage.setItem("discard_pile", d);
}
// ---------------------------------------------------------------------
// Extend localStorage to store objects
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}
Storage.prototype.getObject = function(key) {
    return JSON.parse(this.getItem(key));
}
// ---------------------------------------------------------------------
// helper functions for players
function getName(pl)
{
	return localStorage.getObject("player"+pl).name;
}
function getRole(pl)
{
	return localStorage.getObject("player"+pl).role;
}
function isAlive(pl)
{
	return localStorage.getObject("player"+pl).alive;
}
function getPlayer(pl)
{
	return localStorage.getObject("player"+pl);
}

// ---------------------------------------------------------------------
// Get a random number in a range
function random(min, max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
// ---------------------------------------------------------------------
// Shuffle a string
String.prototype.shuffle = function () {
	let a = this.split("");
	let n = a.length;

    for(var i=n-1; i>0; i--)
    {
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}
// ---------------------------------------------------------------------
// return the stats about the board
function boardStats()
{
	let str = "<br><br>Total liberal policies approved: " + localStorage.getItem("liberal_cards") + " of 5";
	str += "<br>Total fascist policies approved: " + localStorage.getItem("empire_cards") + " of 6";
	str += "<br>Election Tracker: " + localStorage.getItem("tracker") + " of 3";
	str += "<br>" + pile_info() + "<br>";
	
	return str;
}
// ---------------------------------------------------------------------
// subroutine that removes the standard 'Ok, i got it' button
function removeButton()
{
	let old_button = document.getElementById("button");
	if(old_button)
	{
		old_button.parentNode.removeChild(old_button);
	}
}
// ---------------------------------------------------------------------
// Get next player after the one given
function nextPlayer( start )
{
	let next = start;
	let player_num = Number(localStorage.getItem("player_number"));
	
	do {
		next++;
		if(next > player_num)
			next = 1;
	}
	while( isAlive(next) == false )
	
	return next;
}
// ---------------------------------------------------------------------
// subroutine that update the turn
function turnStep()
{
	let next_turn = Number(localStorage.getItem("turn"));
	
	next_turn = nextPlayer( next_turn );
	
	localStorage.setItem("turn", next_turn);
	
	return next_turn;
}
// ---------------------------------------------------------------------
// boh
function setPlayerNames()
{
	window.location = "playerSetName.html";
}
// ---------------------------------------------------------------------
// Start a new game
function create( pnum )
{
	localStorage.clear();
	
	localStorage.setItem("player_number", pnum);
	
	// create all the new players
	setPlayerNames();
}

// ---------------------------------------------------------------------
// Setting the player name
function setName( setnum )
{
	var player = {
		name: document.getElementById("p_text").value,
		role: "liberal",
		alive: true
	};
	
	localStorage.setObject("player"+setnum, player);
	
	if(setnum == localStorage.getItem("player_number") ) {
		setGame();
		
		window.location = "pass.html";
		return;
	}
	else
	{
		document.getElementById("p_title").innerHTML = "Player " + (setnum+1) + ":";
		document.getElementById("p_button").onclick = function(){ setName(setnum+1); };
		document.getElementById("p_text").value = "Player " + (setnum+1);
	}
}

// ---------------------------------------------------------------------
// set game
function setGame()
{
	player_num = localStorage.getItem("player_number");
	
	// real number of player - counting also the ones killed
	localStorage.setItem("real_player_number", player_num);
	
	// assign what player is V.
	var vnum = random(1, player_num);
	
	var vader = getPlayer(vnum);
	
	vader.role = "Dart Vader";
	
	localStorage.setObject("player"+vnum, vader);
	
	console.log(vader.name + " is Dart Vader")
	
	// find the others affiliated empire
	if((player_num == 5) || (player_num == 6)) {
		var num_empire = 1;
	}
	else if((player_num == 7) || (player_num == 8)) {
		var num_empire = 2;
	}
	else if((player_num == 9) || (player_num == 10)) {
		var num_empire = 3;
	}
	
	while(num_empire > 0) {
		let empire_num = random(1, player_num);
		
		let p = getPlayer(empire_num);
		
		if(p.role !== "liberal") {
			continue;
		}
		
		num_empire--;
		
		p.role = "Imperialist";
		
		localStorage.setObject("player"+empire_num, p);
		
		console.log(p.name + " is Imperialist");
	}
	
	// now choose who now is gonna be the first Emperor
	var first_emperor = random(1, player_num);
	localStorage.setItem("emperor", first_emperor);
	
	console.log( getName(first_emperor) + " is first emperor");
	
	// this is the first election
	localStorage.setItem("chancellor", "0");
	localStorage.setItem("past_emperor", "0");
	localStorage.setItem("past_chancellor", "0");
	localStorage.setItem("real_new_emperor", "0");
	
	// The first emperor is also the first to play
	localStorage.setItem("turn", first_emperor);
	
	// create the pile of policies
	pile_create();
	
	// election tracker
	localStorage.setItem("tracker", "0");
	
	// how many cards are in the table
	localStorage.setItem("empire_cards", "0");
	localStorage.setItem("liberal_cards", "0");
	
	// at the start of the game, just do a turn showing each one role
	localStorage.setItem("phase", "first_round");
	
	// veto is not asked
	localStorage.setItem("veto_asked", "n");
}

// ---------------------------------------------------------------------
// Make the one who has the phone in the hand pass it
function passLoaded()
{
	let name = getName(localStorage.getItem("turn"));
	
	document.getElementById("notice").innerHTML = "Pass the phone to " + name;
	document.getElementById("button").value = "OK, now I am " + name;
}

// ---------------------------------------------------------------------
// This organize the play page just after has loaded
function playLoaded()
{
	var phase = localStorage.getItem("phase");
	
	var turn = localStorage.getItem("turn");
	var player = localStorage.getObject("player" + turn );
	var emperor_num = localStorage.getItem("emperor");
	var emperor = getPlayer(emperor_num);
	var player_num = localStorage.getItem("player_number");
	var chancellor_num = localStorage.getItem("chancellor");
	var chancellor = getPlayer(chancellor_num);
	
	// -----------------------------------------------------------------
	// first round just to show roles
	if( phase === "first_round" )
	{
		let text = "";
		
		if((player.role == "Imperialist") || ((player.role == "Dart Vader") && (player_num < 7)))
		{
			text += "The other Imperialists are:<br>";
			
			for(var i=1; i<=player_num; i++)
			{
				let temp_player = getPlayer(i);
				
				if(temp_player.name != player.name)
				{
				
					if(temp_player.role == "Imperialist")
					{
						text += "- <b>" + temp_player.name + "</b><br>"
					}
					else if(temp_player.role == "Dart Vader")
					{
						text += "- <b>" + temp_player.name + "</b> (Dart Vader)<br>"
					}
				}
			}
		}
		
		text += "<br>As first Emperor, <b>" + emperor.name + "</b> has been randomly choosen";
		
		document.getElementById("top_title").innerHTML = "You are <b>" + player.role + "</b>";
		document.getElementById("comment").innerHTML = text;
	}
	// -----------------------------------------------------------------
	// election phase - emperor turn
	else if( phase === "election" )
	{
		document.getElementById("top_title").innerHTML = "<b>" + player.name + "</b> turn";
		
		let text = "As candidate Emperor, you have to choose a player to be the candidate chancellor:";
		
		text += boardStats(text);
		
		document.getElementById("comment").innerHTML = text;
		
		// remove button
		removeButton();
		
		// function
		function setButton(button, i) {
			button.onclick = function(){ setChancellor(i); };
		}
		
		// loop
		let past_e = localStorage.getItem("past_emperor");
		let past_c = localStorage.getItem("past_chancellor");
		
		for(var i=1; i<=player_num; i++)
		{
			if (
				i == turn ||
				i == past_c ||
				(Number(player_num) > 6 && i == past_e) ||
				isAlive(i) == false
			) { continue; }
			
			let temp_player = getPlayer(i);
				
			let button = document.createElement("input");
			button.type = "button";
			button.value = temp_player.name;
				
			setButton(button, i);
				
			let el = document.getElementById("last_break");
			el.parentNode.appendChild(button);
				
			let bre = document.createElement("br");
			let bre2 = document.createElement("br");
			el.parentNode.appendChild(bre);
			el.parentNode.appendChild(bre2);
		}
	}
	// -----------------------------------------------------------------
	// do a round asking for the votes
	else if( phase === "vote_round")
	{
		document.getElementById("top_title").innerHTML = "<b>" + player.name + "</b> turn";
		
		let text = "You have to vote for the proposed new govern:<br>- <b>";
		text += emperor.name + "</b> as new Emperor<br>- <b>";
		text += chancellor.name + "</b> as new Chancellor<br>Please, don't say your vote until everyone has voted<br<br>";
		text += boardStats();
		
		document.getElementById("comment").innerHTML = text;
		
		let byes = document.getElementById("button");
		byes.value = "Yes";
		byes.onclick = function(){ vote("y", turn); };
		
		let bre = document.createElement("br");
		let bre2 = document.createElement("br");
		byes.parentNode.appendChild(bre);
		byes.parentNode.appendChild(bre2);
		
		let bno = document.createElement("input");
		bno.type = "button";
		bno.value = "No";
		bno.onclick = function(){ vote("n", turn) };
		
		byes.parentNode.appendChild(bno);
	}
	// -----------------------------------------------------------------
	// show election results
	else if(phase === "vote_result")
	{
		// write things down
		document.getElementById("top_title").innerHTML = "Read this out loud";
		
		// check votation results
		let yes = 0;
		let no = 0;
		let approved = false;
		
		for(var i=1; i<=player_num; i++)
		{
			if( isAlive(i) == false )
				continue;
			
			if( localStorage.getItem("vote"+i) == "y" )
				yes++;
			else
				no++;
		}
		
		if(yes > no){
			approved = true;
		}
		
		let text = "PUBLIC ANNOUNCE:<br>the new candidate government with<br>";
		text += "- <b>" + emperor.name + "</b> as Emperor<br>";
		text += "- <b>" + chancellor.name + "</b> as chancellor<br>";
		text += "has been ";
		if(approved)
		{
			text += '<font color="green">approved</font><br>';
		}
		else
		{
			text += '<font color="red">rejected</font><br>';
		}
		text += "<br>VOTES:<br>";
		
		for(var i=1; i<=player_num; i++)
		{
			if(isAlive(i) == false)
				continue;
			
			let temp = localStorage.getItem("vote"+i); 
			text += "- <b>" + getName(i) + "</b> : " + temp + "<br>"
		}
		
		if(approved)
		{
			text += "<br>Now the new government will create a new policy<br>";
			
			localStorage.setItem("vote_result", "y");
			localStorage.setItem("turn", emperor_num);
			localStorage.setItem("past_emperor", emperor_num);
			localStorage.setItem("past_chancellor", chancellor_num);
		}
		else
		{
			let new_emperor = nextPlayer(Number(localStorage.getItem("emperor")));
			
			text += "<br>After this failure, the opportunity to create a new government is given to ";
			text += "<b>" + getName(new_emperor) + "</b>";
			
			localStorage.setItem("vote_result", "n");
			localStorage.setItem("tracker", Number(localStorage.getItem("tracker"))+1);
			localStorage.setItem("emperor", new_emperor);
			localStorage.setItem("turn", new_emperor);
			localStorage.setItem("chancellor", "0");
		}
		text += boardStats();
		
		// update text
		document.getElementById("comment").innerHTML = text;
	}
	// -----------------------------------------------------------------
	// the emperor takes three cards and choose one to discard
	else if(phase == "legislative_emperor")
	{
		// title
		document.getElementById("top_title").innerHTML = "<b>" + player.name + "</b> turn";
		
		// text
		let text = "You now have to choose one of three policies shown below to discard.<br>";
		text += "The other two will be passed to the chancellor <b>" + chancellor.name + "</b>. He will then choose the one to approve that will go on the board";
		text += boardStats();
		
		text += "<br><br>";
		document.getElementById("comment").innerHTML = text;
		
		// draw the three cards
		let cards = pile_draw3();
		localStorage.setItem("card1", cards[0]);
		localStorage.setItem("card2", cards[1]);
		localStorage.setItem("card3", cards[2]);
		
		// the three card buttons
		let b1 = document.getElementById("button");
		b1.value = "CARD 1: ";
		if(cards[0] == "f") {
			b1.value += "fascist";
		} else {
			b1.value += "liberal";
		}
		b1.onclick = function(){ pickCard(1); };
	
		let bre = document.createElement("br");
		let bre2 = document.createElement("br");
		b1.parentNode.appendChild(bre);
		b1.parentNode.appendChild(bre2);
		
		let b2 = document.createElement("input");
		b2.type = "button";
		b2.value = "CARD 2: ";
		if(cards[1] == "f") {
			b2.value += "fascist";
		} else {
			b2.value += "liberal";
		}
		b2.onclick = function(){ pickCard(2); };
		b1.parentNode.appendChild(b2);
		
		
		let bre3 = document.createElement("br");
		let bre4 = document.createElement("br");
		b1.parentNode.appendChild(bre3);
		b1.parentNode.appendChild(bre4);
		
		let b3 = document.createElement("input");
		b3.type = "button";
		b3.value = "CARD 3: ";
		if(cards[2] == "f") {
			b3.value += "fascist";
		} else {
			b3.value += "liberal";
		}
		b3.onclick = function(){ pickCard(3); };
		b1.parentNode.appendChild(b3);
		
		// turn
		localStorage.setItem("turn", chancellor_num);
	}
	// -----------------------------------------------------------------
	// the chancellor takes two cards and choose one to apply
	else if(phase == "legislative_chancellor")
	{
		// title
		document.getElementById("top_title").innerHTML = "<b>" + player.name + "</b> turn";
		
		// text
		let text = "You now have to choose one of the two policies shown below that the Emperor <b>" + emperor.name + "</b> has passed to you.<br>";
		text += "The one you choose will be the policy approved that will go on the board, while the other one will be discarded";
		text += boardStats();
		
		text += "<br><br>";
		document.getElementById("comment").innerHTML = text;
		
		let card1 = localStorage.getItem("card1");
		let card2 = localStorage.getItem("card2");
		
		// card 1
		let b1 = document.getElementById("button");
		b1.value = "CARD 1: ";
		if(card1 == "f") {
			b1.value += "fascist";
		} else {
			b1.value += "liberal";
		}
		b1.onclick = function(){ pickCard(1); };
		
		let bre = document.createElement("br");
		let bre2 = document.createElement("br");
		b1.parentNode.appendChild(bre);
		b1.parentNode.appendChild(bre2);
		
		let b2 = document.createElement("input");
		b2.type = "button";
		b2.value = "CARD 2: ";
		if(card2 == "f") {
			b2.value += "fascist";
		} else {
			b2.value += "liberal";
		}
		b2.onclick = function(){ pickCard(2); };
		b1.parentNode.appendChild(b2);
		
		// veto power
		if( localStorage.getItem("empire_cards") == 5 )
		{
			let bre3 = document.createElement("br");
			let bre4 = document.createElement("br");
			b1.parentNode.appendChild(bre3);
			b1.parentNode.appendChild(bre4);
		
			let vetob = document.createElement("input");
			vetob.type = "button";
			vetob.value = "Propose veto to the president";
			b2.onclick = function(){ askVeto(); };
			b1.parentNode.appendChild(b2);
		}
	}
	// -----------------------------------------------------------------
	// show the result of the last legislative session
	else if(phase == "legislative_result")
	{
		let last_policy = localStorage.getItem("last_policy");
		
		document.getElementById("top_title").innerHTML = "Read this out loud";
		
		let text = "PUBLIC ANNOUNCE:<br>the government with<br>";
		text += "- <b>" + emperor.name + "</b> as Emperor<br>";
		text += "- <b>" + chancellor.name + "</b> as chancellor<br>";
		text += "has just approved a new ";
		if( last_policy == "l")
		{
			text += '<font color="blue">liberal</font><br>';
		}
		else
		{
			text += '<font color="red">fascist</font><br>';
		}
		
		text += " policy"
		text += boardStats();
		
		// update emperor
		let real_new_emperor = Number(localStorage.getItem("real_new_emperor"));
		let new_emperor;
		
		if(real_new_emperor == 0) {
			new_emperor = nextPlayer(Number(localStorage.getItem("emperor")));
		}
		else {
			new_emperor = nextPlayer(real_new_emperor-1);
		}
		
		text += "<br> Now a new government will be created. The candidate Emperor now is <b>";
		text += localStorage.getObject("player"+new_emperor).name + "</b><br>";
		
		document.getElementById("comment").innerHTML = text;
	}
	// -----------------------------------------------------------------
	// liberals just won by making enought liberal policies
	else if(phase == "liberal_win_cards")
	{
		document.getElementById("top_title").innerHTML = "LIBERALS WINS!!";
		
		let text = "PUBLIC ANNOUNCE:<br>Placing the last liberal policy on the board, the liberals won the game!<br>";
		text += "<br>Roles:<br>";
		for(let i=1; i<=player_num; i++)
		{
			text += "- <b>" + getName(i) + "</b> (" + getRole(i) + ")<br>";
		}
		text += boardStats();
		
		document.getElementById("comment").innerHTML = text;
	}
	// -----------------------------------------------------------------
	// liberals just won by killing hitler
	else if(phase == "liberal_win_kill")
	{
		document.getElementById("top_title").innerHTML = "LIBERALS WINS!!";
		
		let text = "PUBLIC ANNOUNCE:<br>By killing Dart Vader, the liberals won the game!<br>";
		text += "<br>Roles:<br>";
		for(let i=1; i<=player_num; i++)
		{
			text += "- <b>" + getName(i) + "</b> (" + getRole(i) + ")<br>";
		}
		text += boardStats();
		
		document.getElementById("comment").innerHTML = text;
	}
	// -----------------------------------------------------------------
	// imperlists just won by making enought fascist policies
	else if(phase == "empire_win_cards")
	{
		document.getElementById("top_title").innerHTML = "IMPERIALISTS WINS!!";
		
		let text = "PUBLIC ANNOUNCE:<br>Placing the last fascist policy on the board, the imperialists won the game!<br>";
		text += "<br>Roles:<br>"
		for(let i=1; i<=player_num; i++)
		{
			text += "- <b>" + getName(i) + "</b> (" + getRole(i) + ")<br>";
		}
		text += boardStats();
		
		document.getElementById("comment").innerHTML = text;
	}
	// -----------------------------------------------------------------
	// imperlists just won by making enought fascist policies
	else if(phase == "empire_win_vader_elected")
	{
		document.getElementById("top_title").innerHTML = "IMPERIALISTS WINS!!";
		
		let text = "PUBLIC ANNOUNCE:<br>Electing Dart Vader as the new chancellor, the imperialists won the game!<br>";
		text += "<br>Roles:<br>"
		for(let i=1; i<=player_num; i++)
		{
			text += "- <b>" + getName(i) + "</b> (" + getRole(i) + ")<br>";
		}
		text += boardStats();
		
		document.getElementById("comment").innerHTML = text;
	}
	// -----------------------------------------------------------------
	// Country fell in caos, a policy is randomly turned
	else if(phase == "caos")
	{
		// take the first policy of the pile
		let pol = pile_draw();
		
		// write the message
		document.getElementById("top_title").innerHTML = "Read this out loud";
		
		let text = "PUBLIC ANNOUNCE:<br>After 3 failed government proposal, the caos brought the acceptation of the first policy of the deck, whatever it is.<br>";
		text += "The new policy is a ";
		
		if(pol == "f")
		{
			let temp = Number(localStorage.getItem("empire_cards"));
			localStorage.setItem("empire_cards", temp+1);
			text += '<font color="red">fascist</font>';
		}
		else
		{
			let temp = Number(localStorage.getItem("liberal_cards"));
			localStorage.setItem("liberal_cards", temp+1);
			text += '<font color="blue">liberal</font>';
		}
		text += " one";
		text += boardStats();
		
		document.getElementById("comment").innerHTML = text;
		
		// update tracker
		localStorage.setItem("tracker", "0");
	}
	// -----------------------------------------------------------------
	// the emperor kills a player
	else if(phase == "emperor_power_kill")
	{
		// title
		document.getElementById("top_title").innerHTML = "<b>" + player.name + "</b> turn";
		
		// comment
		let text = "SPECIAL PRESIDENTIAL POWER:<br>You can choose a player to kill. Choose carefully!";
		text += boardStats();
		document.getElementById("comment").innerHTML = text;
		
		// remove standard button
		removeButton();
		
		// function
		function setButton(button, i) {
			button.onclick = function(){ kill(i); };
		}
		
		// loop
		for(var i=1; i<=player_num; i++)
		{
			let temp_player = localStorage.getObject("player"+i);
			
			if((i != turn) && (localStorage.getObject("player"+i).alive == true))
			{
				let button = document.createElement("input");
				button.type = "button";
				button.value = temp_player.name;
				
				setButton(button, i);
				
				let el = document.getElementById("last_break").parentNode;
				el.appendChild(button);
				
				let bre = document.createElement("br");
				let bre2 = document.createElement("br");
				el.appendChild(bre);
				el.appendChild(bre2);
			}
		}
	}
	// -----------------------------------------------------------------
	// Tell who has been killed by the president
	else if(phase == "post_kill")
	{
		// title
		document.getElementById("top_title").innerHTML = "Read this out loud";
		
		// comment
		let text = "PUBLIC ANNOUNCE:<br>The president used his special power, and killed ";
		text += "<b>" + localStorage.getObject("player" + localStorage.getItem("killed_player")).name + "</b>.";
		
		text += boardStats();
		document.getElementById("comment").innerHTML = text;
	}
	// -----------------------------------------------------------------
	// the emperor sees a player orientation
	else if(phase == "emperor_power_detective")
	{
		if( localStorage.getItem("exit_power_detective") == "y" )
		{
			localStorage.setItem("exit_power_detective", "n");
			postPlay();
		}
		
		// remove standard button
		removeButton();
		
		// title
		document.getElementById("top_title").innerHTML = "<b>" + player.name + "</b> turn";
		
		// comment
		let text = "SPECIAL PRESIDENTIAL POWER:<br>You can choose a player and see if is liberal or fascist. Choose carefully!";
		text += boardStats();
		document.getElementById("comment").innerHTML = text;
		
		// function
		function setButton(button, i) {
			button.onclick = function(){
				
				if( localStorage.getObject("player"+i).role == "liberal" )
					alert("The player you investigated is liberal");
				else
					alert("The player you investigated is fascist");
				localStorage.setItem("exit_power_detective", "y");
				
				window.location = "play.html";
			};
		}
		
		// loop
		for(var i=1; i<=player_num; i++)
		{
			if(i != turn)
			{
				let button = document.createElement("input");
				button.type = "button";
				button.value = getName(i);
				
				setButton(button, i);
				
				let el = document.getElementById("last_break").parentNode;
				el.appendChild(button);
				
				let bre = document.createElement("br");
				let bre2 = document.createElement("br");
				el.appendChild(bre);
				el.appendChild(bre2);
			}
		}
	}
	// -----------------------------------------------------------------
	// the emperor sees the 3 top card of the pile
	else if(phase == "emperor_power_see")
	{
		// title
		document.getElementById("top_title").innerHTML = "<b>" + player.name + "</b> turn";
		
		// comment
		let text = "SPECIAL PRESIDENTIAL POWER:<br>You can see the top 3 cards of the policy deck.";
		text += boardStats();
		
		// show them
		let cards = pile_show3();
		
		text += "<br>";
		for(var i=0; i!=3; i++)
		{
			text += "CARD " + (i+1) + ": ";
			
			if(cards[i] == "f")
			{
				text += '<font color="red">fascist</font>';
			}
			else
			{
				text += '<font color="blue">liberal</font>';
			}
			text += "<br>";
		}
		
		document.getElementById("comment").innerHTML = text;
	}
	// -----------------------------------------------------------------
	// the emperor chooses the next candidate emperor
	else if(phase == "emperor_power_choose")
	{
		// remove standard button
		removeButton();
		
		// title
		document.getElementById("top_title").innerHTML = "<b>" + player.name + "</b> turn";
		
		// comment
		let text = "SPECIAL PRESIDENTIAL POWER:<br>You can choose a player to be the next Emperor. After his ruling, the next president will follow the original order. Choose carefully!";
		text += boardStats();
		document.getElementById("comment").innerHTML = text;
		
		// function
		function setButton(button, i) {
			button.onclick = function(){ powerPick(i) };
		}
		
		// loop
		for(var i=1; i<=player_num; i++)
		{
			if(i != turn)
			{
				let button = document.createElement("input");
				button.type = "button";
				button.value = getName(i);
				
				setButton(button, i);
				
				let el = document.getElementById("last_break").parentNode;
				el.appendChild(button);
				
				let bre = document.createElement("br");
				let bre2 = document.createElement("br");
				el.appendChild(bre);
				el.appendChild(bre2);
			}
		}
	}
	// -----------------------------------------------------------------
	// the emperor choose to accept the veto of the chancellor or not
	else if(phase == "veto")
	{
		// title
		document.getElementById("top_title").innerHTML = "<b>" + player.name + "</b> turn";
		
		let text = "The chancellor asked for the veto<br>You can accept: no policy will be accepted, but the election tracker will advance of one.<br>Do you accept the veto proposal?";
		text += boardStats();
		document.getElementById("comment").innerHTML = text;
		
		let byes = document.getElementById("button");
		byes.value = "Yes";
		byes.onclick = function(){ acceptVeto(); };
		
		let bre = document.createElement("br");
		let bre2 = document.createElement("br");
		byes.parentNode.appendChild(bre);
		byes.parentNode.appendChild(bre2);
		
		let bno = document.createElement("input");
		bno.type = "button";
		bno.value = "No";
		bno.onclick = function(){ refuseVeto(); };
		
		byes.parentNode.appendChild(bno);
	}
	//
	else
	{
		console.log("error: unrecognized phase " + phase);
	}
}

// ---------------------------------------------------------------------
// This handle the actions at the end of a turn
function postPlay()
{
	var phase = localStorage.getItem("phase");
	var emperor_num = Number(localStorage.getItem("emperor"));
	var player_num = localStorage.getItem("player_number");
	
	// -----------------------------------------------------------------
	if(phase === "first_round" )
	{
		let turn = turnStep();
		
		// if everyone already seen his role, go to the election phase
		if( turn == emperor_num )
		{
			localStorage.setItem("phase", "election");
		}
	}
	// -----------------------------------------------------------------
	else if(phase === "election")
	{
		turnStep();
		
		// after, we must do a round of votes
		localStorage.setItem("phase", "vote_round");
	}
	// -----------------------------------------------------------------
	else if(phase === "vote_round")
	{
		let turn = turnStep();

		// if everyone already seen his role, go to the election phase
		if( turn == emperor_num )
		{
			localStorage.setItem("phase", "vote_result");
		}
	}
	// -----------------------------------------------------------------
	else if(phase === "vote_result")
	{
		let result = localStorage.getItem("vote_result");
		
		if(result == "y") {
			// if vader is chancellor
			if (( getRole(localStorage.getItem("chancellor")) == "Dart Vader" ) && (Number(localStorage.getItem("empire_cards")) >= 3) ) {
				localStorage.setItem("phase", "empire_win_vader_elected");
			}
			else {
				localStorage.setItem("phase", "legislative_emperor");
			}
		}
		else {
			// check the tracker
			let tracker = Number(localStorage.getItem("tracker"));
			
			if(tracker == 3)
			{
				localStorage.setItem("phase", "caos");
			}
			else
			{
				localStorage.setItem("phase", "election");
			}
		}
		
		localStorage.removeItem("vote_result");
	}
	// -----------------------------------------------------------------
	else if(phase == "legislative_emperor")
	{
		let discarded_num = localStorage.getItem("card_picked");
		let discarded_card = localStorage.getItem("card"+discarded_num);
		
		pile_discard(discarded_card);
		
		// now put the two cards left as card1 and card2
		if(discarded_num != 3)
		{
			localStorage.setItem("card"+discarded_num, localStorage.getItem("card3"));
		}
		
		localStorage.setItem("phase", "legislative_chancellor");
	}
	// -----------------------------------------------------------------
	else if(phase == "legislative_chancellor")
	{
		// veto
		if( localStorage.getItem("veto_asked") == "y" )
		{
			// reset
			localStorage.setItem("veto_asked", "n");
			
			localStorage.setItem("phase", "veto");
			localStorage.setItem("turn", emperor_num);
		}
		else
		{
			let picked = localStorage.getItem("card_picked");
			let discarded;
		
			if(picked == 1) {
				discarded = 2;
			}
			else {
				discarded = 1;
			}
			// discard the other card
			pile_discard(localStorage.getItem("card"+discarded));
		
			// we ended doing work with cards, so now we can shuffle if needed
			pile_shuffle();
		
			let card_picked = localStorage.getItem("card"+picked);
		
			// reset election tracker
			localStorage.setItem("tracker", 0);
		
			// advance the turn
			turnStep();
		
			// play the choosen card
			if(card_picked == "l")
			{
				let liberal = Number(localStorage.getItem("liberal_cards"));
				liberal++;
				localStorage.setItem("liberal_cards", liberal);
			
				if( liberal == 5 )
				{
					localStorage.setItem("phase", "liberal_win_cards");
				}
				else
				{
					// now show the result
					localStorage.setItem("last_policy", card_picked);
					localStorage.setItem("phase", "legislative_result");
				}
			}
			else
			{
				let fas = Number(localStorage.getItem("empire_cards"));
				fas++;
				localStorage.setItem("empire_cards", fas);
			
				if( fas == 6 )
				{
					localStorage.setItem("phase", "empire_win_cards");
				}
				else
				{
					// now show the result
					localStorage.setItem("last_policy", card_picked);
					localStorage.setItem("phase", "legislative_result");
				}
			}
		}
	}
	// -----------------------------------------------------------------
	else if(phase == "veto")
	{
		if( localStorage.getItem("veto_accepted") == "n")
		{
			// if refused just repropose the cards to the chancellor
			localStorage.setItem("phase", "legislative_chancellor");
			localStorage.setItem("turn", localStorage.getItem("chancellor"));
		}
		else
		{
			// discard the two cards, update the election tracker and call a new election
			pile_discard(localStorage.getItem("card1"));
			pile_discard(localStorage.getItem("card2"));
			pile_shuffle();
			
			let tracker = Number(sessionStorage.getItem("tracker"));
			tracker++;
			sessionStorage.setItem("tracker", tracker);
			
			sessionStorage.setItem("emperor", nextPlayer(Number(localStorage.getItem("emperor"))));
			sessionStorage.setItem("turn", localStorage.getItem("emperor"));
			if(tracker < 3) {
				sessionStorage.setItem("phase", "election");
			} else {
				sessionStorage.setItem("phase", "caos");
			}
		}
	}
	// -----------------------------------------------------------------
	else if(phase == "legislative_result")
	{
		let fas_cards = Number(localStorage.getItem("empire_cards"));
		let player_num = Number(localStorage.getItem("player_number"));
		// update emperor
		let real_new_emperor = Number(localStorage.getItem("real_new_emperor"));
		let new_emperor;
		if(real_new_emperor == 0) {
			new_emperor = nextPlayer(Number(localStorage.getItem("emperor")));
		}
		else {
			new_emperor = nextPlayer(real_new_emperor-1);
			localStorage.setItem("real_new_emperor", "0");
		}
		
		localStorage.setItem("emperor", new_emperor);
		
		if( localStorage.getItem("last_policy") == "f")
		{
			// check if some special emperor power has been activated
			if( fas_cards >= 4 )
			{
				localStorage.setItem("turn", emperor_num);
				localStorage.setItem("phase", "emperor_power_kill");
			}
			else if( (fas_cards == 3) && (player_num <= 6) )
			{
				localStorage.setItem("turn", emperor_num);
				localStorage.setItem("phase", "emperor_power_see");
			}
			else if( fas_cards == 3 )
			{
				localStorage.setItem("turn", emperor_num);
				localStorage.setItem("phase", "emperor_power_choose");
			}
			else if(((fas_cards == 2) && (player_num >= 7)) ||
					((fas_cards == 1) && (player_num >= 9)))
			{
				localStorage.setItem("turn", emperor_num);
				localStorage.setItem("phase", "emperor_power_detective");
			}
			else {
					localStorage.setItem("turn", new_emperor);
					localStorage.setItem("phase", "election");
			}
		}
		else {
				localStorage.setItem("turn", new_emperor);
				localStorage.setItem("phase", "election");
		}
	}
	// -----------------------------------------------------------------
	else if
	(
		phase == "liberal_win_cards" ||
		phase == "empire_win_cards" ||
		phase == "empire_win_vader_elected" ||
		phase == "liberal_win_kill"
	)
	{
		// start a new game
		window.location = "index.html";
		return;
	}
	// -----------------------------------------------------------------
	else if(phase == "caos")
	{	
		if( localStorage.getItem("liberal_cards") == 5 )
		{
			localStorage.setItem("phase", "liberal_win_cards");
		}
		else if(localStorage.getItem("empire_cards") == 6)
		{
			localStorage.setItem("phase", "empire_win_cards");
		}
		else
		{
			localStorage.setItem("phase", "election");
		}
	}
	// -----------------------------------------------------------------
	else if(phase == "emperor_power_kill")
	{
		let pl = localStorage.getItem("killed_player");
		let killed_player = getPlayer(pl);
		killed_player.alive = false;
		localStorage.setObject("player"+pl, killed_player);
		
		// the new emperor
		localStorage.setItem("emperor", nextPlayer(Number(localStorage.getItem("turn"))));
		
		if(killed_player.role != "Dart Vader")
		{
			turnStep();
			localStorage.setItem("phase", "post_kill");
		}
		else
		{
			turnStep();
			localStorage.setItem("phase", "liberal_win_kill");
		}
	}
	// -----------------------------------------------------------------
	else if
	(
		phase == "emperor_power_detective" ||
		phase == "emperor_power_see"
	)
	{
		localStorage.setItem("turn", localStorage.getItem("emperor"));
		let turn = turnStep();
		localStorage.setItem("emperor", turn);
		localStorage.setItem("phase", "election");
	}
	// -----------------------------------------------------------------
	else if(phase == "emperor_power_choose")
	{
		let choosen = localStorage.getItem("power_emperor");
		
		let real_new_emperor = nextPlayer(Number(localStorage.getItem("emperor")));
		
		localStorage.setItem("turn", choosen);
		localStorage.setItem("emperor", choosen);
		localStorage.setItem("real_new_emperor", real_new_emperor);
		localStorage.setItem("phase", "election");
	}
	// -----------------------------------------------------------------
	else if(phase == "post_kill")
	{
		localStorage.setItem("turn", localStorage.getItem("emperor"));
		localStorage.setItem("phase", "election");
	}
	else
	{
		console.log("error: unrecognized phase " + phase);
	}
	
	// give control to next player that has to play
	window.location = "pass.html";
}

// ---------------------------------------------------------------------
// called from HTML, it sets chancellor someone then finishes turn
function setChancellor( pl )
{
	localStorage.setItem("chancellor", pl);
	localStorage.setItem( "turn", Number(localStorage.getItem("turn") - 1));
	postPlay();
}
// ---------------------------------------------------------------------
// called from HTML, it sets the vote of someone
function vote( v, who )
{
	localStorage.setItem("vote"+who, v );
	postPlay();
}
// ---------------------------------------------------------------------
// called from HTML, it sets what cards has been choosen
function pickCard( n )
{
	localStorage.setItem("card_picked", n);
	postPlay();
}
// ---------------------------------------------------------------------
// called from HTML, it kills a player
function kill(pl)
{
	localStorage.setItem("killed_player", pl);
	postPlay();
}
// ---------------------------------------------------------------------
// called from HTML, it choose a player to be emperor for just a turn
function powerPick(pl)
{
	localStorage.setItem("power_emperor", pl);
	postPlay();
}
// ---------------------------------------------------------------------
// called from HTML
function askVeto(pl)
{
	localStorage.setItem("veto_asked", "y");
	postPlay();
}
function acceptVeto()
{
	localStorage.setItem("veto_accepted", "y");
	postPlay();
}
function refuseVeto()
{
	localStorage.setItem("veto_accepted", "n");
	postPlay();
}
