class ClientsManager
{
	static ids: string[] = [];

	public static getUniqueId( length: number ): string
	{
		let id;

		do
		{
			id = StringHelper.generateRandomId( length );
		}
		while ( this.hasId( id ) );

		this.ids.push( id );

		return id;
	}


	public static releaseId( id: string ): void
	{
		for ( let i = 0; i < this.ids.length; i++ )
			if ( this.ids[i] == id )
				delete this.ids[i];
	}


	protected static hasId( id: string ): boolean
	{
		for ( let i = 0; i < this.ids.length; i++ )
			if ( this.ids[i] == id )
				return true;

		return false;
	}
}

global['ClientsManager'] = ClientsManager;