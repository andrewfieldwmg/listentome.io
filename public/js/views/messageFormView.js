var MessageFormView = Backbone.View.extend({
    
    el: $("#message_form_container"),
           
    initialize: function(options){

            this.options = options;
            
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
                
        localStorage.setItem('messageFormViewLoaded', "true");
            
        var parameters = {
            username: localStorage.getItem("username"),
            roomName: localStorage.getItem("activeRoomName")
            };
            
        var compiledTemplate = _.template( $("#message_form_template").html(), parameters);
        this.$el.html( compiledTemplate );
        
    },

    events: {
   
         "click #submit-message": "submitMessage"
     
    },
    
    submitMessage: function(e) {
            
        console.log('submit message');
        e.preventDefault();
        var message = $('#message-text').val();
        
        socket.emit('message', { sender: tabID,
                                username: localStorage.getItem("username"),
                                userId: localStorage.getItem("userId"),
                                message: message,
                                });
        
        $('#message-text').val("");
        
    
    },
    
    remove: function() { 
          
        localStorage.setItem("messageFormViewLoaded", "false");
        
        //this.undelegateEvents();
        this.$el.empty().off(); 
        this.stopListening();
        //return this;
        //Backbone.View.prototype.remove.call(this);
      
    },
    
    hide: function(e) {

        // COMPLETELY UNBIND THE VIEW
        //this.undelegateEvents();
    
        //this.$el.removeData().unbind(); 
        
        this.$el.hide();  
        //Backbone.View.prototype.remove.call(this);

    },
    
    show: function(e) {

        // COMPLETELY UNBIND THE VIEW
        //this.undelegateEvents();
    
        //this.$el.removeData().unbind(); 
    
        // Remove view from DOM
        this.$el.show();  
        //Backbone.View.prototype.remove.call(this);

    }
    
   
});
