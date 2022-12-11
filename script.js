var throwed = [];
var keeped = [];

var throwNumber = 0;

var numbersList = [1,2,3,4,5,6];

$(document).ready(function(){
    let diceThrow = createMainPlaces();

    createDices(diceThrow);
})


function createMainPlaces() {  
    let mainContainer = document.createElement('div');
    $(mainContainer).addClass("mainContainer");

    $('body').append(mainContainer);

    let dicePlace = document.createElement('div');
    dicePlace.id = "dice";
    let tablesPlace = document.createElement('div');
    tablesPlace.id = "tables";

    $(mainContainer).append(dicePlace);
    $(mainContainer).append(tablesPlace);


    let table1 = document.querySelector('table[class="left"]')
    $(tablesPlace).append(table1);
    let table2 = document.querySelector('table[class="right"]')
    $(tablesPlace).append(table2);


    let diceThrow = document.createElement('div');
    diceThrow.id = "throw"
    let diceKeep = document.createElement('div');
    diceKeep.id = "keep";

    $(dicePlace).append(diceThrow);
    $(dicePlace).append(diceKeep);
    return diceThrow;
}

function createDices(parent) {  
    let oldthrower = $('#thrower');
    if(oldthrower){
        $(oldthrower).remove();
    }

    let thrower = document.createElement('button');
    thrower.textContent = 'Throw';
    thrower.id = 'thrower';
    $(parent).append(thrower);
    
    

    for(i=0;i<5;i++){
        let dice = document.createElement('img')
        dice.src = './img/1.png';
        dice.name = '1'
        $(dice).addClass('drag');
        $(dice).hide();
        throwed.push(dice);
        $(parent).append(dice);
    }

    $(thrower).on('click', function () {
        console.log(throwNumber);
        if(throwNumber <1){
            $.each(throwed, function (indexInArray, dice) { 
                let r = Math.floor(Math.random() * (6) + 1);
                dice.src = './img/'+ r +'.png';
                dice.name = r
                $(dice).show();
            });
            throwNumber++;
        }else {
            $.each(throwed, function (indexInArray, dice) { 
                let r = Math.floor(Math.random() * (6 - 1) + 1);
                dice.src = './img/'+ r +'.png';
                dice.name = r
                $(dice).show();
            });
            throwNumber++;
            $(this).prop('disabled',true);
            
        }
        let dices = keeped.concat(throwed)
        showAvailableCells(dices);

        //lock sections
        $("td:last-child:not(.locked):not(.score)").bind("click",function() 
        {
            $(this).addClass("locked");
            calculScores();
            replay();
            $("td:last-child").unbind("click");
        });
    });

    $('.drag').draggable();
    $('#throw, #keep').droppable({
        drop:function(e, ui) {
            let sourceElement = ui.draggable[0].parentNode.id;

            $(e.target).append($(ui.draggable).detach().css({'top':'', 'left':''}));
            console.log('add ' + ui.draggable[0].name +' in ' + e.target.id)
            
            let changing = ui.draggable[0];
            if(sourceElement != e.target.id){
                if(e.target.id == 'keep'){
                    
                    const index = throwed.indexOf(changing);
                    console.log(index);
                    if (index > -1) { // only splice array when item is found
                        throwed.splice(index, 1); // 2nd parameter means remove one item only
                    }
                    keeped.push(changing);
                }
                else{
                    const index = keeped.indexOf(changing);
                    console.log(index);
                    if (index > -1) { // only splice array when item is found
                        keeped.splice(index, 1); // 2nd parameter means remove one item only
                    }
                    throwed.push(changing);
                }
            }
            
            let dices = keeped.concat(throwed)
            showAvailableCells(dices);
        }
    });

    

    

}

function removeDices(){
    let dices = $('div[id="dice"] img');
    console.log(dices);
    $.each(dices, function (indexInArray, value) { 
        $(value).remove();
    });
}

