Server for creating multi device web experiences with 1 device hosting a game and the other devices connecting as controllers.

Proposed Communication Model:

For each game there is:

1. A Singluar game_state
2. N number of controller_state

All these states need to be passed back and forth through the server asynchronsly and with minmal blockage. In order to avoid the need for data locking with mutexs such, this data model adopts a few tenants about the data and how it is managed:

1. The server will not create any data. Rather the server merely provides the functionality for storing, routing and updating the data.
2. The game will create and only write to game_state. The game will only read controller_state.
3. The controller will create and write to controller_state. The controller will only read from game_state.
4. Any variable that needs to be updated by both controller and game, will need to have copies in both states and some methodology for update and conflict management.
5. The server assumes the game will set controller_template, can_connect and num_controllers in game_state before controllers can be created on the game.

Communication is done via the following end points:

/post-game-data/<game_id>
The game posts game_state to the server.

/post-controller-data/<game_id>/<controller_id>
The controller posts controller_state to the server.

/get-controller-data/<game_id>
The game requests controller data from the server. Returns an array of all controller_states for the game.

/get-game-data/<game_id>
The controllers request game_state from the server.
