(function() {
	var peer = null
	var peerId = null
	var conn = null
	var otherPlayer = {
		peerId: null
	}
    
    //create HTML audio element
    var audio = new Audio('https://cdns-preview-9.dzcdn.net/stream/c-9691cbefa6a21f260751fa6d196151e9-2.mp3');
    
    const playBtn = document.getElementById('play-btn');
    
    //initialize boolean variable that you will send between peers as false
    var isPlaying = false;

    //creates peers, assigns them a random ID
    function initialize() {
		peer = new Peer(''+Math.floor(Math.random()*2**18).toString(36).padStart(4,0), {
			host: location.hostname,
			port: location.port || (location.protocol === 'https:' ? 443 : 80),
			path: '/myapp',
			debug: 3
		})
		peer.on('open', function(id) {
			peerId = id
		})
		peer.on('error', function(err) {
			alert(''+err)
		})
	}
    
    //when the first user enters and clicks the start button, their peerId is generated and displayed; also sets up gesture detection and peer-to-peer data connection for the first user
    const startBtn = document.getElementById("start-btn");
    startBtn.addEventListener('click', function(){
    start();
    })

    function start() {
		initialize();
        peer.on('open', function () {
            window.alert("Your device ID is: " + peerId);
              /*playBtn.addEventListener('click', function() { 
                    var isPlaying = true; 
                    window.alert('Enjoy the music!');
                    audio.play();
                    conn.send(isPlaying);});*/
                    startBtn.style.visibility = 'hidden';
                    joinBtn.style.visibility = 'hidden';
                    var gestureEnvironment = document.getElementById('gestureEnvironment');
                    var gestureDetector = new Hammer(gestureEnvironment);
                    gestureDetector.on("tap", function(ev) {
                        if(!isPlaying) {
                        audio.play();
                        isPlaying = true;
                        conn.send(isPlaying);
                        }
                        else {
                        audio.pause();
                        isPlaying = false;
                        conn.send(isPlaying);
                        }
                    });
        })
        peer.on('connection', function(c) {
			if(conn) {
				c.close()
				return
			}
			conn = c
            window.alert('You have connected with a peer!');
            conn.on('data', function(data) {
                console.log(data);
                if (data) {
                    audio.play();
                }
                else if (!data) {
                    audio.pause();
                }
            })
		})
    }
    
    //when the secondary user enters and clicks the join button, they are prompted to enter their peer's user id; also sets up gesture detection and peer-to-peer data connection for the other users
    const joinBtn = document.getElementById("join-btn");
    joinBtn.addEventListener('click', function(){
        join();   
    })
        
    
    function join() {
        initialize();
        peer.on('open', function() {
			var destId = window.prompt("Enter other user's peer ID: ");
			conn = peer.connect(destId, {
				reliable: true
			})
			conn.on('open', function() {
				otherPlayer.peerId = destId;
                /*playBtn.addEventListener('click', function() { 
                    isPlaying = true; 
                    window.alert('Enjoy the music!');
                    audio.play();
                    conn.send(isPlaying);});*/
                startBtn.style.visibility = 'hidden';
                joinBtn.style.visibility = 'hidden';
                    var gestureEnvironment = document.getElementById('gestureEnvironment');
                    var gestureDetector = new Hammer(gestureEnvironment);
                    gestureDetector.on("tap", function(ev) {
                        if(!isPlaying) {
                        audio.play();
                        isPlaying = true;
                        conn.send(isPlaying);
                        }
                        else {
                        audio.pause();
                        isPlaying = false;
                        conn.send(isPlaying);
                        }
                    });
                
            }) 
            conn.on('data', function(data) {
                console.log(data);
                if (data == true) {
                    audio.play();
                }
                else if (data == false) {
                    audio.pause();
                }
            })
        })
    }
})()
