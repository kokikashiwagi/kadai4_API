//APIを利用する際のURL
var KEY = ''
var url = 'https://vision.googleapis.com/v1/images:annotate?key='
var api_url = url + KEY



//画像がアップロードされた時点で呼び出される処理
$("#uploader").change(function(evt){
    getImageInfo(evt);
    clear();
})

//画像ファイルを読み込み、APIを利用するためのURLを組み立てる
function getImageInfo(evt){
    var file = evt.target.files;
    var reader = new FileReader();
    var dataUrl = "";
    reader.readAsDataURL(file[0]);
    reader.onload = function(){
        dataUrl = reader.result;
        $("#showPic").html("<img src='" + dataUrl + "'>");
        makeRequest(dataUrl,getAPIInfo);
    }
}

//APIへのリクエストに組み込むJsonの組み立て
function makeRequest(dataUrl,callback){
    var end = dataUrl.indexOf(",")
    var request = "{'requests': [{'image': {'content': '" + dataUrl.slice(end + 1) + "'},'features': [{'type': 'LABEL_DETECTION','maxResults': 10,},{'type': 'FACE_DETECTION',},{'type':'TEXT_DETECTION','maxResults': 20,}]}]}"
    callback(request)
}

//通信を行う
function getAPIInfo(request){
    $.ajax({
        url : api_url,
        type : 'POST',       
        async : true,        
        cashe : false,
        data: request, 
        dataType : 'json', 
        contentType: 'application/json',   
    }).done(function(result){
        showResult(result);
    }).fail(function(result){
        alert('failed to load the info');
    });  
}

//得られた結果を画面に表示する
function showResult(result){
    let higashi =0;
    let minami =0;
    let nishi =0;
    let kita =0;
    let shiro =0;
    let hatsu =0;
    let chun =0;
    let sonota =0;
    
    let mentsu=0;
    let atama=0;
    let tehai2 ="";

    const tehai =[];
    let zuyiso =0;

    //テキスト解読の結果を表示
    if(result.responses[0].textAnnotations){
        for (var j = 1; j < result.responses[0].textAnnotations.length; j++){
            if(j < 15){
                tehai2 = tehai2+result.responses[0].textAnnotations[j].description;  
            }            
        }
    }else{
        //テキストに関する結果が得られなかった場合、表示欄にはその旨を記す文字列を表示
        $("#hantei").append("<tr><td class='resultTableContent'><b>これはでは字一色ではありません</b></td></tr>")
    }
    $("#textBox").html(tehai2)
    for(var j = 0; j < 14; j++){
        tehai.push(tehai2.charAt(j));

        //手配における各字牌の数を計算
        if(tehai2.charAt(j)=="東"){
            higashi = higashi+1
        }
        else if(tehai2.charAt(j)=="泉"){//東
            higashi = higashi+1
        }
        else if(tehai2.charAt(j)=="南"){
            minami = minami+1
        }
        else if(tehai2.charAt(j)=="西"){
            nishi = nishi+1
        }
        else if(tehai2.charAt(j)=="面"){//西
            nishi = nishi+1
        }
        else if(tehai2.charAt(j)=="北"){
            kita = kita+1
        }
        else if(tehai2.charAt(j)=="兆"){ //北
            kita = kita+1
        }
        else if(tehai2.charAt(j)=="此"){ //北
            kita = kita+1
        }
        // else if(tehai2.charAt(j)=="白"){
        //     shiro = shiro+1
        // }
        else if(tehai2.charAt(j)=="發"){
            hatsu = hatsu+1
        }
        else if(tehai2.charAt(j)=="赛"){
            hatsu = hatsu+1
        }
        else if(tehai2.charAt(j)=="中"){
            chun = chun+1
        }
        else{
            sonota = sonota+1
            console.log(tehai2.charAt(j));
        }
    }
    shiro =14-(higashi+minami+nishi+kita+hatsu+chun);
    //アレイに入れる
    const jihai =[higashi,minami,nishi,kita,shiro,hatsu,chun];
    console.log(jihai);
    console.log(sonota);

    //数を計算
    for(var j = 0; j < jihai.length; j++){
        if(jihai[j]==3){
            mentsu = mentsu + 1;
        }
        if(jihai[j]==2){
            atama = atama + 1;
        }
    }
    // console.log(mentsu,atama);
    if(mentsu==4 & atama==1){
        if(shiro==0){
            $("#hantei1").html("字一色です！！");
            $("#hantei1").css("color", "red");
            $("#hantei1").css("background-color", "black");
            zuyiso =1;                
        }
        else{
            $("#hantei1").html("字一色です！多分。。。");
            $("#hantei1").css("color", "red");
            $("#hantei1").css("background-color", "black");
            zuyiso =1;                
            
        }

    }
    else if(mentsu==0 & atama==7){
        $("#hantei1").css("color", "yellow");
        $("#hantei1").css("background-color", "black");
        $("#hantei1").html("おそらく字一色七対子です！！")
        zuyiso =1;
    }
    else{
        // $("#hantei").append("字一色じゃないです。。。");
        $("#hantei1").css("color", "blue");
        $("#hantei1").html("字一色じゃないです。。。")
        $("#hantei1").css("background-color", "white");
    }


//----------------------------------------
//点数表示ロジック
if(zuyiso==1){
    const oyako=$("#oyako").val();
const tumoron=$("#tumoron").val();
// console.log(oyako,tumoron);

    if(oyako==0){
        $("#pointJibun1").html("48000");
        //親のツモ
        if(tumoron==0){
            $("#pointKo").show();
            $("#pointKo1").show();
            $("#pointOya").show();
            $("#pointOya1").show();
            $("#pointKo1").html("16000");
            $("#pointOya1").html("なし");
        }
        //親のロン=表示なし
        else{
            $("#pointKo").hide();
            $("#pointKo1").hide();
            $("#pointOya").hide();
            $("#pointOya1").hide();
        }
    }   
    else{
        $("#pointJibun1").html(32000);
        //子のツモ
        if(tumoron==0){
            $("#pointKo").show();
            $("#pointKo1").show();
            $("#pointOya").show();
            $("#pointOya1").show();
            $("#pointOya1").html(16000);
            $("#pointKo1").html(8000);
        }
        //子のロン
        else{
            $("#pointKo").hide();
            $("#pointKo1").hide();
            $("#pointOya").hide();
            $("#pointOya1").hide();
        }
        }
    }
    else{
        $("#pointJibun1").html("なし");
        $("#pointOya1").html("なし");
        $("#pointKo1").html("なし");

    }

//----------------------------------------

}

