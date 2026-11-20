let box = document.getElementById("box");

let x = 100;
let y = 100;
let speed = 600;
let diagonal = -0.33;
let playerprojectile = [];

let deltaTime = 0;
let lastFrameTime = 0;

//enemies
let enemies = [];
let lastEnemySpawn = 0;
let enemySpawnDelay = 2000;




let keys = {};

// shooting settings
let shootDelay = 120;      // ms between shots while holding J
let lastShot = 0;
let projectileSpeed = 720;

// KEYBOARD DETECTOR
document.addEventListener("keydown", function(event) {
    keys[event.key.toLowerCase()] = true;
});

document.addEventListener("keyup", function(event) {
    keys[event.key.toLowerCase()] = false;
});


// Shooting a bullet method
function shoot() 
{
    let bullet = document.createElement("div");
    bullet.classList.add("projectile");

    document.body.appendChild(bullet);

    // Moving the bullet

    playerprojectile.push({
        element: bullet,
        x: x + box.offsetWidth,
        y: y + box.offsetHeight / 2,
        speed: 1000
    });
}

function spawnEnemy()
{
    let enemy = document.createElement("div");
    enemy.classList.add("enemy");
    // Add to the HTML BODY
    document.body.appendChild(enemy);
    enemy.style.left = window.innerWidth - 50 + "px";
    enemy.style.top = Math.random() * (window.innerHeight - 50) + "px";

    enemies.push(
        {
            element: enemy,
            x: window.innerWidth,
            speed: 200
        }
    );
}



function gameLoop(time) {
    deltaTime = (time - lastFrameTime) / 1000;
    lastFrameTime = time;

    // Focus mode
    if (keys["shift"]) 
    {
        speed = 300;
    } 
    else 
    {
        speed = 600;
    }

    let dx = 0;
    let dy = 0;
    

    // basic movement
    if (keys["w"]) dy -= 1;
    if (keys["s"]) dy += 1;
    if (keys["a"]) dx -= 1;
    if (keys["d"]) dx += 1;

    // diagonal movement
    if (dx !== 0 && dy !== 0) {
    dx *= 0.77;
    dy *= 0.77;
    }
    x += dx * speed * deltaTime;
    y += dy * speed * deltaTime;
    // move player box
    box.style.left = x + "px"; 
    box.style.top = y + "px"; 



    

    x = Math.max(0, Math.min (window.innerWidth - box.offsetWidth, x)); // Left / Right wall 
    y = Math.max(0, Math.min (window.innerHeight - box.offsetHeight, y)); // Up / Down wall




    // shooting 
    if (time - lastShot >= shootDelay) {
        shoot();
        lastShot = time;
    }

    // move projectiles 
    for (let i = playerprojectile.length - 1; i >= 0; i--) {
        let p = playerprojectile[i];

        p.x += p.speed * deltaTime;

        p.element.style.left = p.x + "px";
        p.element.style.top = p.y + "px";

        if (p.x > window.innerWidth) {
            p.element.remove();
            playerprojectile.splice(i, 1);
        }
    }

    //Spawn enemies 
    if (time - lastEnemySpawn >= enemySpawnDelay) 
    {
        spawnEnemy();
        lastEnemySpawn = time;
        enemySpawnDelay -= 50;
    }
    if (enemySpawnDelay < 300)
    {
        enemySpawnDelay = 305;
    }
    


    // Move enemies
    for (let i = enemies.length - 1; i >= 0; i--) 
    {
    let enemy = enemies[i];

    enemy.x -= enemy.speed * deltaTime;

    enemy.element.style.left = enemy.x + "px";
        if (enemy.x < -50) 
    {
        enemy.element.remove();
        enemies.splice(i, 1);
    }
    }





    requestAnimationFrame(gameLoop);
}


requestAnimationFrame(gameLoop);
