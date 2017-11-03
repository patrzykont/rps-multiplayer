$( document ).ready(function() {
  var playerOneWins = 0;
  var playerOneLosses = 0;
  var playerTwoWins = 0;
  var playerTwoLosses = 0;
  var ties = 0;
  
  
  var messageField = $('#messageInput');
  var messageList = $('#messages');

  var playerOneSide = $('<div>')
    .attr('id', 'playerOneGame')
    .addClass('box');
  var midDiv = $('<div>')
    .attr('id', 'gameplay')
    .addClass('box');
  var playerTwoSide = $('<div>')
    .attr('id', 'playerTwoGame')
    .addClass('box');

  var waitingOne = $('<p>').text("Waiting of Player 1").addClass('paragraph');
  var waitingTwo = $('<p>').text("Waiting for Player 2").addClass('paragraph');

  var choices = ["rock", "paper", "scissors"];

  for(var i = 0; i < choices.length; i++){
    var playerOneBtns = $('<button>')
    .addClass('pOneBtns')
    .text(choices[i])
    .attr('id', 'playerOne')
    .attr('data-name', choices[i])
    playerOneSide.append(playerOneBtns);
  }
   for(var i = 0; i < choices.length; i++){
    var playerTwoBtns = $('<button>')
    .addClass('pTwoBtns')
    .text(choices[i])
    .attr('id', 'playerTwo')
    .attr('data-name', choices[i])
    playerTwoSide.append(playerTwoBtns);
  }
  $('#game').append(playerOneSide);
  $('#game').append(midDiv);
  $('#game').append(playerTwoSide);

  playerOneSide.append(waitingOne);
  playerTwoSide.append(waitingTwo);

  var name = $('#nameInput').val();
  var currentStatus = "★ online";
  var myFirebaseRef = new Firebase("https://luminous-heat-104.firebaseio.com/");
  var myUserRef = myFirebaseRef.push();
  var connectedRef = new Firebase("https://luminous-heat-104.firebaseio.com//.info/connected")
  
  myFirebaseRef.set({
    "players": {
        "one": {
            "choice": "",
            "name": "",
            "losses": 0,
            "wins": 0,
            "status": status
        },
        "two": {
            "choice": "",
            "name": "",
            "losses": 0,
            "wins": 0,
            "status": status
        },
    },
    "turn": "1",
    "chat": ""
  });

  $('#addName').on('click', function() {
    var name = $('#nameInput').val();
    waitingOne.empty();

      myFirebaseRef.once("value", function(snapshot) {
        nameOneEntered = snapshot.child('players/one/name/').val();
        nameTwoEntered = snapshot.child('players/two/name/').val();
        if(nameOneEntered == ""){
          ref = myFirebaseRef.child("players");
          ref.child('one').set({
            'name': name,
            'status': status
          })
        }else if(nameTwoEntered == ""){
          ref = myFirebaseRef.child("players");
          waitingTwo.empty();
          ref.child('two').set({
            'name': name,
            'status': status
          })
          waitingTwo.empty();
        }else if(nameTwoEntered !== ""){
          alert("Please wait!");
        }
      })

      return false;
  });
    function chatbox(snap){
        var chat = $('#addMessage').val();

        $('#messageInput').keypress(function (e) {
            if (e.keyCode == 13) {
                var name = chat;
                var text = $('#messageInput').val();
                myFirebaseRef.child('chat').push({name: name, text: text});
                $('#messageInput').val('');
            };
        });
            myFirebaseRef.on('child_added', function(snapshot) {
                var message = snapshot.val();
                showMessage(message.name, message.text);
        });

        function showMessage(name, text) {
            $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesHere'));
            $('#messagesHere')[0].scrollTop = $('#messagesHere')[0].scrollHeight;
        }; 
    };

      $(".pOneBtns").on("click", function() {
        var playerOneGuess = $(this).attr('data-name');
        if (playerOneGuess == "rock"){
            var showRock = "<img class='rock' src='assets/images/rock-08.jpg' alt='Player One Rock'>";
            $("#playerOneGame").html(showRock);
            myFirebaseRef.child('players/one/').update({choice: "rock"});
        } else if (playerOneGuess == "paper"){
            var showPaper = "<img class='paper' src='assets/images/paper.jpg' alt='Player One Paper'>";
            $("#playerOneGame").html(showPaper);
            myFirebaseRef.child('players/one/').update({choice: "paper"});
        }else if (playerOneGuess == "scissors"){
            var showScissors = "<img class='scissors' src='assets/images/scissors.png' alt='Player One Scissors'>";
            $("#playerOneGame").html(showScissors);
            myFirebaseRef.child('players/one/').update({choice: "scissors"});
        }

          myFirebaseRef.update({
          turn: 2
        }); 
    });
        $(".pTwoBtns").on("click", function() {
        var playerTwoGuess = $(this).attr('data-name');
        if (playerTwoGuess == "rock"){
            var showRockTwo = "<img class='rock' src='assets/images/rock-08.jpg' alt='Player One Rock'>";
            $("#playerTwoGame").html(showRockTwo);
            myFirebaseRef.child('players/two/').update({choice: "rock"});
        } else if (playerTwoGuess == "paper"){
            var showPaperTwo = "<img class='paper' src='assets/images/paper.jpg' alt='Player One Paper'>";
            $("#playerTwoGame").html(showPaperTwo);
            myFirebaseRef.child('players/two/').update({choice: "paper"});
        }else if (playerTwoGuess == "scissors"){
            var showScissorsTwo = "<img class='scissors' src='assets/images/scissors.png' alt='Player One Scissors'>";
            $("#playerTwoGame").html(showScissorsTwo);
            myFirebaseRef.child('players/two/').update({choice: "scissors"});
        }
        figureItOut();
      });
        // ==========
        myFirebaseRef.on("value", function(snapshot) {
        var currentTurn = snapshot.child("turn").val();
        //var playerPosition = snapshot.child("players/").val();
        var playerOneGuess = snapshot.child("players/one/choice").val();
        var playerTwoGuess = snapshot.child("players/two/choice").val();
        if (currentTurn == "one"){
            $('#playerOneGame').css({'visibility': 'visible'});
            $('#playerTwoGame').css({'visibility': 'hidden'});
        }else if(currentTurn == "two"){
            $('#playerOneGame').css({'visibility': 'hidden'});
            $('#playerTwoGame').css({'visibility': 'visible'});
            
        };
        if (currentTurn == "one"){
            $('#playerOneGame').css({'visibility': 'visible'});
            $('#playerTwoGame').css({'visibility': 'hidden'});
        }else if(currentTurn == "two"){
            $('#playerOneGame').css({'visibility': 'hidden'});
            $('#playerTwoGame').css({'visibility': 'visible'});
            
        };
        if ((playerOneGuess != '') && (playerTwoGuess != '')) {
            myFirebaseRef.update({
              turn: 1
            });
         

            // Displays player one choice of rock, paper or scissors
            myFirebaseRef.child("players/one/").once("value", function(snapshot) {                
                if (snapshot.val().choice == 'rock'){
                    var showRock = "<img class='rock' src='assets/images/rock-08.jpg' alt='Player One Rock'>";
                    $("#playerOneGame").html(showRock);
                } else if (snapshot.val().choice == 'paper'){
                    var showPaper = "<img class='paper' src='assets/images/paper.jpg' alt='Player One Paper'>";
                    $("#playerOneGame").html(showPaper);
                }else if (snapshot.val().choice == 'scissors'){
                    var showScissors = "<img class='scissors' src='assets/images/scissors.png' alt='Player One Scissors'>";
                    $("#playerOneGame").html(showScissors);
                }

                $("#playerOneName").html(snapshot.val().name);
                $("#playerOneWins").html(snapshot.val().wins);
                $("#playerOneLosses").html(snapshot.val().losses);
            });


           
            myFirebaseRef.child("players/two/").once("value", function(snapshot) {
                

                if (snapshot.val().choice == 'rock'){
                    var showPaperTwo = "<img class='paper' src='assets/images/paper.jpg' alt='Player One Paper'>";
                    $("#playerTwoGame").html(showPaperTwo);
                } else if (snapshot.val().choice == 'paper'){
                    var showPaperTwo = "<img class='paper' src='assets/images/paper.jpg' alt='Player One Paper'>";
                    $("#playerTwoGame").html(showPaperTwo);
                }else if (snapshot.val().choice == 'scissors'){
                    var showScissorsTwo = "<img class='scissors' src='assets/images/scissors.png' alt='Player One Scissors'>";
                    $("#playerTwoGame").html(showScissorsTwo);
                }

                $("#playerTwoName").html(snapshot.val().name);
                $("#playerTwoWins").html(snapshot.val().wins);
                $("#playerTwoLosses").html(snapshot.val().losses);
            });
          }
        });

         function figureItOut() {
          myFirebaseRef.once("value", function(snapshot) {
            var playerOneGuess = snapshot.child("players/one/choice").val();
            var playerOneWins = snapshot.child("players/one/wins").val();
            var playerOneLosses = snapshot.child("players/one/losses").val();
            var playerTwoGuess = snapshot.child("players/two/choice").val();
            var playerTwoWins = snapshot.child("players/two/wins").val();
            var playerTwoLosses = snapshot.child("players/two/losses").val();

            if ((playerOneGuess == 'rock') && (playerTwoGuess == 'scissors')){
                playerOneWins++;
                playerTwoLosses++;
                myFirebaseRef.child("players/one/").update({
                  wins: playerOneWins
                }); 
                myFirebaseRef.child("players/two/").update({
                  losses: playerTwoLosses
                }); 
                $('#gameplay').append(snapshot.child('players/one/name/').val().toUpperCase() + " WINS!!!");
                $('#gameplay').html(snapshot.val().name);
                
                
            }else if ((playerOneGuess == 'rock') && (playerTwoGuess == 'paper')){
                playerTwoWins++;
                playerOneLosses++;
                myFirebaseRef.child("players/one/").update({
                  losses: playerOneLosses
                }); 
                myFirebaseRef.child("players/two/").update({
                  wins: playerTwoWins
                });
                $('#gameplay').append(snapshot.child('players/two/name/').val().toUpperCase() + " WINS!!!");

            }else if ((playerOneGuess == 'scissors') && (playerTwoGuess == 'rock')){
                playerTwoWins++;
                playerOneLosses++;
                myFirebaseRef.child("players/one/").update({
                  losses: playerOneLosses
                }); 
                myFirebaseRef.child("players/two/").update({
                  wins: playerTwoWins
                });
                $('#gameplay').append(snapshot.child('players/two/name/').val().toUpperCase() + " WINS!!!");

            }else if ((playerOneGuess == 'scissors') && (playerTwoGuess == 'paper')){
                playerOneWins++;
                playerTwoLosses++;
                myFirebaseRef.child("players/one/").update({
                  wins: playerOneWins
                }); 
                myFirebaseRef.child("players/two/").update({
                  losses: playerTwoLosses
                });
                $('#gameplay').append(snapshot.child('players/one/name/').val().toUpperCase() + " WINS!!!");

            }else if ((playerOneGuess == 'paper') && (playerTwoGuess == 'rock')){
                playerOneWins++;
                playerTwoLosses++;
                myFirebaseRef.child("players/one/").update({
                  wins: playerOneWins
                }); 
                myFirebaseRef.child("players/two/").update({
                  losses: playerTwoLosses
                });
                $('#gameplay').append(snapshot.child('players/one/name/').val().toUpperCase() + " WINS!!!");

            }else if ((playerOneGuess == 'paper') && (playerTwoGuess == 'scissors')){
                playerOneLosses++;
                playerTwoWins++;
                myFirebaseRef.child("players/one/").update({
                  losses: playerOneLosses
                }); 
                myFirebaseRef.child("players/two/").update({
                  wins: playerTwoWins
                });
                $('#gameplay').append(snapshot.child('players/two/name/').val().toUpperCase() + " WINS!!!");
              };
            });
          }; 
        });



    
            
           

        

   





  
  













