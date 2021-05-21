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
                
                console.log(users);
                console.log("is_present aangepast");


                let aanwezig = users.filter(user => user.is_present === true);
                let afwezig = users.filter(user => user.is_present === false);
                
                console.log("aanwezig " + aanwezig.length);
                console.log("afwezig " + afwezig.length);

                console.log(input);

                let is_leaving = input.payload.is_present === false;
                if(aanwezig.length === 1 && is_leaving){
                    let last_one = aanwezig[0];
                    console.log(last_one.id);
                    console.log(last_one.phone);

                }
                
			return input;
		},
	};
};