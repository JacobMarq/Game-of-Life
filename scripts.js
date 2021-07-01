let Cells;
var generationsArray = [];
let grid;
let automated = false;
let generations;
let deaths = 0;
let births = 0;
//sets generations lived == 1yr
let lifespan = 0;

const GridContainer = document.getElementById('grid');
const populationbtn = document.getElementById('populate');
const beginLifeCyclebtn = document.getElementById('begin-life-cycle');
const automatebtn = document.getElementById('automate');


function Automate()
{
    automatebtn.style.color = automatebtn.style.color == 'rgb(196, 196, 196)' ? 'yellow' : 'rgb(196, 196, 196)';
    automated = automated == true ? false : true;
    console.log(CalculateLifespan());
}
function CreateGrid()
{
    for(i = 0; i < 625; i++){
        var cell = document.createElement('div');
        cell.className = ('cell');
        GridContainer.appendChild(cell);
    }
}


function Populate()
{      
    function Make2DArray(){
    let arr = new Array(25);
    for(i = 0; i < arr.length; i++){
        arr[i] = new Array(25);
    }
    return arr;
    }
    
    generations = 0;
    Cells = document.getElementsByClassName('cell');
    generationsArray = [];

    grid = Make2DArray();
    for(i = 0; i < 25; i++){
        for(j = 0; j < 25; j++){
            grid[i][j] = Math.floor(Math.random() * 2);
            if(grid[i][j] == 1){births++;}else{continue;}
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
            if(grid[j][k] == 1){
                Cells[i].classList.add('alive');
            }else if(grid[j][k] == 0){
                Cells[i].classList.add('dead');
            }
            i++;
        }
    }
    
    SavePopulation();

    if(generations % 20 == 0)
    {
        
    }

    if(automated)
    {
        setTimeout(CalculateGen, 100);
    }
}

function CalculateGen()
{
    // for every cell == grid[x][y]
    // save sum of the numbers below in var 'n' (neighbors)
    // grid[x][y - 1]
    // grid[x][y + 1]
    // grid[x - 1][y]
    // grid[x - 1][y - 1]
    // grid[x - 1][y + 1]
    // grid[x + 1][y]
    // grid[x + 1][y - 1]
    // grid[x + 1][y + 1]
    // cell = cell == 0 && neighbors == 3 ? 1 : 0
    // cell = cell == 1 && neighbors < 2 || cell == 1 && neighbors > 3 ? 0 : 1

    let currentCell = 0;

    for(x = 0; x < 25; x++){
        for(y = 0; y < 25; y++){
            var n;

            if(x == 0 && y == 0){
                n = grid[x][y + 1]
                + grid[x + 1][y]
                + grid[x + 1][y + 1];
            }
            else if(x == 0 && y < 24){
                n = grid[x][y - 1]
                + grid[x][y + 1]
                + grid[x + 1][y]
                + grid[x + 1][y - 1]
                + grid[x + 1][y + 1];
            }
            else if(x == 0 && y == 24){
                n = grid[x][y - 1]
                + grid[x + 1][y]
                + grid[x + 1][y - 1];
            }
            else if(x < 24 && y == 0){
                n = grid[x][y + 1]
                + grid[x - 1][y]            
                + grid[x - 1][y + 1]
                + grid[x + 1][y]                
                + grid[x + 1][y + 1];
            }
            else if(x < 24 && y < 24){
                n = grid[x][y - 1]
                + grid[x][y + 1]
                + grid[x - 1][y]
                + grid[x - 1][y - 1]
                + grid[x - 1][y + 1]
                + grid[x + 1][y]
                + grid[x + 1][y - 1]
                + grid[x + 1][y + 1];
            }
            else if(x < 24 && y == 24){
                n = grid[x][y - 1]
                + grid[x - 1][y]            
                + grid[x - 1][y - 1]
                + grid[x + 1][y]                
                + grid[x + 1][y - 1];
            }
            else if(x == 24 && y == 0){
                n = grid[x][y + 1]
                + grid[x - 1][y]
                + grid[x - 1][y + 1];
            }
            else if(x == 24 && y < 24){
                n = grid[x][y - 1]
                + grid[x][y + 1]
                + grid[x - 1][y]
                + grid[x - 1][y - 1]
                + grid[x - 1][y + 1];
            }
            else{
                n = grid[x][y - 1]
                + grid[x - 1][y]
                + grid[x - 1][y - 1];
            }
            
            Cells[currentCell].classList.remove('alive');
            Cells[currentCell].classList.remove('dead');

            Census(n);
            currentCell++;
        }
    }
    LifeCycle();

    UpdateScreen();
}
//save the current population
let lifedata = [];

function Census(liveNeighbors)
{
    neighborsArr.push(liveNeighbors);
}
function SavePopulation()
{
    var currentGridlength = grid.length;
    let currentGrid = new Array(currentGridlength);

    for(l=0; l<currentGridlength; l++)
    {
        currentGrid[l] = grid[l].slice(0);
    }
    
    generationsArray.push(currentGrid);
}
function LifeCycle()
{
    let i = 0;
    
    
    for(x = 0; x < 25; x++){
        for(y = 0; y < 25; y++){
            if(grid[x][y] == 1)
            {
                if(neighborsArr[i] < 2 || neighborsArr[i] > 3)
                {
                    grid[x][y] = 0;
                    deaths++;
                }
                else
                {
                    grid[x][y] = 1;
                    SaveLifeData(x, y);
                }
            }
            else if(grid[x][y] == 0)
            {
                if(neighborsArr[i] == 3)
                {
                    grid[x][y] = 1;
                    births++;
                }
                else
                {
                    grid[x][y] = 0;
                }
            }
            i++;
        }
    }
}
function SaveLifeData(x, y)
{
    let string = x.toString() + y.toString();
    console.log(string);
    lifedata.push(string);
}
function CalculateLifespan()
{
    let instances = lifedata.reduce(function(obj, item) {
        if (!obj[item]) {
          obj[item] = 0;
        }
        obj[item]++;
        return obj;
      }, {});

      return instances;     
}

let neighborsArr = [];

CreateGrid();
automatebtn.addEventListener('click', ()=>Automate());
populationbtn.addEventListener('click', ()=>Populate());
beginLifeCyclebtn.addEventListener('click', ()=>CalculateGen());