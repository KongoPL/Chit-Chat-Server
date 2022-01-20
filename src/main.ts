const fs = require( 'fs' );

eval( fs.readFileSync( __dirname + '/classes/MathHelper.js', 'utf8' ) );
eval( fs.readFileSync( __dirname + '/classes/StringHelper.js', 'utf8' ) );
eval( fs.readFileSync( __dirname + '/classes/EventEmitter.js', 'utf8' ) );

eval( fs.readFileSync( __dirname + '/classes/ChannelsManager.js', 'utf8' ) );
eval( fs.readFileSync( __dirname + '/classes/ClientsManager.js', 'utf8' ) );
eval( fs.readFileSync( __dirname + '/classes/Channel.js', 'utf8' ) );

const port = process.env.PORT || 4321;

var socketServer = require( 'socket.io' )( port );//,
	// peerServer = require( 'peer' ).PeerServer( { port: 4322 } );



socketServer.on( 'connection', ( client: SocketIO.Socket ) =>
{
	var clientId = ClientsManager.getUniqueId( 10 ),
		connectedChannels: string[] = [];

	client.emit( 'connected', clientId ); // Cause normal connection event doesn't seem to work

	client.on( 'requestChannel', ( data ) =>
	{
		let channel = ChannelsManager.requestChannel( clientId );

		client.emit( 'requestChannel', channel.id );
	} );

	client.on( 'joinChannel', ( channelId ) =>
	{
		let channel = ChannelsManager.joinChannel( channelId, clientId, client );

		if ( channel )
		{
			connectedChannels.push( channel.id );

			client.emit( 'joinChannel', channel.toArray() );
		}
		else
			client.emit( 'joinChannel', null );
	} );

	client.on( 'leaveChannel', ( channelId ) =>
	{
		let leaved = ChannelsManager.leaveChannel( channelId, clientId );

		connectedChannels = connectedChannels.filter( ( id: string ) => ( id != channelId ) );

		client.emit( 'leaveChannel', leaved );
	} );

	client.on( 'disconnect', () =>
	{
		for ( let c in connectedChannels )
			ChannelsManager.leaveChannel( connectedChannels[c], clientId );

		ClientsManager.releaseId( clientId );
	} );
} );

console.clear();
console.log( "Server running at "+port+" and 4322!" );