/** Allows web applications to register conditions under which an user will be asked to confirm exiting the page.
*
*@namespace
*/
var Jailor;

(function(GLOBAL) {
	/** Stores all conditions to evaluate before deciding whether the user should be asked to confirm page leave or not.
	*
	*@private
	*/
	var conditions = [];


	Jailor = {
		/** Attaches Jailor to the `onbeforeunload` event.
		*
		*@private
		*/
		init: function initJailor() {
			var previousBeforeUnloadHandler = GLOBAL.onbeforeunload;

			GLOBAL.onbeforeunload = Jailor.locked;

			Jailor.lock(previousBeforeUnloadHandler);
		},

		/** Adds a condition that may ask the user to confirm leaving the page.
		*
		*@param	{Function}	condition	A closure that expects no parameter and returns a user-presentable String if it is supposed to ask the user for confirmation on page leave.
		*@returns	Jailor, for chainability
		*/
		lock: function lock(condition) {
			if (condition)
				conditions.push(condition);

			return this;
		},

		/** Evaluates all conditions.
		*
		*@returns	{String}	A String describing the conditions that were not fulfilled, or nothing if all conditions are fulfilled.
		*/
		locked: function locked() {
			var result = [];

			conditions.forEach(function(condition) {
				var evaluationResult = condition();

				if (typeof evaluationResult == 'string'
					&& result.indexOf(evaluationResult) < 0)	// do not store duplicate messages
					result.push(evaluationResult);
			});

			return result.join('\n\n• ') || null;	// join will always return a string, and even the empty string triggers a confirmation dialog
		},

		/** Clears all conditions.
		*
		*@returns	Jailor, for chainability
		*/
		bail: function bail() {
			conditions = [];

			return this;
		}
	}


	Jailor.init();
})(window);
