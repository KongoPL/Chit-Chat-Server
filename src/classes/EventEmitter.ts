class EventEmitter<T>
{
	private listeners: ( ( data: T ) => void )[];

	constructor()
	{
		this.listeners = [];
	}

	subscribe( callback: ( data?: T ) => void ): { unsubscribe: () => void }
	{
		this.listeners.push( callback );

		return {
			unsubscribe: () => { this.unsubscribe( callback ); }
		};
	}


	unsubscribe( callback: ( data?: T ) => void )
	{
		this.listeners = this.listeners.filter( ( v ) => v != callback );
	}


	emit( data: T )
	{
		for ( let i = 0; i < this.listeners.length; i++ )
			this.listeners[i]( data );
	}
}

global['EventEmitter'] = EventEmitter;