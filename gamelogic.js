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
//enemies bullets
let enemyBullets = [];
let enemyBulletsSpeed = 350;




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

    // Putting bullet in the array

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

    //Enemy start position

    let enemyX = window.innerWidth;
    let enemyY = Math.random() * (window.innerHeight - enemy.offsetHeight)

    enemy.style.left = enemyX + "px";
    enemy.style.top = enemyY + "px";

    // Store enemy data in the array 
    enemies.push
    (
        {
            element: enemy,
            x: enemyX,
            y: enemyY,
            speed: 200,
            lastShot: 0,
            shootDelay:1500
        }
    );

    //
}

// Checking if one square above another. 
function checkCollision(bullet, enemy)
{
    let bulletRec = bullet.getBoundingClientRect()
    let enemyRec = enemy.getBoundingClientRect();

    //Return give us True of false 
return (
    bulletRec.left < enemyRec.right &&
    bulletRec.right > enemyRec.left &&
    bulletRec.top < enemyRec.bottom &&
    bulletRec.bottom > enemyRec.top
);
}

function enemyShoot(enemy)
{
    let bullet = document.createElement("div");
    bullet.classList.add("enemyprojectile")
    document.body.appendChild(bullet);

    //Starting position of the bullet 
    let bulletX = enemy.x - 10;
    let bulletY = enemy.y + enemy.element.offsetHeight / 2;

    //Player Position
    let targetX = x + box.offsetWidth / 2;
    let targetY = y + box.offsetHeight / 2;

    //Direction to the player from enemy
    let directionX = targetX - bulletX;
    let directionY = targetY - bulletY;

    // Theorema Pithagora 
    let distance = Math.hypot(directionX, directionY)

    //If the bullet touches the player,than we delete the bullet
    if (distance === 0)
    {
        bullet.remove();
        return;
    }

    // Store the bullet in the enemy bullet array
    enemyBullets.push
    ({
        element: bullet,
        x: bulletX,
        y: bulletY,
        velocityX: directionX / distance * enemyBulletsSpeed,
        velocityY: directionY / distance * enemyBulletsSpeed
    });
    bullet.style.left = bulletX + "px";
    bullet.style.top = bulletY + "px";
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

    //Remove enemy if it leaves the screen
        if (enemy.x < -50) 
    {
        enemy.element.remove();
        enemies.splice(i, 1);
        continue;
    }

    //Enemy Shooting
    if (time - enemy.lastShot >= enemy.shootDelay)
    {
        enemyShoot(enemy);
        enemy.lastShot = time;
    }
}
    
    // Move enemy bullets
    for(let i = enemyBullets.length - 1; i >= 0; i--)
    {
        let bullet = enemyBullets[i];

        bullet.x += bullet.velocityX * deltaTime;
        bullet.y += bullet.velocityY * deltaTime;

        bullet.element.style.left = bullet.x + "px";
        bullet.element.style.top = bullet.y + "px";

        //Checking if the bullet is out of the screen
        if(
            bullet.x < -10 ||
            bullet.x > window.innerWidth ||
            bullet.y < -10 ||
            bullet.y > window.innerHeight
        )
        // Bullet enemy remove the div and enemy bullet splice remove it from array
        {
            bullet.element.remove();
            enemyBullets.splice(i, 1);
        }
    }
    //Player bullet collision with enemies
    for (let i = playerprojectile.length - 1; i >= 0; i--)
    {
        let bullet = playerprojectile[i];

        for(let j = enemies.length - 1; j >= 0; j--)
        {
            let enemy = enemies[j];
            if (checkCollision(bullet.element, enemy.element))
            {
                //Remove player bullet
                bullet.element.remove();
                playerprojectile.splice(i,1);

                //Remove enemy(One shot killing him)
                enemy.element.remove();
                enemies.splice(j, 1);

                break;
            }
        }
    }
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);



