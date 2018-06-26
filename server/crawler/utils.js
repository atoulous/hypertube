'use strict'

const beautifyTorrentName = (name) => {
	name = name.replace(/\./g, ' ')
	name = name.replace('[DivX]', '')
	name = name.split("1080p")[0]
	name = name.split("720p")[0]
	name = name.split("Bluray")[0]
	name = name.split("[HDRip]")[0]
	name = name.split("[HDTV]")[0]
	name = name.split("[WEB]")[0]
	name = name.split("HDRip")[0]
	name = name.split("HDTV")[0]
	name = name.split("2160p")[0]
	name = name.split("WEB")[0]
	name = name.split("tv")[0]
	name = name.split("[DVD-Rip]")[0]
	name = name.split("iNTERNAL")[0]
	name = name.split("SUBBED")[0]
	name = name.split("MPEG-4")[0]
	name = name.split("x264")[0]
	name = name.split("EXTENDED")[0]
	name = name.replace(/([sS][0-9]{1,2}[eE][0-9]{1,2})(.*)/g, '$1')

	let year = 1970
	while ( year <= 2019 ) {
		name = name.split("(" + year + ")")[0]
		name = name.split(year)[0]
		year++
	}

	if (name.endsWith(' '))
		name = name.substring(0, name.length - 1)
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
