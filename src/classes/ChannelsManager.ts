class ChannelsManager
{
	static channels: Array<Channel> = [];

	static requestChannel( owner: string = '' ): Channel
	{
		let id = this.getUniqueChannelId( 10 );
		let channel = new Channel( id, owner );

		this.channels[id] = channel;

		return channel;
	}


	static joinChannel( id: string, userId: string, client: SocketIO.Socket ): Channel | null
	{
		if ( this.hasChannel( id ) )
		{
			let channel = this.getChannel( id );

			channel.join( userId, client );

			return channel;
		}

		return null;
	}


	static leaveChannel( id: string, userId: string ): boolean
	{
		if ( this.hasChannel( id ) )
		{
			let channel = this.getChannel( id );

			if ( channel.leave( userId ) )
			{
				if ( channel.isEmpty() )
					this.destroyChannel( id );

				return true;
			}

		}

		return false;
	}


	static destroyChannel( id: string )
	{
		this.channels[id] = null;
	}


	private static getChannel( id: string ): Channel
	{
		return ( this.hasChannel( id ) ? this.channels[id] : null );
	}


	private static hasChannel( id: string ): boolean
	{
		return ( typeof this.channels[id] != 'undefined' && this.channels[id] !== null );
	}


	private static getUniqueChannelId( length: number ): string
	{
		let channelId;

		do
		{
			channelId = StringHelper.generateRandomId( length );
		}
		while ( this.hasChannel( channelId ) );

		return channelId;
	}
}

global['ChannelsManager'] = ChannelsManager;