const messagebird = require('messagebird')(process.env.MESSAGEBIRD);
module.exports = function registerHook({
  exceptions
}) {

  return {
    'items.update': async function (input) {
      if (input.collection !== 'companies') return input;
      console.log('Hook triggered!');
      if (!Object.keys(input.payload).includes('is_present')) {
        return input;
      }
      // Get all companies with id, is_present
      let companies = await input.database("companies")
        .select("id", "is_present", "phone");

      console.log("is_present aangepast");


      let aanwezig = companies.filter(company => company.is_present === true);
      let afwezig = companies.filter(company => company.is_present === false);

      console.log("aanwezig " + aanwezig.length);
      console.log("afwezig " + afwezig.length);

      let is_leaving = input.payload.is_present === false;
      if (aanwezig.length === 1 && is_leaving) {
        let last_one = aanwezig[0];
        console.log(last_one.id);
        console.log(last_one.phone);
        var params = {
          'to': `+310646319017`,
          'from': '0a8c4e09-e9d7-459d-97fc-4556755b9a4b',
          'type': 'text',
          'content': {
            'text': 'Je bent de laatste in het pand. Vergeet niet het alarm erop te doen :)'
          },
        };
        messagebird.conversations.send(params, function (err, response) {
          if (err) {
            return console.log(err);
          }
          console.log(response);
        });
      }

      return input;
    },
  };
};