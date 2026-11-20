// 敵：作る・入れる・動かす・描く（気づく敵）

// ① 作る：敵を1体作って返す関数
function createEnemy(x, vx) {
  return {
    x: x,
    y: floor.y - 32,
    w: 32,
    h: 32,
    vx: vx,
    alive: true,
    type: "notice"  // プレイヤーに気づく敵
  };
}

// ② 入れる：敵をまとめて入れる配列
let enemies = [];

enemies.push(createEnemy(200, 80));
enemies.push(createEnemy(380, -120));
enemies.push(createEnemy(540, 60));
const special = createEnemy(300, 80);   // 作る（ほかの敵と同じ）
special.type = "faster";                // この敵だけが持つ値を足す
enemies.push(special);                  // 入れる

// ③ 動かす：プレイヤーが近づくと速くなる
function updateEnemies(dt) {

  for (const enemy of enemies) {

    // プレイヤーとの距離を調べる
    const distance = Math.abs(
      (player.x + player.w / 2) -
      (enemy.x + enemy.w / 2)
    );

    // type が "notice" なら
    if (enemy.type === "notice") {

      // プレイヤーが近くに来たら速くする
      if (distance < 150) {

        if (enemy.vx > 0) {
          enemy.vx += 50 * dt;
        }

        if (enemy.vx < 0) {
          enemy.vx -= 50 * dt;
        }

      }
    }

    // 敵を動かす
    enemy.x = enemy.x + enemy.vx * dt;

    // 端を越えたら、位置を戻して、向きを反対にする
    if (enemy.x < 0) {
      enemy.x = 0;
      enemy.vx = -enemy.vx;
    }

    if (enemy.x + enemy.w > canvas.width) {
      enemy.x = canvas.width - enemy.w;
      enemy.vx = -enemy.vx;
    }
  }
}

// プレイヤーとぶつかったとき
function collideWithEnemies(prevBottom) {

  for (const enemy of enemies) {

    if (aabb(player, enemy) &&
        prevBottom <= enemy.y &&
        player.vy > 0) {

      enemy.alive = false;
      player.vy = -JUMP_SPEED / 2;
    }
  }

  // 生きている敵だけを残す
  enemies = enemies.filter((enemy) => enemy.alive);
}

// ④ 描く：配列の敵を1体ずつ描く
function drawEnemies() {

  for (const enemy of enemies) {

    // 気づく敵なら色を変える
    if (enemy.type === "notice") {
      ctx.fillStyle = "#ffd166";
    }

    ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
  }

  ctx.fillStyle = "#e8eeff";
  ctx.fillText("敵 = " + enemies.length, 10, 40);
}