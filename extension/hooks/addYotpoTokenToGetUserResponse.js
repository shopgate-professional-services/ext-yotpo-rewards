const { createHash } = require('crypto')

module.exports = async (context, input) => {
  const { apiKey } = context.config
  let yotpoToken = null

  if (input && input.mail) {
    yotpoToken = createHash('sha256')
      .update(input.mail + apiKey)
      .digest('hex')
  }

  return {
    yotpoToken
  }
}
