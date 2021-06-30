let Cells;
var generationsArray = [];
let grid;
let automated = false;

const GridContainer = document.getElementById('grid');
const populationbtn = document.getElementById('populate');
const beginLifeCyclebtn = document.getElementById('begin-life-cycle');
const automatebtn = document.getElementById('automate');


function Automate()
{
    automatebtn.style.color = automatebtn.style.color == 'rgb(196, 196, 196)' ? 'yellow' : 'rgb(196, 196, 196)';
    automated = automated == true ? false : true;
}

function CreateGrid()
{
    for(i = 0; i < 625; i++){
        var cell = document.createElement('div');
        cell.className = ('cell');
        GridContainer.appendChild(cell);
    }
    
    Populate();
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
    
    Cells = document.getElementsByClassName('cell');
    generationsArray = [];

    grid = Make2DArray();
    for(i = 0; i < 25; i++){
        for(j = 0; j < 25; j++){
            grid[i][j] = Math.floor(Math.random() * 2);
        }
    }
    
    UpdateScreen();
}

function UpdateScreen()
{
    var currentGridlength = grid.length;
    let currentGrid = new Array(currentGridlength);
    for(l=0; l<currentGridlength; l++)
    {
        currentGrid[l] = grid[l].slice(0);
    }
    
    generationsArray.push(currentGrid);
    
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

            NewGen(x, y, n);
            currentCell++;
        }
    }
    UpdateScreen();
}
function NewGen(x, y, liveNeighbors)
{
    if(grid[x][y] == 1)
    { 
        if(liveNeighbors < 2 || liveNeighbors > 3)
        {
            grid[x][y] = 0;
        }
        else
        {
            grid[x][y] = 1;
        }
    }
    else
    {
        if(liveNeighbors == 3)
        {
            grid[x][y] = 1;
        }
        else
        {
            grid[x][y] = 0;
        }
    }
}


automatebtn.addEventListener('click', ()=>Automate());
populationbtn.addEventListener('click', ()=>CreateGrid());
beginLifeCyclebtn.addEventListener('click', ()=>CalculateGen());