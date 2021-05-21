const messagebird = require('messagebird')(process.env.MESSAGEBIRD, null, [
    'ENABLE_CONVERSATIONSAPI_WHATSAPP_SANDBOX',
]);
module.exports = function registerHook({ exceptions }) {

	return {
		'users.update': async function (input) {
            console.log('Hook triggered!');
            if(!Object.keys(input.payload).includes('is_present')){
                return input;
            }
                // Get all users with id, is_present
                let users = await input.database("directus_users")
                    .select("id", "is_present", "phone");
                
                console.log("is_present aangepast");


                let aanwezig = users.filter(user => user.is_present === true);
                let afwezig = users.filter(user => user.is_present === false);
                
                console.log("aanwezig " + aanwezig.length);
                console.log("afwezig " + afwezig.length);

                let is_leaving = input.payload.is_present === false;
                if(aanwezig.length === 1 && is_leaving){
                    let last_one = aanwezig[0];
                    console.log(last_one.id);
                    console.log(last_one.phone);
                    messagebird.conversations.reply(
                        'ac9fec9e799b40e7a156febffa38d152',
                        {
                          type: 'text',
                          content: {
                            text: 'JO MAAT JE BENT DE LAATSTE IN DA HOUSE JE WEET ZELF BROER',
                          },
                        },
                        function(err, response) {
                          if (err) {
                            return console.log(err);
                          }
                          console.log(response);
                        },
                      );
                }
                
			return input;
		},
	};
};