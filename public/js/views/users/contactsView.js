var ContactsView = Backbone.View.extend({
    
    el: $("#contacts_container"),
    
    template : _.template( $("#contacts_template").html()),
           
    initialize: function(options){
            
            this.options = options;
            
            var self = this;
	    
	          
	    socket.on("user-contacts-updated", function(data) {
		self.userContactsUpdated(data);
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
        
        //console.log('rended connected clients');
	localStorage.setItem('contactsViewLoaded', "true");
       this.$el.html( this.template );
        
    },

    events: {
   
        "click .add-to-channel": "addToChannel",
	"click .open-user-actions": "openUserActions"
     
    },
    
    
        
    openUserActions: function(e) {
	   
	   console.log('open user actions');
	   
	if (localStorage.getItem("userActionsModalViewLoaded") == "false") {
	    
	    var clickedUserId = $(e.currentTarget).data('user-id'); 
	    socket.emit("get-user", {userId: clickedUserId });
		    
	    socket.on ('get-user-success', function (data) {
    
		var userModel = JSON.parse(data.userModel);
		
		    var parameters = {
			clickedUserId: userModel.id,
			clickedUserName: userModel.username,
			clickedUserGenre: userModel.userGenre,
			clickedUserLocation: userModel.userLocation,
			clickedUserJoinedDate: userModel.joinedDate
		    };
		    
		    var userActionsModalView = new UserActionsModalView(parameters);
		    userActionsModalView.afterRender();
		    
		    $('.send-friendship-request').hide();
		
	    });
	
	} else {
	    console.log('user actions modal ALREADY loaded');
	            
	}
     
    },
        

    userContactsUpdated: function(data) {
     
            console.log('update contacts message received');
            
            var userContacts = JSON.parse(data.userContacts);

            var dataTable = $('.contacts-table').DataTable();    
	    dataTable.destroy();
                            
		$('#contacts').html('');
		
		$('.contacts-table-head').show();
                //console.log('more than 1 client');
                
                for(i = 0; i < userContacts.length; i++) {
                
                if (userContacts[i].status === 'online') {
                        
                        var connectedUserId = userContacts[i].id;
                        var connectedUsername = userContacts[i].username;
                        
                        if(connectedUsername == localStorage.getItem("username")) {
                           var connectedUserMessage = "<strong>You</strong> are connected";
                           var actionIconsClass = "hidden";
                        } else {
                            var connectedUserMessage = "<strong>" + connectedUsername + "</strong> is connected";  
                            var actionIconsClass = "open-user-actions";
                        }
                        
                        var parameters = {
			    profileImageSrc: config.filePaths.userProfileImageDir + "/" + connectedUserId + "_profile.jpg",
                            connectedUserId: connectedUserId,
                            connectedUsername: connectedUsername,
                            cssClass: "connected-client-list",
                            time: time,
                            connectedUserMessage: connectedUserMessage,
                            contentName: "",
                            loaderClass: "hidden",
                            actionIconsClass: actionIconsClass,
                            userLocation: userContacts[i].userLocation,
                            userGenre: userContacts[i].userGenre
                            };
                            
             
                        var userListItemView = new UserListItemView(parameters);   
                        $('#contacts').append(userListItemView.afterRender());
                    }
                
                }

            	//var channelsView = new ChannelsView();
                //channelsView.afterRender();                     
     	
			$('.contacts-table').DataTable({
			       responsive: true,
			       "pageLength": 5,
			        "oLanguage": {
				"sEmptyTable": "You have no contacts"
				}
			       });
            
    },
    
    destroy: function() { 
        
	//console.log('connected clients remove funciont');
	
	//$('.invitation-modal').modal("hide");
	
         localStorage.setItem('contactsViewLoaded', "false");
        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
        
        this.$el.empty();
    }
    
   
});
