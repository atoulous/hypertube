class Secu {
	static verif(data) {
		if (data === undefined || data === '')
			return false
		else
			return true
	}

	static isEmail(data) {
		var em = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		if (em.test(data))
			return true
		else
			return false
	}

	static isGoodPassword(data) {
		var min = /[a-z]/
		var maj = /[A-Z]/
		var num = /[0-9]/
		if (!num.test(data) || !maj.test(data) || !min.test(data) || data.length < 8)
			return false
		else
			return true
	}

    static isValid(data) {
        var reg=/^[a-zA-Z0-9àäâéèêëïîöôùüû\s]*$/i
        if (reg.test(data) && data.length < 50)
            return true
        else
            return false
    }
}

module.exports = Secu
