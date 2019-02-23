class Channel
{
	public id: string;
	public owner: string;
	public users: string[];

	private clients: SocketIO.Socket[];

	constructor( id: string, owner: string = '', users: string[] = [], clients: SocketIO.Socket[] = [] )
	{
		this.id = id;
		this.owner = owner;
		this.users = users;
		this.clients = clients;
	}


	public join( userId: string, client: SocketIO.Socket ): boolean
	{
		for ( let c in this.users )
		{
			if ( this.users[c] == userId )
				return true;
		}

		this.users.push( userId );
		this.clients.push( client );

		return true;
	}


	public leave( userId: string ): boolean
	{
		for ( let c in this.users )
		{
			if ( this.users[c] == userId )
			{
				this.users.splice( parseInt( c ), 1 );
				this.clients.splice( parseInt( c ), 1 );

				if ( userId == this.owner )
					this.setRandomOwner();

				// Firefox have problem with good supporting of WebRTC, so server also have to say about leaving:
				this.broadcastMessage( 'userDisconnected', userId );

				return true;
			}
		}

		return false;
	}


	public isEmpty(): boolean
	{
		return ( this.users.length == 0 );
	}


	public toArray()
	{
		return {
			id: this.id,
			owner: this.owner,
			users: this.users
		};
	}


	private setRandomOwner()
	{
		if ( this.users.length > 0 )
		{
			this.owner = this.users[MathHelper.rand( 0, this.users.length - 1 )];

			this.broadcastMessage( 'changeOwner', this.owner );
		}
	}


	private broadcastMessage( eventName: string, ...data: any[] )
	{
		for ( let client of this.clients )
			client.emit( eventName, ...data );
	}
}

global['Channel'] = Channel;