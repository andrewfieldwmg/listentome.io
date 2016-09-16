var MessagesView = Backbone.View.extend({
    
    el: $("#messages_container"),
           
    initialize: function(){

            var self = this;
   
             socket.on('message', function (data) {
                 self.socketMessageReceived(data);
             });
     
             socket.on("sent-file-incoming", function(data) {
                 self.socketFileIncoming(data);
             });
         
             socket.on("sent-file", function(data) {
                 self.socketFileReceived(data);
             });
             
            socket.on("file-transfer-finished", function(data) {
                 self.socketSendFileDone(data);
             });
                               
             socket.on("audio-file-incoming", function(data) {
                 self.socketAudioStreamIncoming(data); 
              });
      
      
    	    socket.on("emptyMessages", function(data) {
                $('#message-results').html();
              });

	      
            this.render = _.wrap(this.render, function(render) {
                       this.beforeRender(); 
                       render();						
                       //this.afterRender();
               });						
                   

        this.render();
        
    },
  
    render: function(){

        return this;
    
    },
    
    beforeRender: function () {
        
        //this.undelegateEvents();
	//this.$el.removeData().unbind();
        
        //this.$el.empty().off(); 
        //this.stopListening();
        
    },
    
    
    afterRender: function() {
           
        //console.log('MessagesView rendered');
                 
        localStorage.setItem('messagesViewLoaded', "true");
        //new AudioPlayerView({streamName: "No stream loaded"});
        
        var parameters = {username: localStorage.getItem("username")};
        var compiledTemplate = _.template( $("#messages_template").html(), parameters);
        this.$el.html( compiledTemplate );

    },

    events: {
   
    
    },
    

    socketMessageReceived: function(data) {
         
         //console.log('message received');

        if (data.channelId != localStorage.getItem("activeChannelId")) {
            
            return;
        
        } else {
        
         $('.feedback-placeholder').hide();
         
        //var socketIndex = data.socketindex;
        
        var cssClass = "list-item-" + data.userColour;
        
        if(data.username == localStorage.getItem("username")) {
            var senderName = "You";  
        } else {
             var senderName = data.username;  
        }
         
	    if($('.list-group-item[data-id="'+ data.messageId + '"]').length) {
                console.log('that message already exists');
	    } else {
		
		var parameters = {
				messageId: data.messageId,
				cssClass: cssClass,
				backgroundColour: data.userColour,
				time: time,
				contentFromUsername: senderName + ":",
				contentName: data.message,
				loaderClass: "hidden"
				};
		
		var listItemView = new ListItemView(parameters);
		
		$('#message-results').append(listItemView.render());
	    }


  
            scrollToBottom();
            playSound();
        }
        
    },
    
    socketFileIncoming: function(data) {
        
            //var socketIndex = data.socketindex;
            //var socketCss = getSocketCss(socketIndex);
            var cssClass = "list-item-" + data.userColour;
        
            if(data.username == localStorage.getItem("username")) {
                var senderName = "You";  
            } else {
                 var senderName = data.username;  
            }
                    
            var parameters = {
                            cssClass: cssClass,
                            backgroundColour: data.userColour,
                            time: time,
                            contentFromUsername: "File transfer incoming from " + senderName + ":",
                            contentName: data.name,
                            loaderClass: ""
                            };
            
            var listItemView = new ListItemView(parameters);
            
            $('#message-results').append(listItemView.render());
        
            scrollToBottom();
            playSound();
            
    },
    
    socketFileReceived: function(data) {
        
         //console.log("receiving sent file");
         
           //var socketIndex = data.socketindex;
            //var socketCss = getSocketCss(socketIndex);
            var cssClass = "list-item-" + data.userColour;
            
            if(data.username == localStorage.getItem("username")) {
                var senderName = "You";  
            } else {
                 var senderName = data.username;  
            }
                    
            var parameters = {
                            cssClass: cssClass,
                            backgroundColour: data.userColour,
                            time: time,
                            contentFromUsername: "File transfer received from " + senderName + ":",
                            contentName: data.name,
                            loaderClass: "hidden"
                            };
            
            var listItemView = new ListItemView(parameters);
            
            $('#message-results').append(listItemView.render());
            
            var cleanURL = encodeURIComponent(data.name);

            $('#download-iframe').attr('src', '/api/download?file=' + cleanURL);
            
            $('.fa-refresh').hide();
            
            scrollToBottom();
            playSound();
   
    },
    
    socketSendFileDone: function(data) {
        
      var cssClass = "list-item-" + localStorage.getItem("userColour");
      
        var parameters = {
                      cssClass: cssClass,
                      backgroundColour: localStorage.getItem("userColour"),
                      time: time,
                      contentFromUsername: "File transfer completed: ",
                      contentName: data.name,
                      loaderClass: "hidden"
                      };
      
      var listItemView = new ListItemView(parameters);
      
      $('#message-results').append(listItemView.render());
            
      $('.fa-refresh').hide();
        
    },
    
    socketAudioStreamIncoming: function(data) {
        
        //console.log('audio stream incoming');
        
        //var socketIndex = data.socketindex;
        //var socketCss = getSocketCss(socketIndex);
        
        var cssClass = "list-item-" + data.userColour;
        
        var audioType = data.audioType;
        
        if (audioType === 'audio/wav/stream') {
            
            //playPcmStream(socket);
            var audioContext = playMp3Stream(socket);
             
        } else if (audioType === 'audio/wav') {
            
            //playPcmStream(socket);
            var audioContext = playMp3Stream(socket);
             
        } else if (audioType === 'audio/mp3') {
            
            var audioContext = playMp3Stream(socket);
        }
        
    
            if(data.username == localStorage.getItem("username")) {
               var streamAuthor = "You";
            } else {
                var streamAuthor = data.username;
            }
                 
            var parameters = {
                            cssClass: cssClass,
			    backgroundColour: data.userColour,
                            time: time,
                            contentFromUsername: "Audio stream loading from " + streamAuthor + ":",
                            contentName: data.name,
                            loaderClass: ""
                            };
            
            var listItemView = new ListItemView(parameters);
            
            $('#message-results').append(listItemView.render());
            

            new AudioPlayerView({streamName : data.name, audioContext: audioContext});
                    
            localStorage.setItem('streamState', 'started');
            
            scrollToBottom();
            //playSound();

    },
    
    remove: function() {
    
        localStorage.setItem("messagesViewLoaded", "false");
        
        //console.log('MessagesView removed');
        
        var self = this;
        socket.off('message');
        socket.off('sent-file-incoming');
        socket.off('sent-file');
        socket.off('file-transfer-finished');
        socket.off('audio-file-incoming');
       
        
       this.$el.empty().off(); 
        this.stopListening();
        //return this;
        //Backbone.View.prototype.remove.call(this);
    
    },
    
    
    hide: function() {

        // COMPLETELY UNBIND THE VIEW
        //this.undelegateEvents();
    
        //this.$el.removeData().unbind(); 
    
        // Remove view from DOM
        this.$el.hide(); 
        //Backbone.View.prototype.remove.call(this);

    },
        
    show: function() {

        // COMPLETELY UNBIND THE VIEW
        //this.undelegateEvents();
    
        //this.$el.removeData().unbind(); 
    
        // Remove view from DOM
        this.$el.show();  
        //Backbone.View.prototype.remove.call(this);

    },
    
    destroy: function() { 
        
	//$('.invitation-modal').modal("hide");
	
         localStorage.setItem("messagesViewLoaded", "false");
        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
        
        this.remove();
    }
    
    
      
});