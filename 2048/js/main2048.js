var board = new Array();
var score = 0;

$(document).ready(function(){
    prepareForMobile();
    newgame();
});

function prepareForMobile(){

    if( documentWidth > 500){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }

    $('#grid-container').css('width', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('height', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius', 0.02 * gridContainerWidth);

    $('.grid-cell').css('width', cellSideLength);
    $('.grid-cell').css('height', cellSideLength);
    $('.grid-cell').css('border-radius', 0.1 * cellSideLength);
}

function newgame(){
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
    $('#score').text(0);
}

//初始化函数
function init(){
    for(var i = 0; i < 4; i++)
        for(var j = 0; j < 4; j++){

            var gridCell = $("#grid-cell-"+i+"-"+j);
            gridCell.css('top',getPosTop(i, j));
            gridCell.css('left',getPosLeft(i, j));
        }

    for(var i = 0; i < 4;i++){
        board[i] = new Array();
        for(var j = 0; j < 4; j++)
            board[i][j] = 0;
    }
    //更新数据视图
    updateBoardView();

    score = 0;
}

//更新数据视图
function updateBoardView(){

    $(".number-cell").remove();
    for(var i = 0; i < 4;i++)
        for(var j = 0; j < 4; j++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            if(board[i][j] == 0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j)+cellSideLength/2);
                theNumberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
            }
            else{
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor( board[i][j] ));
                theNumberCell.css('color',getNumberColor( board[i][j] ));
                theNumberCell.text(trans(board[i][j]));
            }
        }
    $('.number-cell').css('line-height', cellSideLength+'px');
    $('.number-cell').css('font-size', 0.4*cellSideLength+'px');
}


function generateOneNumber(){
    if( nospace(board))
        return false;

    //随机一个位置
    var randx = parseInt(Math.floor(Math.random()*4));
    var randy = parseInt(Math.floor(Math.random()*4));
    while(true){
        if(board[randx][randy]==0)
            break;
        
        randx = parseInt(Math.floor(Math.random()*4));
        randy = parseInt(Math.floor(Math.random()*4));
    }

    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);

    return true;
}

document.addEventListener('touchstart',function(event){
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

document.addEventListener('touchend',function(event){
    
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;

    //x
    if(Math.abs( deltax ) >= Math.abs( deltay )){

        if(deltax > 0){
            //move right
            if( moveRight() ){
                setTimeout( "generateOneNumber()", 210);
                setTimeout( "isgameover()", 300);
            }
        }
        else{
            //move left
            if( moveLeft() ){
                setTimeout( "generateOneNumber()", 210);
                setTimeout( "isgameover()", 300);
            }
        }
    }
    //y
    else{
        
        if( deltay > 0){
            //move down
            if( moveDown() ){
                setTimeout( "generateOneNumber()", 210);
                setTimeout( "isgameover()", 300);
            }
        }
        else{
            //move up
            if( moveUp() ){
                setTimeout( "generateOneNumber()", 210);
                setTimeout( "isgameover()", 300);
            }
        }
    }

});

$(document).keydown( function( event ){
    switch( event.keyCode){
        case 37:   //left
            if( moveLeft() ){
                setTimeout( "generateOneNumber()", 210);
                setTimeout( "isgameover()", 300);
            }
            break;
        case 38:   //up
        if( moveUp() ){
            setTimeout( "generateOneNumber()", 210);
            setTimeout( "isgameover()", 300);
        }
            break;
        case 39:   //right
        if( moveRight() ){
            setTimeout( "generateOneNumber()", 210);
            setTimeout( "isgameover()", 300);
        }
            break;
        case 40:   //down
        if( moveDown() ){
            setTimeout( "generateOneNumber()", 210);
            setTimeout( "isgameover()", 300);
        }
            break;
        default:
            break;
    }
});

function isgameover(){
    if( nospace( board ) && nomove( board ))
        gameover();
}

function gameover(){
    alert('gameover!');
}

function moveLeft(){

    if( !canMoveLeft( board ) )
        return false;

    //moveLeft
    for(var i = 0; i < 4; i++)
        for(var j = 1; j < 4; j++){
            if(board[i][j] != 0){

                for(var k = 0; k < j; k++){
                    if(board[i][k] == 0 && noBlockHorizontal1(i, k, j, board)){
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if(board[i][k] == board[i][j] && noBlockHorizontal1(i, k, j, board)){
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveRight(){

    if( !canMoveRight( board ) )
        return false;

    //moveRight
    for(var i = 0; i < 4; i++)
        for(var j = 2; j >=0 ; j--){
            if(board[i][j] != 0){

                for(var k = 3; k > j; k--){
                    if(board[i][k] == 0 && noBlockHorizontal2(i, k, j, board)){
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if(board[i][k] == board[i][j] && noBlockHorizontal2(i, k, j, board)){
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveUp(){

    if( !canMoveUp( board ) )
        return false;

    //moveUp
    for(var j = 0; j < 4; j++)
        for(var i = 1; i < 4; i++){
            if(board[i][j] != 0){

                for(var k = 0; k < i; k++){
                    if(board[k][j] == 0 && noBlockVerticalUp(j, k, i, board)){
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if(board[k][j] == board[i][j] && noBlockVerticalUp(j, k, i, board)){
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore(score);
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown(){

    if( !canMoveDown( board ) )
        return false;

    //moveDown
    for(var j = 0; j < 4; j++)
        for(var i = 2; i >= 0; i--){
            if(board[i][j] != 0){

                for(var k = 3; k > i; k--){
                    if(board[k][j] == 0 && noBlockVerticalDown(j, k, i, board)){
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if(board[k][j] == board[i][j] && noBlockVerticalDown(j, k, i, board)){
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}