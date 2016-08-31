var InvitationModalView = Backbone.View.extend({
    
    el: $("#invitation_modal_container"),
           
    initialize: function(options){
        
        var self = this;
        
        this.options = options;
	this.myUserId =  localStorage.getItem("userId");
        
        console.log('init invitation modal');
                                  
            socket.on('room-ready', function(data) {
                self.roomReady(data);
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
        
        this.undelegateEvents();
	this.$el.removeData().unbind();
        
        //this.$el.empty().off(); 
        //this.stopListening();
        
    },
		
    afterRender: function(){
           
	var self = this;
	
        var parameters = {
           invitedByUsername: this.options.invitedByUsername,
           joinRoomId: this.options.joinRoomId,
           invitationTo: this.options.invitationTo
           };
           
                            
        localStorage.setItem('acceptInvitationViewLoaded', "true");
         
       var compiledTemplate = _.template( $("#invitation_modal_template").html(), parameters);                     
       this.$el.html( compiledTemplate);
       
       $('.invitation-modal').modal();
       
            $('.invitation-modal').on('hidden.bs.modal', function () {
		console.log('hidden modal handler');
		self.destroy();
	    });
	    
	    /*$('#close-invitation-modal').on('click', function() {
		console.log('close invite modal click handler');
		self.destroy();
	    });*/
	   
    },

    events: {
   
     "click #accept-room-invitation" : "acceptRoomInvitation"
     
    },
    
    acceptRoomInvitation: function(e) {
        
        console.log("accept room invitation");
        
        e.preventDefault();
        //e.stopPropagation();
        
        var invitedRoomId = $(e.currentTarget).data('join-room-id');
        var myUsername = localStorage.getItem("username");
        var myUserId = localStorage.getItem("userId");
        var mySocketId = localStorage.getItem("socketId");

        socket.emit('join-room', {
                                joiningRoomId: invitedRoomId,
                                joinerUserId: myUserId,
                                joinerUsername: myUsername
                                });
        
    },
    
    roomReady: function(data) {
     
	var self = this;
     
        console.log('room ready');
		
	if(localStorage.getItem("roomName")) {
	    var roomNameArray = JSON.parse(localStorage.getItem("roomName"));
	} else {
	    var roomNameArray = [];
	}
	
	 roomNameArray.push(data.roomName.toString());
	 var uniqueRoomsArray = Array.from(new Set(roomNameArray));
	 
	 localStorage.setItem('roomName', JSON.stringify(uniqueRoomsArray));
	 
	if(localStorage.getItem("roomIds")) {
	    var roomIdArray = JSON.parse(localStorage.getItem("roomIds"));
	} else {
	    var roomIdArray = [];
	}
	
	 roomIdArray.push(data.roomId.toString());
	 var uniqueRoomIdsArray = Array.from(new Set(roomIdArray));
	 localStorage.setItem('roomIds', JSON.stringify(uniqueRoomIdsArray));
	 
	 
	 localStorage.setItem("activeRoomName", data.roomName);
	 localStorage.setItem("activeRoomId", data.roomId);
	
         $('.invitation-modal').modal("hide");
	
	var router = new Router();
	router.navigate("rooms/" + data.roomId, {trigger: "true"}); 

    },
    
    destroy: function() { 
        
	console.log('invite modal remove funciont');
	
	//$('.invitation-modal').modal("hide");
	
        localStorage.setItem('acceptInvitationViewLoaded', "false");
        
        //this.undelegateEvents();
        this.$el.empty().off(); 
        this.stopListening();
        //return this;
        //Backbone.View.prototype.remove.call(this);
      
    }
    
    
   
});