class StringHelper
{
	public static generateRandomId( length: number, chars = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890' )
	{
		let id = '';

		for ( let i = 0; i < length; i++ )
			id += chars[MathHelper.rand( 0, chars.length - 1 )];

		return id;
	}
}

global['StringHelper'] = StringHelper;