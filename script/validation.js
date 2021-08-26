
const setCookie = (cname,cvalue) => {
	var d = new Date();
	d.setTime(d.getTime() + (24*60*60*1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const getCookie = (cname) => {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

const delCookie = ( cek ) => {
	const cookie = document.cookie.split(';');
	for (let i = 0; i < cookie.length; i++) {
		let chip = cookie[i],
			entry = chip.split("="),
			name = entry[0];

		document.cookie = name + '= ; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
	}
	// window.parent.location.href = indexUrl;
}

const deleteAllCookies = () => {
	const cookie = document.cookie.split(';');
	for (let i = 0; i < cookie.length; i++) {
		let chip = cookie[i],
			entry = chip.split("="),
			name = entry[0];
		document.cookie = name + '= ; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
	}
    // window.parent.location.href = indexUrl;
}

const checkCookie = () => {
	const user = getCookie("userid");
	$('#TxtNamaAgent').text(user);
	
	if(!user){
        window.parent.location.href = indexUrl;
    }
} 
// checkCookie();
// const username = getCookie("userid");