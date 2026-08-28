const validate = require('@stackline/har-validator')

validate.creator({ name: 'example', version: '1.0.0' })
  .then((creator) => console.log(creator.name))
