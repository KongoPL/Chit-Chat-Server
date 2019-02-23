class MathHelper
{
	static rand( min: number, max: number ): number
	{
		return Math.round( ( max - min ) * Math.random() + min );
	}
}

global['MathHelper'] = MathHelper;