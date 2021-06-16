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
        let phones = [];
        if(last_one.phone.includes(',')){
          phones = last_one.phone.split(',');
        } else {
          phones = last_one.phone;
        }
        phones.forEach(phone => {
          var params = {
            'to': `+31${phone}`,
            'from': '0a8c4e09-e9d7-459d-97fc-4556755b9a4b',
            'type': 'hsm',
            'content': {
              'hsm': {
                "namespace": "7c4552d3_e8d8_4a4f_bd08_170e161b2780",
                "templateName": "de_laatste_test",
                "language": {
                  "policy": "deterministic",
                  "code": "nl"
                  },
              }
            },
            "reportUrl":"https://example.com/reports"
          };
          messagebird.conversations.send(params, function (err, response) {
            if (err) {
              return console.log(err);
            }
            console.log(response);
          });
        })
      }

      return input;
    },
  };
};