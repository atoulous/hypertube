'use strict'

const beautifyTorrentName = (name) => {
	name = name.replace('.', ' ')
	name = name.split("1080p")[0]
	name = name.split("720p")[0]
	name = name.split("Bluray")[0]
	name = name.split("HDRip")[0]
	name = name.split("HDTV")[0]
	name = name.split("WEB")[0]

	let year = 2010
	while ( year <= 2019 ) {
		name = name.split("(" + year + ")")[0]
		name = name.split(year)[0]
		year++
	}
	name = name.replace('.', ' ')

	return name
}

const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const timeout = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
	beautifyTorrentName, shuffle, timeout
}
