function Queue(){
    this.data = [];
};

Queue.prototype = {
    push:function(obj){
      return this.data.push(obj);
    },
    out:function(){
        return this.data.shift();
    },
    peek:function(){
        return this.data[0];
    },
    isEmpty:function(){
        return this.data.length>0?false:true;
    },
    clear:function(){
        this.data.length = 0;
        return this;
    }
};
module.exports = Queue;