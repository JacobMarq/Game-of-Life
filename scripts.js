let Cells;
//var generationsArray = [];
let grid;
let playing = false;
let generations;
let deaths = 0;
let births = 0;
let ageArr = [];
let neighborsArr = [];

//btns
const populationbtn = document.getElementById('populate');
const playStopBtn = document.getElementById('play-stop');
const playbtn = document.getElementById('play');
const stopbtn = document.getElementById('stop');
const closebtn = document.getElementById('close');

//Containers
const GridContainer = document.getElementById('grid');
const ResultScreen = document.getElementById('result');

//result data
const birthsResult = document.getElementById('births');
const deathsResult = document.getElementById('deaths');
const generationsResult = document.getElementById('generations');
const longestLivedResult = document.getElementById('longest-lived');
const averageLifespanResult = document.getElementById('average-lifespan');

function Play()
{
    playbtn.style.display = playbtn.style.display === 'block' ? 'none' : 'block';
    stopbtn.style.display = stopbtn.style.display === 'block' ? 'none' : 'block';
    playing = playing == true ? false : true;
    
    if(!playing)
    {
        birthsResult.textContent = births;
        deathsResult.textContent = deaths;
        generationsResult.textContent = generations;
        averageLifespanResult.textContent = Lifespan('a') + 'gen';
        longestLivedResult.textContent = Lifespan('b') + 'gen';
        ResultScreen.style.display = 'flex';

        ClearGrid();

        neighborsArr = [];
        ageArr = [];
        //generationsArray = [];
        deaths = 0;
        births = 0;
        generations = 0;

        populationbtn.style.cursor = 'pointer';
    }
    else if(playing && GridContainer.childElementCount !== 0)
    {
        setTimeout(CalculateGen, 100);
    }
}
function ClearGrid()
{
    while(GridContainer.firstChild){
        GridContainer.removeChild(GridContainer.firstChild);
    }
}
function CreateGrid()
{
    for(i = 0; i < 625; i++){
        var cell = document.createElement('div');
        cell.className = ('cell');
        GridContainer.appendChild(cell);
    }
}

//simulation

function Populate()
{      
    function Make2DArray(){
    let arr = new Array(25);
    for(i = 0; i < arr.length; i++){
        arr[i] = new Array(25);
    }
    return arr;
    }
    
    if(GridContainer.childElementCount !== 0)
    {
        return;
    }
    CreateGrid();

    populationbtn.style.cursor = 'not-allowed';
    generations = 0;
    Cells = document.getElementsByClassName('cell');
    generationsArray = [];

    grid = Make2DArray();
    for(i = 0; i < 25; i++){
        for(j = 0; j < 25; j++){
            grid[i][j] = {isAlive: Math.floor(Math.random() * 2), Age: 0};
            if(grid[i][j].isAlive == 1){births++;}else{continue;}
        }
    }
    
    UpdateScreen();
}
function UpdateScreen()
{
    neighborsArr = [];
    generations++;
    
    let i = 0;
    
    for(j = 0; j < 25; j++){
        for(k = 0; k < 25; k++){
            if(grid[j][k].isAlive == 1){
                Cells[i].classList.remove('dead');
                Cells[i].classList.add('alive');
            }else if(grid[j][k].isAlive == 0){
                Cells[i].classList.remove('alive');
                Cells[i].classList.add('dead');
            }
            i++;
        }
    }
    
    //SavePopulation();

    if(playing)
    {   
        setTimeout(CalculateGen, 100);
    }
}
function CalculateGen()
{
    // for every cell == grid[x][y]
    // save sum of alive neighbors below in var 'n' (neighbors)
    // cell = cell == 0 && neighbors == 3 ? 1 : 0
    // cell = cell == 1 && neighbors < 2 || cell == 1 && neighbors > 3 ? 0 : 1

    let currentCell = 0;

    for(x = 0; x < 25; x++){
        for(y = 0; y < 25; y++){
            var n = 0;

            //checking nieghbors
            for(a=-1; a<2; a++){
                for(b=-1; b<2; b++){
                    if(a==0 && b==0){
                        continue;
                    }
                    else if(a>0 || b>0){
                        if(a>0 && x==24 || b<0 && y==0){n=n;}
                        else if(b>0 && y==24 || a<0 && x==0){n=n;}
                        else{n = n + grid[x + a][y + b].isAlive;}
                    }
                    else{
                        if(a<0 && x==0){n=n;}
                        else if(b<0 && y==0){n=n;}
                        else{n = n + grid[x + a][y + b].isAlive;}
                    }
                }
            }
            //end of checking

            Cells[currentCell].classList.remove('alive');
            Cells[currentCell].classList.remove('dead');

            Census(n);
            currentCell++;

        }
    }

    LifeCycle();

    UpdateScreen();
}
function Census(liveNeighbors)
{
    neighborsArr.push(liveNeighbors);
}
function LifeCycle()
{
    let i = 0;
    
    
    for(x = 0; x < 25; x++){
        for(y = 0; y < 25; y++){
            if(grid[x][y].isAlive == 1)
            {
                if(grid[x][y].Age > 0)
                {
                    ageArr.push(grid[x][y].Age);
                }
                if(neighborsArr[i] < 2 || neighborsArr[i] > 3)
                {
                    grid[x][y].isAlive = 0;
                    grid[x][y].Age = 0;
                    deaths++;
                }
                else
                {
                    grid[x][y].isAlive = 1;
                    grid[x][y].Age++;
                }
            }
            else if(grid[x][y].isAlive == 0)
            {
                if(neighborsArr[i] == 3)
                {
                    grid[x][y].isAlive = 1;
                    grid[x][y].Age = 0;
                    births++;
                }
                else
                {
                    grid[x][y].isAlive = 0;
                    grid[x][y].Age = 0;
                }
            }
            i++;
        }
    }
}

//data collection

function Lifespan(choice)
{
    if(choice == 'a')
    {   
        let sum = ageArr.reduce((partial_sum, a) => partial_sum + a, 0);
        let averageLifespan = Math.round(sum / (ageArr.length + 1));
        return averageLifespan;
    }
    else if(choice == 'b')
    {
        let longestLived = Math.max(...ageArr);
        return longestLived;
    }
}
/*function SavePopulation()
{
    var currentGridlength = grid.length;
    let currentGrid = new Array(currentGridlength);

    for(l=0; l<currentGridlength; l++)
    {
        currentGrid[l] = grid[l].slice(0);
    }
    
    generationsArray.push(currentGrid);
}*/

closebtn.addEventListener('click', ()=>{ResultScreen.style.display = 'none';});
playbtn.addEventListener('click', ()=>Play());
stopbtn.addEventListener('click', ()=>Play());
populationbtn.addEventListener('click', ()=>Populate());
playStopBtn.addEventListener('click', ()=>Play());