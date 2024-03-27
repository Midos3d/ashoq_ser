var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var lastplaying=0;
var lastplayed =-1;
var pass =false;
var number =4;
var winners=[];
var playing=0;
var played =[];
var Ground=[];
var sta =[];
var staC=[];
var playnew=false;
console.log("hello");
var showenplayed =0;
 var help =[];
 //change here
 function remov(p){
    for(let i =0;i<allPlayers[p].length;i++){
        for(let y=0;y<played.length;y++){
            if(allPlayers[p][i]==played[y]){
                allPlayers[p].splice(i,1);
                i--;
            }
        }
    }
 }
 function in_w (p){
for(let i =0;i<winners.length;i++){
    if(p==winners[i]){
        return true;
    }
}
return false;
 }
 var lastLoser=-1;
 var _finish =false;
 var finish=false;
 function next(){
    //here
    var i=playing;
    i++;
    // if(pass){
    //     pass =false;
    //     i+=2;
    // }else{
    //     i++;
    // }
    if(!pass){
        lastplaying=playing;
    }else{
        pass=false;
    }
   
    i%=number;
    
   while(true){
    if(i==lastplayed){
        lastplayed=-1
    }
    
    if(in_w(i)){
        i++;
        i%=number;
    }else{
        break;
    }
   }
   if(i!=lastplayed && allPlayers[i].length==0){
    winners.push(i);
    if(number- winners.length==1){
        _finish=true;
    }
    pass=true;
    next();
   }else{
    playing=i;

   if(i==lastLoser){
    lastLoser=-1;
    pass=true;
    next()
   }else{
    lastLoser=-1;
    
   }
   }
   
  
 }
 function add(){
    sortin();
    var ggg=[]
    for(let i=0;i<played.length;i++){
        ggg.push(played[i])
    }
    for(let x=0;x<Ground.length;x++){
        if(ggg.length==0){
            break;
        }
        if((Ground[x]-1)%13+1>(ggg[0]-1)%13+1){
            Ground.splice(x, 0, ggg[0]);
            ggg.shift()
        }
       
    }
    for(let i=0;i<ggg.length;i++){
        Ground.push(ggg[i])
    }
 }
 function is_ashok_true(){
    for(let i =0;i<played.length;i++){
        if((played[i]-1)%13+1!=showenplayed){
        
            return true;
        }
    }
    return false;
 }
 function sortin (){
    for(let x=0;x<played.length;x++){
        var temp=x;
        for(let y=x+1;y<played.length;y++){
            if((played[temp]-1)%13+1>(played[y]-1)%13+1){
                temp=y;
            }
        }
        var t =played[temp]
        played[temp]=played[x]
        played[x]=t
    }
 }
  function AddP(o){
    for(let x=0;x<allPlayers[o].length;x++){
        if(Ground.length==0){
            break;
        }
        if((allPlayers[o][x]-1)%13+1>(Ground[0]-1)%13+1){
            allPlayers[o].splice(x, 0, Ground[0]);
            Ground.shift()
        }
       
    }
    for(let i=0;i<Ground.length;i++){
        allPlayers[o].push(Ground[i])
    }
    Ground=[];
  }
 var clients =[];
 //here
 var allPlayers =[];
 for(let i=0;i<number;i++){
    allPlayers.push([]);
 }
 for(let i=1;i<53;i++){
    help.push(i);
 }
 //here
 for(let i =51;i>=0;i--){
    let y =Math.ceil(Math.random()*i);
       j =(help[y]-1)%13+1;
       b=true;
        for(let r =0;r<allPlayers[i%number].length;r++){
          if((allPlayers[i%number][r]-1)%13+1>=j){
              allPlayers[i%number].splice(r, 0, help[y]);
              b=false;
              break;
          }
        }
      if(b){
        allPlayers[i%number].push(help[y]);
      }
   
   help.splice(y,1);

 }
var num=[];
for(let i =0;i<number;i++){
num.push(0);
}
io.on('connection', function (socket) {
    console.log("lol")
  socket.on("start",(data)=>{
    socket.on("playing",(data)=>{
        //here
        if(data["state"]==0){
            played =data["paper"];
            showenplayed=data["shown"];
            add()
            lastplayed=playing
            next()
            remov(lastplayed)
            for(let i =0;i<number;i++){
                num[i]=allPlayers[i].length;
                }
                if(_finish){
                    playing=-1;
                }
                
                    io.emit("playing",{"state":0,"playing":lastplaying,"next":playing,"num":num,"Ground":Ground.length,"played":(played.length-1)*13+showenplayed,"lastplayed":lastplayed})
                
        }else if(data["state"]==1){
            next()
            yyy=0
            if(lastplayed!=-1){
                yyy=(played.length-1)*13+showenplayed;
            }
            for(let i =0;i<number;i++){
                num[i]=allPlayers[i].length;
                }
                if(_finish){
                    playing=-1;
                }
                
                    io.emit("playing",{"state":1,"playing":lastplaying,"next":playing,"num":num,"Ground":Ground.length,"played":yyy,"lastplayed":lastplayed})
                
        }else{
            lastplaying=playing;
            
            
            var loser;
            
            if(is_ashok_true()){
                loser =lastplayed;
                lastplayed=-1;
            }else{
                loser=playing
                playing =lastplayed
                lastplayed=-1;
                if(allPlayers[playing].length==0){
                    winners.push(playing)
                    if(number-winners.length==1){
                        _finish=true;
                    }
                    pass=true;
                    next();
                }
                
                
            }
            if(number-winners.length>2){
                lastLoser=loser;
            }
         
            AddP(loser);
            showenplayed=0;
            for(let i =0;i<number;i++){
                num[i]=allPlayers[i].length;
                }
                if(_finish){
                    playing=-1;
                }
               
                    io.emit("playing",{"state":2,"playing":lastplaying,"next":playing,"num":num,"Ground":Ground.length,"played":0,"lastplayed":lastplayed,"loser":loser,"loserP":allPlayers[loser],"paper":played})
            
            played=[];
        }

    });
    clients.push(data);
    for(let i =0;i<number;i++){
        num[i]=allPlayers[i].length;
        }
    sta.push({"players":clients,"yourid":clients.length-1,"yourG":allPlayers[clients.length-1],"num":num});
    staC.push(socket);
    if(clients.length==number){
        for(let i=0;i<staC.length;i++){
            staC[i].emit("start",sta[i]);
        }
       
    }
  })
});
var port = 8080;
console.log(port);
server.listen(port);




