module.exports = function (io) {
  // Chatroom
  let numUsers = 0;
  var employees = [];
  io.on("connection", (socket) => {
    let addedUser = false;

    // when the client emits 'new message', this listens and executes
    socket.on("new_message", (data) => {
      // we tell the client to execute 'new message'
      socket.broadcast.emit("new_message", {
        username: socket.username,
		userid: socket.userid,
        message: data,
      });
    });

    // when the client emits 'add user', this listens and executes
    socket.on("add_user", (username, userid, role) => {
      if (addedUser) return;

      // we store the username in the socket session for this client
      socket.username = username;
	  socket.userid = userid;
	  socket.role = role;
	  var clientInfo = new Object();
      clientInfo.userId   = userid;
      clientInfo.name     = username;
	  clientInfo.role     = role;
	  employees.push(clientInfo);
	  console.log("user added");
      ++numUsers;
      addedUser = true;
      socket.emit("login", {
        numUsers: numUsers,
		userid: socket.userid,
		employees : employees,
      });
      // echo globally (all clients) that a person has connected
      socket.broadcast.emit("user_joined", {
        username: socket.username,
		userid: socket.userid,
        numUsers: numUsers,
		role : socket.role,
      });
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on("typing", () => {
      socket.broadcast.emit("typing", {
        username: socket.username,
      });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on("stop_typing", () => {
      socket.broadcast.emit("stop_typing", {
        username: socket.username,
      });
    });

    // when the user disconnects.. perform this
    socket.on("disconnect", () => {
      if (addedUser) {
        --numUsers;
   console.log("user disconnected");   
	 for( var i = 0, len = employees.length; i < len; i++){
            var c = employees[i];
           console.log("loop count: " + i + " user id " + c.userId + " socket id " + socket.userid);
            if(c.userId == socket.userid){
				 console.log("user removed before");
             employees.splice(i,1);
			 console.log("user removed");
              break;
            }
        }

        // echo globally that this client has left
        socket.broadcast.emit("user_left", {
          username: socket.username,
		  userid: socket.userid,
          numUsers: numUsers,
		  role: socket.role,
        });
      }
    });
  });
}
