var nodemailer = require('nodemailer')
var vmatcha = 'v.matcha42@gmail.com'
var vmatchap = '222222qQ'

class  Sendmail {
	static newmail(dest, message, subject) {
		var transporter = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
				user: vmatcha,
				pass: vmatchap
			}
		})
		var mailOptions = {
			from: vmatcha,
			to: dest,
			subject: subject,
			text: message
		};
		transporter.sendMail(mailOptions, (error, info) => {
		}); 
	}
}

module.exports = Sendmail
