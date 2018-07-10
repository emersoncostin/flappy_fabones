// Create our 'main' state that will contain the game
var mainState = {
    preload: function() { 
        game.load.image('bird', 'assets/fabao.png'); 
        game.load.image('cord', 'assets/cord.png');
        game.load.image('phone', 'assets/phone.png');
        game.load.image('phoneinverse', 'assets/phone_inverse.png');
        game.load.image('cloud', 'assets/cloud.png');
    },

    create: function() { 
        game.stage.backgroundColor = '#71c5cf';

        //sistema de física
        game.physics.startSystem(Phaser.Physics.ARCADE);
    


        //grupo de nuvens
        this.clouds = game.add.group();

        //grupo de telefones
        this.pipes = game.add.group(); 

        //adiciona o fabão como passáro na posição x100 e y100
        this.bird = game.add.sprite(100, 100, 'bird');
    
        // Seta física no fabão
        // Needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.bird);
    
        // Gravidade de 1000 no fabão
        this.bird.body.gravity.y = 1000;  

        //pular ao clicar na tela...
        game.input.onDown.add(this.jump, this);
    
        // Pular ao apertar barra de espaço
        var spaceKey = game.input.keyboard.addKey(
                        Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);  

        //adicionar nuvens iniciais na posicao x400, y350
        this.addClouds(400, 350);

        //a cada 1,5 segundos adicionar os telefones
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this); 

        //placar
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" }); 
        
        //aviso de morte
        this.morreu = game.add.text(20,200, "", { font: "24px Arial", fill: "red" })

        

        //botao de continue
        this.continue = game.add.text(20, 300, "", { font: "24px Arial", fill: "white" })
        
        this.bird.anchor.setTo(-0.2, 0.5); 
    },

    addClouds: function(x, y){
        var cloud = game.add.sprite(x, y, 'cloud');
        this.clouds.add(cloud);

        game.physics.arcade.enable(cloud);

        //velocidade das nuvens diferente da velocidade dos canos para dar um efeito de paralax
        cloud.body.velocity.x = -150; 

        //checa de está fora do jogo e destroi as nuvens
        cloud.checkWorldBounds = true;
        cloud.outOfBoundsKill = true;

    },

    addOneCord: function(x, y) {
        // Create a phone at the position x and y
        var pipe = game.add.sprite(x, y, 'cord');
    
        // Add the phone to our previously created group
        this.pipes.add(pipe);
    
        // Enable physics on the phone
        game.physics.arcade.enable(pipe);
    
        // Add velocity to the phone to make it move left
        pipe.body.velocity.x = -200; 
    
        // Automatically kill the phone when it's no longer visible 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addOnePhone: function(x, y) {
        // Create a phone at the position x and y
        var pipe = game.add.sprite(x, y, 'phone');
    
        // Add the phone to our previously created group
        this.pipes.add(pipe);
    
        // Enable physics on the phone 
        game.physics.arcade.enable(pipe);
    
        // Add velocity to the phone to make it move left
        pipe.body.velocity.x = -200; 
    
        // Automatically kill the phone when it's no longer visible 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addOnePhoneInverse: function(x, y) {
        // Create a pipe at the position x and y
        var pipe = game.add.sprite(x, y, 'phoneinverse');
    
        // Add the pipe to our previously created group
        this.pipes.add(pipe);
    
        // Enable physics on the pipe 
        game.physics.arcade.enable(pipe);
    
        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200; 
    
        // Automatically kill the pipe when it's no longer visible 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {
        // Randomly pick a number between 1 and 6
        // Esse vai ser o espaço pro fabão passar
       
        var hole = Math.floor(Math.random() * 6) + 1;
    
        // Adicionar 9 elementos no array
        // Deixar espaço no numero selecionado 'hole' e 'hole + 1' e 'hole + 2'
        for (var i = 0; i < 10; i++){
            //se i for diferente dos números selecionados para serem espaços adicionar os telefones
            if (i != hole && i != hole + 1 && i != hole + 2 ) {
                //hole + 3 será o telefone virado para cima
                if(i == hole + 3){
                    this.addOnePhone(400, i * 50 );
                //hole - 1 será o telefone virado para baixo
                }else if(i == hole - 1){
                    this.addOnePhoneInverse(400, i * 50 );
                }
                //outros numeros serão os fios do telefone
                else{
                this.addOneCord(400, i * 50 ); } }

                //adicionar nuvens a cada uma vez que adiciona os telefone
                if(i == 6){
                    //escolhe um numero randomico pra determinar a posição da nuvem
                    var nuve = Math.floor(Math.random() * 5);
                    if(nuve == 0){
                        this.addClouds(400, 50);
                    }else if(nuve == 1){
                        this.addClouds(400, 150);
                    }else if(nuve == 2){
                        this.addClouds(400, 250);
                    }else if(nuve == 3){
                        this.addClouds(400, 350);
                    }
                    
                }
        }
        //score mais um a cada 1,5 segundos
        this.score += 1;
        this.labelScore.text = this.score;  
    },

    showContinue: function(){
        this.continue.text = "Aperte para continuar"
    },

    hitPipe: function() {
        // Se acertar no caso desativar ação de clique
        //
        if (this.bird.alive == false)
            return;
    
        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipes from appearing
        game.time.events.remove(this.timer);

        this.morreu.text = "Morreu: Você atendeu a Digiane";
    
        // Go through all the pipes, and stop their movement
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);

        game.input.onDown.remove(this.jump, this);
        var spaceKey = game.input.keyboard.addKey(
            Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.remove(this.jump, this);   

    }, 



    update: function() {
        // This function is called 60 times per second    
        // It contains the game's logic   
        if (this.bird.angle < 20){
        this.bird.angle += 1;}

        if (this.bird.y < 0 || this.bird.y > 490){

            this.continue.text = "Aperte para iniciar novamente";
            game.input.onDown.add(this.restartGame, this);
            var spaceKey = game.input.keyboard.addKey(
                Phaser.Keyboard.SPACEBAR);
            spaceKey.onDown.add(this.restartGame, this);   

            this.bird.alive = false;

            // Prevent new pipes from appearing
            game.time.events.remove(this.timer);



        //this.restartGame();
    }

        game.physics.arcade.overlap(
            this.bird, this.pipes, this.hitPipe, null, this);
    },

    jump: function() {
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;

        // Create an animation on the bird
        var animation = game.add.tween(this.bird);

        // Change the angle of the bird to -20° in 100 milliseconds
        animation.to({angle: -20}, 100);

        // And start the animation
        animation.start(); 

        if (this.bird.alive == false){
            
            return;
        }

    },
    
    // Restart the game
    restartGame: function() {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },
};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState); 

// Start the state to actually start the game
game.state.start('main');