function showAvailableCells(dices) {  
    console.log('dices',dices);
    let dicesValues = [];
    $.each(dices, function (indexInArray, dice) { 
        dicesValues.push(dice.name);
    });

    console.log('values : ',dicesValues);
    
    //score for 1 to 6 dices
    for(let i = 1 ;i <=6 ; i++){
        let score = getNumberTotal(dicesValues,i);
        let cell = $('#'+i);
        if(!isLocked($('#'+i))){
            $(cell).text(score);
        }
        
    }

    //score for combinations
    if(!isLocked($('#brelan'))){
        $('#brelan').text(getBrelan(dicesValues));
    }
    if(!isLocked($('#carré'))){
        $('#carré').text(getCarre(dicesValues));
    }
    if(!isLocked($('#yahtzee'))){
        $('#yahtzee').text(getYahtzee(dicesValues));
    }
    if(!isLocked($('#chance'))){
        $('#chance').text(getChance(dicesValues));
    }
    if(!isLocked($('#petiteSuite'))){
        $('#petiteSuite').text(getPetite(dicesValues));
    }
    if(!isLocked($('#grandeSuite'))){
        $('#grandeSuite').text(getGrande(dicesValues));
    }
    if(!isLocked($('#full'))){
        $('#full').text(getFull(dicesValues));
    }
    //show totals
    //TODO

}

function numberOf(dicesValues,wanted){
    let count = 0;
    dicesValues.forEach(function(val){
        if(val == wanted){
            count++
        }
        
    });
    return count;
}

function getNumberTotal(dicesValues,number){
    return number*numberOf(dicesValues,number);
}

function getBrelan(dicesValues){
    let score = 0;
    $.each(numbersList, function (index, value) { 
        if(numberOf(dicesValues,value) >= 3 && score <=3*value){
            score = 3*value;
        }
    });
    return score;
}

function getCarre(dicesValues){
    let score = 0;
    $.each(numbersList,function(index, value){
        if(numberOf(dicesValues,value) >= 4 && score <=4*value){
            score = 4*value;
         }
    });
    return score;
}

function getYahtzee(dicesValues){
    let possible = false;
    $.each(numbersList,function(index, value){
        if(numberOf(dicesValues,value) >= 5){
            possible = true;
        }
    });
    return possible ? 50 : 0;
}

function getChance(dicesValues){
    let score = 0;
    $.each(dicesValues, function (index, value) { 
         score += parseInt(value);
    });
    return score;
}

function compareNumbers(a, b){
    return a - b;
}

function getPetite(dicesValues){
    let ordered = dicesValues.sort(compareNumbers);
    let unique = ordered.filter((x, i) => ordered.indexOf(x) === i);
    if(unique.length>=4){
        let consecutives = 1;
        for (var i = 1; i < 4; i++){
            if(unique[i] == parseInt(unique[i-1])+1){
                consecutives ++;
            }
            else{
                consecutives = 1;
            }
        }
        if(consecutives >=4){
            return 30;
        }
    }
    return 0;
}

function getGrande(dicesValues){
    let ordered = dicesValues.sort(compareNumbers);
    let unique = ordered.filter((x, i) => ordered.indexOf(x) === i);
    if(unique.length == 5){
        return 40;
    }
    return 0;
}

function getFull(dicesValues){  
    let possible = false;

    $.each(numbersList, function (index, value) { 
        if(numberOf(dicesValues,value) == 3){
            var rest = dicesValues.filter(function(diceValue, index){ 
                return diceValue != value;
            });
            if(parseInt(rest[0]) == parseInt(rest[1])){
                possible = true;
            }
        }
    });
    return possible ? 25 : 0;
}

function isLocked(cell) {  
    return cell.hasClass('locked');
}

function replay() {  
    throwNumber = 0;
    //$('button').prop('disabled',false);
    throwed = [];
    keeped = [];
    
    let dices = $('img');
    removeDices(dices);
    let diceThrow = $("#throw");
    createDices(diceThrow);   
}

function calculScores(){ 

    //left table sum
    let ST = $('#st');
    let sum = 0;

    $.each(numbersList, function (index, id) { 
        let cellValue = $('#'+id);
        console.log(cellValue);
        if($(cellValue).hasClass('locked')){
            sum += parseInt($(cellValue).text()); 
        }
        
    });
    $(ST).text(sum);

    let Prime = $('#prime');
    if(sum >= 65){
        $(Prime).text(35);
    }
    else{
        $(Prime).text(0);
    }

    let Total = $('#diceTotal');
    $(Total).text(parseInt($(ST).text()) + parseInt($(Prime).text()));


    //right table sum
    let combinaisons = $('.right td:last-child.locked:not(.score)');
    let combSum = 0
    $.each(combinaisons, function (indexInArray, comb) { 
        combSum += parseInt($(comb).text());
    });

    $('#combineTotal1').text(combSum)

    $('combineTotal2').text(parseInt($('#combineTotal1').text()) + parseInt($(Total).text()));
}